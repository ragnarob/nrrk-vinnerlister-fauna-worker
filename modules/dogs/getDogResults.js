import {
  Collection,
  Select,
  Get,
  Index,
  Let,
  Lambda,
  Map,
  Match,
  Paginate,
  Ref,
  Var,
} from 'faunadb';

export async function getDogResults(faunaClient, dogId) {
  const result = await faunaClient.query(
    Map(
      Paginate(Match(Index('results_by_dog'), Ref(Collection('Dogs'), dogId)), { size: 1000 }),
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
            placement: Select(['data', 'placement'], Var('resultDoc')),
            ck: Select(['data', 'ck'], Var('resultDoc')),

            contestId: Select(['ref', 'id'], Var('contestDoc')),
            contestName: Select(['data', 'name'], Var('contestDoc')),
            contestNumberOfDogs: Select(['data', 'numberOfDogs'], Var('contestDoc')),
            contestDate: Select(['data', 'date'], Var('contestDoc')),
            contestLocation: Select(['data', 'location'], Var('contestDoc')),
            contestHost: Select(['data', 'host'], Var('contestDoc')),
            contestJudge: Select(['data', 'judge'], Var('contestDoc')),

            contestMaleCertDogRef: Select(['data', 'maleCertDogRef'], Var('contestDoc'), null),
            contestFemaleCertDogRef: Select(['data', 'femaleCertDogRef'], Var('contestDoc'), null),
            contestMaleNordCertDogRef: Select(
              ['data', 'maleNordCertDogRef'],
              Var('contestDoc'),
              null
            ),
            contestFemaleNordCertDogRef: Select(
              ['data', 'femaleNordCertDogRef'],
              Var('contestDoc'),
              null
            ),
            contestMaleJuniorCertDogRef: Select(
              ['data', 'maleJuniorCertDogRef'],
              Var('contestDoc'),
              null
            ),
            contestFemaleJuniorCertDogRef: Select(
              ['data', 'femaleJuniorCertDogRef'],
              Var('contestDoc'),
              null
            ),
            contestMaleVeteranCertDogRef: Select(
              ['data', 'maleVeteranCertDogRef'],
              Var('contestDoc'),
              null
            ),
            contestFemaleVeteranCertDogRef: Select(
              ['data', 'femaleVeteranCertDogRef'],
              Var('contestDoc'),
              null
            ),
          }
        )
      )
    )
  );

  return result.data;
}

export async function getDogResultRefs(faunaClient, dogId) {
  const result = await faunaClient.query(
    Paginate(Match(Index('results_by_dog_simple'), Ref(Collection('Dogs'), dogId)), { size: 1000 })
  );

  return result.data;
}
