import { Router, listen } from 'worktop';
import faunadb from 'faunadb';
import setupDogRoutes from './modules/dogs/dogs';
import setupContestRoutes from './modules/contests/contests';
import setupContestResultRoutes from './modules/contest-results/contestResult';
import setupIndexRoutes from './modules/index-by-year/index-by-year';
import { setupAuth } from './modules/auth/auth';

const router = new Router();

const faunaClient = new faunadb.Client({
  secret: FAUNA_SECRET,
  domain: 'db.eu.fauna.com',
});

setupDogRoutes(router, faunaClient);
setupContestRoutes(router, faunaClient);
setupContestResultRoutes(router, faunaClient);
setupIndexRoutes(router, faunaClient);
setupAuth(router);

listen(router.run);
