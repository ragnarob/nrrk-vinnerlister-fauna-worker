import jwt from 'jsonwebtoken';
import { getTokenPrivateKey, getTokenPublicKey } from './keys';

const tokenConfig = {
  tokenDurationDays: 60,
  algorithm: 'RS256',
  cookieName: 'nrrk-session',
  secure: true,
  httpOnly: true,
  domain: '',
  path: '/',
};

export default function setupRoutes(router) {
  router.add('POST', '/login', login);
}

async function login(req, res) {
  try {
    const { password } = req.body;
    // TODO salt
    const correctPassword = await DOG_KV.get('admin-pwd');

    if (password !== correctPassword) {
      return res.status(401).end('Invalid password');
    }

    const tokenBody = { auth: true };
    const token = await signToken(tokenBody);

    const expiresTime = new Date(Date.now() + tokenConfig.tokenDurationDays * 86400 * 1000);
    res.cookie(tokenConfig.cookieName, token, {
      httpOnly: tokenConfig.httpOnly,
      secure: tokenConfig.secure,
      domain: tokenConfig.domain,
      path: tokenConfig.path,
      expires: expiresTime,
    });

    res.status(200).end();
  } catch (err) {
    return res.status(500).end('Server error');
  }
}

export async function verifyAdminLoggedIn(req, res, next) {
  const validToken = await getCookieToken(req);
  if (!validToken) {
    res.status(401).end('Not logged in');
    return;
  }
  next();
}

async function getCookieToken(req) {
  const publicKey = await getTokenPublicKey();

  if (!req.cookies) {
    return null;
  }

  const cookieToken = req.cookies[tokenConfig.cookieName];
  if (!cookieToken) {
    return null;
  }

  try {
    const token = await verifyToken(cookieToken, publicKey);
    return token;
  } catch (err) {
    return null;
  }
}

async function verifyToken(token, publicKey) {
  const tokenOptions = {
    algorithms: [tokenConfig.algorithm],
  };

  return new Promise((resolve) => {
    jwt.verify(token, publicKey, tokenOptions, (err, body) => {
      if (err) {
        resolve(null);
      }
      resolve(body);
    });
  });
}

async function signToken(tokenData) {
  const tokenOptions = {
    algorithm: tokenConfig.algorithm,
    expiresIn: `${tokenConfig.tokenDurationDays}d`,
  };

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const privateKey = await getTokenPrivateKey();
    jwt.sign(tokenData, privateKey, tokenOptions, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
}
