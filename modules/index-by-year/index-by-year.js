import { calculateScore } from '../scores-and-points';
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
  const maleDogs = {};
  const femaleDogs = {};

  resultList.forEach((resultObj) => {
    const { dogId } = resultObj;
    const relevantDogObj = resultObj.dogGender === 'M' ? maleDogs : femaleDogs;

    if (!(dogId in relevantDogObj)) {
      relevantDogObj[dogId] = {
        dogId,
        dogName: resultObj.dogName,
        numberOfContests: 0,
        points: [],
      };
    }

    relevantDogObj[dogId].numberOfContests += 1;

    const score = calculateScore(
      resultObj.result,
      resultObj.placement,
      resultObj.ck,
      resultObj.numberOfDogs,
    );
    const { points } = relevantDogObj[dogId];

    points.push(score);
    relevantDogObj[dogId].points = points.sort().slice(0, 5);
  });

  const maleDogsSorted = Object.values(maleDogs).map((dogObj) => ({
    pointsSum: sumArray(dogObj.points),
    ...dogObj,
  })).sort((r1, r2) => (r1.pointsSum > r2.pointsSum ? -1 : 1))
    .slice(0, 20);

  const femaleDogsSorted = Object.values(femaleDogs).map((dogObj) => ({
    pointsSum: sumArray(dogObj.points),
    ...dogObj,
  })).sort((r1, r2) => (r1.pointsSum > r2.pointsSum ? -1 : 1))
    .slice(0, 20);

  return {
    male: maleDogsSorted,
    female: femaleDogsSorted,
  };
}

function sumArray(numArray) {
  return numArray.reduce((partialSum, a) => partialSum + a, 0);
}
