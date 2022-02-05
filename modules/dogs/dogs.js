import { getFaunaError, getValueById, setupBasicRoutes } from '../utils';
import getDogResults from './getDogResults';

export default function setupRoutes(router, faunaClient) {
  setupBasicRoutes({
    router,
    faunaClient,
    routes: ['GETALL', 'POST', 'PATCH', 'DELETE'],
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

  router.add('GET', '/dogs/:id', async (req, res) => {
    try {
      const dogId = req.params.id;

      const dogPromise = getValueById(faunaClient, 'Dogs', dogId);
      const resultsPromise = getDogResults(faunaClient, dogId);

      const [dog, results] = await Promise.all([dogPromise, resultsPromise]);

      const fullDogData = {
        dog,
        results,
      };

      res.send(200, fullDogData);
    } catch (err) {
      const faunaError = getFaunaError(err);
      res.send(faunaError.status, faunaError);
    }
  });
}
