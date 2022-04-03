export async function getTokenPrivateKey() {
  return await DOG_KV.get('token-private-key');
}

export async function getTokenPublicKey() {
  return await DOG_KV.get('token-public-key');
}
