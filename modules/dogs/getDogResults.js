import {
  Collection, Select, Get, Index, Let, Lambda, Map, Match, Paginate, Ref, Var,
} from 'faunadb';

export async function getDogResults(faunaClient, dogId) {
  const result = await faunaClient.query(
    Map(
      Paginate(
        Match(
          Index('results_by_dog'),
          Ref(Collection('Dogs'), dogId),
        ),
      ),
      Lambda(
        ['resultRef', 'contestRef'],
        Let(
          {
            resultDoc: Get(Var('resultRef')),
            contestDoc: Get(Var('contestRef')),
          },
          {
            resultId: Select(['ref', 'id'], Var('resultDoc')),
            result: Select(['data', 'result'], Var('resultDoc')),
            critiqueLink: Select(['data', 'critiqueLink'], Var('resultDoc')),

            contestId: Select(['ref', 'id'], Var('contestDoc')),
            contestName: Select(['data', 'name'], Var('contestDoc')),
            contestNumberOfDogs: Select(['data', 'numberOfDogs'], Var('contestDoc')),
            contestDate: Select(['data', 'date'], Var('contestDoc')),
            contestLocation: Select(['data', 'location'], Var('contestDoc')),
            contestHost: Select(['data', 'host'], Var('contestDoc')),
            contestJudge: Select(['data', 'judge'], Var('contestDoc')),
          },
        ),
      ),
    ),
  );

  return result.data;
}

export async function getDogResultRefs(faunaClient, dogId) {
  const result = await faunaClient.query(
    Paginate(
      Match(
        Index('results_by_dog_simple'),
        Ref(Collection('Dogs'), dogId),
      ),
    ),
  );

  return result.data;
}
