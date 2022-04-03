import { Collection, Delete, Ref } from 'faunadb';
import { verifyAdminLoggedIn } from '../auth/auth';
import { getFaunaError, getValueById, setupBasicRoutes } from '../utils';
import addContestCert from './addContestCert';
import { getContestResults, getContestResultRefs } from './getContestResults';

export default function setupRoutes(router, faunaClient) {
  setupBasicRoutes({
    router,
    faunaClient,
    routes: ['GETALL', 'POST', 'PUT'],
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

  router.add('PATCH', '/contests/:id', verifyAdminLoggedIn, (req, res) => addContestCert(req, res, faunaClient));

  router.add('GET', '/contests/:id', async (req, res) => {
    try {
      const contestId = req.params.id;

      const contestPromise = getValueById(faunaClient, 'Contests', contestId);
      const resultsPromise = getContestResults(faunaClient, contestId);

      const [contest, results] = await Promise.all([contestPromise, resultsPromise]);

      const fullContestData = {
        contest,
        results,
      };

      res.send(200, fullContestData);
    } catch (err) {
      const faunaError = getFaunaError(err);
      res.send(faunaError.status, faunaError);
    }
  });

  router.add('DELETE', '/contests/:id', async (req, res) => {
    try {
      const contestId = req.params.id;

      const contestResults = await getContestResultRefs(faunaClient, contestId);

      // eslint-disable-next-line no-restricted-syntax
      for await (const contRes of contestResults) {
        const refId = contRes.value.id;

        await faunaClient.query(
          Delete(Ref(Collection('ContestResults'), refId)),
        );
      }

      await faunaClient.query(
        Delete(Ref(Collection('Contests'), contestId)),
      );

      res.send(200);
    } catch (err) {
      const faunaError = getFaunaError(err);
      res.send(faunaError.status, faunaError);
    }
  });
}
