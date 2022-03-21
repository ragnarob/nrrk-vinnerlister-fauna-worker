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

export function getPointsByResult(result) {
  return pointsByResult[result] || 0;
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
