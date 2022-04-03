import {
  Collection, Ref, Update,
} from 'faunadb';
import { createDocument, getFaunaError, setupBasicRoutes } from '../utils';

export default function setupRoutes(router, faunaClient) {
  setupBasicRoutes({
    router,
    faunaClient,
    routes: ['DELETE'],
    routeName: 'contest-results',
    collectionName: 'ContestResults',
    indexName: 'all-contest-results',
  });

  router.add('PATCH', '/contest-results/:id', async (req, res) => {
    try {
      const resultId = req.params.id;
      const newResult = await req.body();

      const updatedFields = {
        result: newResult.result || '',
        placement: newResult.placement || '',
        ck: newResult.ck || '',
      };

      await faunaClient.query(
        Update(
          Ref(Collection('ContestResults'), resultId),
          { data: updatedFields },
        ),
      );
    } catch (err) {
      const faunaError = getFaunaError(err);
      res.send(faunaError.status, faunaError);
    }
  });

  router.add('POST', '/contests/:id/results', async (req, res) => {
    try {
      const contestId = req.params.id;
      const results = await req.body();
      const addPromises = [];

      for (const result of results) {
        const contestResult = {
          dogRef: Ref(Collection('Dogs'), result.dogId),
          contestRef: Ref(Collection('Contests'), contestId),
          result: result.result || '',
          placement: result.placement || '',
          ck: result.ck || '',
        };

        addPromises.push(createDocument(faunaClient, 'ContestResults', contestResult));
      }

      await Promise.all(addPromises);
      res.end();
    } catch (err) {
      const faunaError = getFaunaError(err);
      res.send(faunaError.status, faunaError);
    }
  });
}
