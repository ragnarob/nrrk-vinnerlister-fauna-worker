import { setupBasicRoutes } from '../utils';

export default function setupRoutes(router, faunaClient) {
  setupBasicRoutes({
    router,
    faunaClient,
    routes: ['GETALL', 'POST', 'PATCH', 'DELETE'],
    routeName: 'contests',
    collectionName: 'Contests',
    indexName: 'all-contests',
    postFields: [
      'name',
      'date',
      'numberOfDogs',
      'location',
      'host',
      'judge',
    ],
  });

  // TODO: set up GET /:id
}
