import faunadb, { Lambda } from 'faunadb';

const {
  Create, Collection, Map, Match, Index, Get, Ref, Paginate, Delete, Var, Replace,
} = faunadb.query;

export function setupBasicRoutes({
  router, faunaClient, routes, routeName, collectionName, indexName, postFields,
}) {
  if (routes.includes('GETALL')) {
    router.add('GET', `/${routeName}`, async (req, res) => {
      try {
        const allItems = await getAllValues(faunaClient, indexName);
        res.send(200, allItems);
      } catch (err) {
        const faunaError = getFaunaError(err);
        res.send(faunaError.status, faunaError);
      }
    });
  }

  if (routes.includes('GET')) {
    router.add('GET', `/${routeName}/:id`, async (req, res) => {
      try {
        const itemId = req.params.id;
        const item = await getValueById(faunaClient, collectionName, itemId);
        res.send(200, item);
      } catch (err) {
        const faunaError = getFaunaError(err);
        res.send(faunaError.status, faunaError);
      }
    });
  }

  if (routes.includes('POST')) {
    router.add('POST', `/${routeName}`, async (req, res) => {
      try {
        const body = await req.body();
        const newItem = {};
        // eslint-disable-next-line no-return-assign
        postFields.forEach((key) => newItem[key] = body[key]);

        const newItemId = await createDocument(faunaClient, collectionName, newItem);
        res.send(200, { id: newItemId });
      } catch (err) {
        const faunaError = getFaunaError(err);
        res.send(faunaError.status, faunaError);
      }
    });
  }

  if (routes.includes('PUT')) {
    router.add('PUT', `/${routeName}/:id`, async (req, res) => {
      try {
        const itemId = req.params.id;
        const body = await req.body();
        const updatedItem = {};

        for (const key of postFields) {
          updatedItem[key] = body[key];
        }

        await faunaClient.query(
          Replace(
            Ref(Collection(collectionName), `${itemId}`),
            { data: updatedItem },
          ),
        );

        res.send(200);
      } catch (err) {
        const faunaError = getFaunaError(err);
        res.send(faunaError.status, faunaError);
      }
    });
  }

  if (routes.includes('DELETE')) {
    router.add('DELETE', `/${routeName}/:id`, async (req, res) => {
      try {
        const itemId = req.params.id;
        await faunaClient.query(
          Delete(Ref(Collection(collectionName), itemId)),
        );
        res.send(200);
      } catch (err) {
        const faunaError = getFaunaError(err);
        res.send(faunaError.status, faunaError);
      }
    });
  }
}

export async function getAllValues(faunaClient, indexName) {
  const result = await faunaClient.query(
    Map(
      Paginate(
        Match(Index(indexName)),
      ),
      Lambda('X', Get(Var('X'))),
    ),
  );

  const mappedData = result.data.map((dataPoint) => ({
    id: dataPoint.ref.value.id,
    ...dataPoint.data,
  }));

  return mappedData;
}

export async function getValueById(faunaClient, collectionName, id) {
  const result = await faunaClient.query(
    Get(Ref(Collection(collectionName), id)),
  );

  const mappedData = {
    id: result.ref.value.id,
    ...result.data,
  };

  return mappedData;
}

export async function createDocument(faunaClient, collectionName, body) {
  const result = await faunaClient.query(
    Create(
      Collection(collectionName),
      { data: body },
    ),
  );

  return result.ref.id;
}

export function getFaunaError(error) {
  const { code, description } = error.requestResult.responseContent.errors[0];
  let status;

  switch (code) {
    case 'unauthorized':
    case 'authentication failed':
      status = 401;
      break;
    case 'permission denied':
      status = 403;
      break;
    case 'instance not found':
      status = 404;
      break;
    case 'instance not unique':
    case 'contended transaction':
      status = 409;
      break;
    default:
      status = 500;
  }

  return { code, description, status };
}
