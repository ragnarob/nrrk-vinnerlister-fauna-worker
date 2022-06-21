export const pointsByResult = {
  BIR: 20,
  BIM: 18,
  '2. BHK/BTK': 16,
  '3. BHK/BTK': 14,
  '4. BHK/BTK': 12,
  '5. BHK/BTK': 10,
  '6. BHK/BTK': 8,
  '7. BHK/BTK': 6,
  '8. BHK/BTK': 4,
  '9. BHK/BTK': 2,
  '10. BHK/BTK': 1,
  CK: 5,
  Excellent: 4,
  'Very Good': 3,
  Good: 2,
  Sufficient: 1,
};

export const awardsWithNumDogPoitns = [
  'BIR',
  'BIM',
  '2. BHK/BTK',
  '3. BHK/BTK',
  '4. BHK/BTK',
  '5. BHK/BTK',
  '6. BHK/BTK',
  '7. BHK/BTK',
  '8. BHK/BTK',
  '9. BHK/BTK',
  '10. BHK/BTK',
];

export const simpleAwards = [
  'Excellent',
  'Very Good',
  'Good',
  'Sufficient',
];

export function calculateScore(result, placement, ck, numDogs) {
  let score = 0;

  if (placement) {
    score += pointsByResult[placement] + getPointsByNumDogs(numDogs);
  } else {
    if (ck) {
      score += 5;
    } else if (result) {
      score += pointsByResult[result] || 0;
    }
  }

  return score;
}

export function getPointsByNumDogs(numDogs) {
  if (numDogs <= 5) { return 0; }
  if (numDogs <= 10) { return 2; }
  if (numDogs <= 15) { return 4; }
  if (numDogs <= 20) { return 6; }
  if (numDogs <= 25) { return 8; }
  if (numDogs <= 30) { return 10; }
  if (numDogs <= 35) { return 12; }
  if (numDogs <= 40) { return 14; }
  if (numDogs <= 45) { return 16; }
  if (numDogs <= 50) { return 18; }
  return 20;
}

export function combineResults(result, placement, ck) {
  const resultStrings = [];
  if (placement) {
    resultStrings.push(placement);
  }
  if (result) {
    resultStrings.push(result);
  }
  if (ck) {
    resultStrings.push('CK');
  }
  return resultStrings.join(', ');
}
