import {
  Collection, Select, Get, Index, Let, Lambda, Map, Match, Paginate, Ref, Var,
} from 'faunadb';

export default async function getContestResults(faunaClient, contestId) {
  const result = await faunaClient.query(
    Map(
      Paginate(
        Match(
          Index('results_by_contest'),
          Ref(Collection('Contests'), contestId),
        ),
      ),
      Lambda(
        ['resultRef', 'dogRef'],
        Let(
          {
            resultDoc: Get(Var('resultRef')),
            dogDoc: Get(Var('dogRef')),
          },
          {
            resultId: Select(['ref', 'id'], Var('resultDoc')),
            result: Select(['data', 'result'], Var('resultDoc')),
            critiqueLink: Select(['data', 'critiqueLink'], Var('resultDoc')),

            dogId: Select(['ref', 'id'], Var('dogDoc')),
            dogName: Select(['data', 'name'], Var('dogDoc')),
          },
        ),
      ),
    ),
  );

  return result.data;
}
