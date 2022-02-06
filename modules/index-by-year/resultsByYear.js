import {
  Get, Index, Lambda, Map, Match, Paginate, Var, Join, Let, Select,
} from 'faunadb';

export default async function getResultsByYear(faunaClient, year) {
  const result = await faunaClient.query(
    Map(
      Paginate(
        Join(
          Match(
            Index('contest_by_year'),
            year,
          ),
          Lambda(
            ['date', 'contestRef'],
            Match(Index('results_by_contest'), Var('contestRef')), // results_by_contest from 'contests' folder
          ),
        ),
      ),
      Lambda(
        ['resultRef', 'dogRef', 'contestRef'],
        Let(
          {
            resultDoc: Get(Var('resultRef')),
            dogDoc: Get(Var('dogRef')),
            contestDoc: Get(Var('contestRef')),
          },
          {
            result: Select(['data', 'result'], Var('resultDoc')),
            dogName: Select(['data', 'name'], Var('dogDoc')),
            dogId: Select(['ref', 'id'], Var('dogDoc')),
            numberOfDogs: Select(['data', 'numberOfDogs'], Var('contestDoc')),
          },
        ),
      ),
    ),
  );

  return result.data;
}
