import { setupBasicRoutes } from '../utils';

export default function setupRoutes(router, faunaClient) {
  setupBasicRoutes({
    router,
    faunaClient,
    routes: ['PATCH', 'DELETE'],
    routeName: 'contest-results',
    collectionName: 'ContestResults',
    indexName: 'all-contest-results',
  });

  // TODO: set up POST
}
