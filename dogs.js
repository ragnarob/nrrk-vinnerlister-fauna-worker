import faunadb, { Lambda } from 'faunadb';
import { getFaunaError } from './utils.js';

const {
  Create, Collection, Map, Match, All, Index, Get, Ref, Paginate, Sum, Delete, Add, Select, Let, Var, Update
} = faunadb.query;


export default function setupRoutes(router, faunaClient) {
  router.add('GET', '/', async (req, res) => {
    res.send(200, 'hello world');
  });

  router.add('GET', '/dogs', async (req, res) => {
    try {
      const result = await faunaClient.query(
        Map(
          Paginate(
            Match(Index('allDogs'))
          ),
          Lambda('X', Get(Var('X')))
        )
      );

      let mappedData = result.data.map(resDataPt => {
        return {
          id: resDataPt.ref.value.id,
          ...resDataPt.data,
        }
      })

      res.send(200, mappedData);
    }
    catch (err) {
      const faunaError = getFaunaError(err);
      res.send(faunaError.status, faunaError);
    }
  })

  router.add('GET', '/dogs/:id', async (req, res) => {
    try {
      const dogId = req.params.id;
      const result = await faunaClient.query(
        Get(Ref(Collection('Dogs'), dogId))
      );

      let mappedData = {
        id: result.ref.value.id,
        ...result.data,
      }

      res.send(200, mappedData);
    }
    catch (err) {
      const faunaError = getFaunaError(err);
      res.send(faunaError.status, faunaError);
    }
  })

  router.add('POST', '/dogs', async (req, res) => {
    try {
      const {
        name, titles, nkkId, gender, color, pedigreeDbLink,
        fatherTitles, fatherName, fatherId,
        motherTitles, motherName, motherId
      } = await req.body();

      const result = await faunaClient.query(
        Create(
          Collection('Dogs'),
          {
            data: {
              name, titles, nkkId, gender, color, pedigreeDbLink,
              fatherTitles, fatherName, fatherId,
              motherTitles, motherName, motherId
            }
          }
        )
      );

      res.send(200, {
        dogId: result.ref.id
      });
    }
    catch (err) {
      const faunaError = getFaunaError(err);
      res.send(faunaError.status, faunaError);
    }
  })
}
