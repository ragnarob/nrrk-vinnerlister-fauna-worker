import {
  Get, Index, Lambda, Map, Match, Paginate, Var,
} from 'faunadb';

export default async function getContestsByYear(faunaClient, year) {
  const result = await faunaClient.query(
    Map(
      Paginate(
        Match(
          Index('contest_by_year'),
          year,
        ),
        { size: 1000 },
      ),
      Lambda(['_', 'contestRef'], Get(Var('contestRef'))),
    ),
  );

  const mappedData = result.data.map((resObj) => ({
    id: resObj.ref.id,
    ...resObj.data,
  }));

  return mappedData;
}
