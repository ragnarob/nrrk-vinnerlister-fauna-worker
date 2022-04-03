import {
  Collection, Select, Get, Index, Let, Lambda, Map, Match, Paginate, Ref, Var,
} from 'faunadb';
import { getFaunaError } from '../utils';

export async function getContestResults(faunaClient, contestId) {
  try {
    const result = await faunaClient.query(
      Map(
        Paginate(
          Match(
            Index('results_by_contest'),
            Ref(Collection('Contests'), contestId),
          ),
        ),
        Lambda(
          ['resultRef', 'dogRef', 'contestRef'],
          Let(
            {
              resultDoc: Get(Var('resultRef')),
              dogDoc: Get(Var('dogRef')),
            },
            {
              resultId: Select(['ref', 'id'], Var('resultDoc')),
              result: Select(['data', 'result'], Var('resultDoc')),
              placement: Select(['data', 'placement'], Var('resultDoc')),
              ck: Select(['data', 'ck'], Var('resultDoc')),

              dogId: Select(['ref', 'id'], Var('dogDoc')),
              dogName: Select(['data', 'name'], Var('dogDoc')),
              dogGender: Select(['data', 'gender'], Var('dogDoc')),
            },
          ),
        ),
      ),
    );

    return result.data;
  } catch (err) {
    const faunaError = getFaunaError(err);
    if (faunaError.status === 404) {
      return [];
    }
    throw err;
  }
}

export async function getContestResultRefs(faunaClient, contestId) {
  const result = await faunaClient.query(
    Paginate(
      Match(
        Index('results_by_contest_simple'),
        Ref(Collection('Contests'), contestId),
      ),
    ),
  );

  return result.data;
}
