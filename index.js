import { Router, listen } from 'worktop';
import faunadb, { Lambda } from 'faunadb';
import setupDogRoutes from './dogs.js';

const router = new Router();

const faunaClient = new faunadb.Client({
  secret: FAUNA_SECRET,
  domain: 'db.eu.fauna.com',
});

setupDogRoutes(router, faunaClient)

listen(router.run);