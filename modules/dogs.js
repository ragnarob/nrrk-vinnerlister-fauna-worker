import { setupBasicRoutes } from './utils';

export default function setupRoutes(router, faunaClient) {
  setupBasicRoutes({
    router,
    faunaClient,
    routes: ['GET', 'GETALL', 'POST', 'PATCH', 'DELETE'],
    routeName: 'dogs',
    collectionName: 'Dogs',
    indexName: 'all-dogs',
    postFields: [
      'name',
      'titles',
      'nkkId',
      'gender',
      'color',
      'pedigreeDbLink',
      'fatherTitles',
      'fatherName',
      'fatherId',
      'motherTitles',
      'motherName',
      'motherId',
    ],
  });
}
