import { setupBasicRoutes } from './utils';

export default function setupRoutes(router, faunaClient) {
  setupBasicRoutes({
    router,
    faunaClient,
    routes: ['POST', 'PATCH', 'DELETE'],
    routeName: 'contest-results',
    collectionName: 'ContestResults',
    indexName: 'all-contest-results',
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
