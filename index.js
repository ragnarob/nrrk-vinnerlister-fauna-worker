import { Router, listen } from 'worktop';
import faunadb from 'faunadb';
import setupDogRoutes from './modules/dogs.js';
import setupContestRoutes from './modules/contests.js';

const router = new Router();

const faunaClient = new faunadb.Client({
  secret: FAUNA_SECRET,
  domain: 'db.eu.fauna.com',
});

setupDogRoutes(router, faunaClient);
setupContestRoutes(router, faunaClient);

listen(router.run);