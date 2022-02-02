import { setupBasicRoutes } from './utils';

export default function setupRoutes(router, faunaClient) {
  setupBasicRoutes({
    router,
    faunaClient,
    routes: ['GET', 'GETALL', 'POST', 'PATCH', 'DELETE'],
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
}
