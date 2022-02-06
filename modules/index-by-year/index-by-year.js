import { getPointsByResult } from '../scores-and-points';
import { getFaunaError } from '../utils';
import getContestsByYear from './contestsByYear';
import getResultsByYear from './resultsByYear';

export default function setupRoutes(router, faunaClient) {
  router.add('GET', '/winner-list/:year', async (req, res) => {
    try {
      const year = Number(req.params.year).toString();

      const contestsPromise = getContestsByYear(faunaClient, year);
      const resultsPromise = getResultsByYear(faunaClient, year);

      const [contests, results] = await Promise.all([contestsPromise, resultsPromise]);

      const topDogScores = getTopDogScores(results);
      const fullContestData = {
        contests,
        topList: topDogScores,
      };

      res.send(200, fullContestData);
    } catch (err) {
      const faunaError = getFaunaError(err);
      res.send(faunaError.status, faunaError);
    }
  });
}

function getTopDogScores(resultList) {
  const dogsObj = {};

  resultList.forEach((resultObj) => {
    const { dogId } = resultObj;

    if (!(dogId in dogsObj)) {
      dogsObj[dogId] = {
        dogId, dogName: resultObj.dogName, numberOfContests: 0, points: [],
      };
    }

    dogsObj[dogId].numberOfContests += 1;

    const score = getPointsByResult(resultObj.result);
    const { points } = dogsObj[dogId];

    points.push(score);
    dogsObj[dogId].points = points.sort().slice(0, 5);
  });

  const resultsSorted = Object.values(dogsObj).map((dogObj) => ({
    pointsSum: sumArray(dogObj.points),
    ...dogObj,
  }))
    .sort((r1, r2) => (r1.pointsSum > r2.pointsSum ? -1 : 1));

  return resultsSorted;
}

function sumArray(numArray) {
  return numArray.reduce((partialSum, a) => partialSum + a, 0);
}
