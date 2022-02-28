import { Collection, Delete, Ref } from 'faunadb';
import { getFaunaError, getValueById, setupBasicRoutes } from '../utils';
import { getDogResultRefs, getDogResults } from './getDogResults';

export default function setupRoutes(router, faunaClient) {
  setupBasicRoutes({
    router,
    faunaClient,
    routes: ['GETALL', 'POST', 'PUT'],
    routeName: 'dogs',
    collectionName: 'Dogs',
    indexName: 'all-dogs',
    postFields: [
      'name',
      'titles',
      'nkkId',
      'gender',
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

  router.add('DELETE', '/dogs/:id', async (req, res) => {
    try {
      const dogId = req.params.id;

      const dogResults = await getDogResultRefs(faunaClient, dogId);

      // eslint-disable-next-line no-restricted-syntax
      for await (const dogRes of dogResults) {
        const refId = dogRes.value.id;

        await faunaClient.query(
          Delete(Ref(Collection('ContestResults'), refId)),
        );
      }

      await faunaClient.query(
        Delete(Ref(Collection('Dogs'), dogId)),
      );

      res.send(200);
    } catch (err) {
      const faunaError = getFaunaError(err);
      res.send(faunaError.status, faunaError);
    }
  });
}
