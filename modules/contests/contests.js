import { getFaunaError, getValueById, setupBasicRoutes } from '../utils';
import getContestResults from './getContestResults';

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
}
