import { Collection, Ref, Update } from 'faunadb';
import { getFaunaError } from '../utils';

export default async function addContestCert(req, res, faunaClient) {
  try {
    const contestId = req.params.id;
    const body = await req.body();
    const { dogGender, isCert, certType, dogId } = body;

    const certKey = getCertKey(dogGender, certType);

    const certValue = isCert ? Ref(Collection('Dogs'), dogId) : null;
    const updateObj = {
      [certKey]: certValue,
    };

    await faunaClient.query(Update(Ref(Collection('Contests'), contestId), { data: updateObj }));

    res.send(204);
  } catch (err) {
    const faunaError = getFaunaError(err);
    res.send(faunaError.status, faunaError);
  }
}

function getCertKey(dogGender, certType) {
  if (dogGender === 'M') {
    if (certType === 'nord') {
      return 'maleNordCertDogRef';
    }
    if (certType === 'junior') {
      return 'maleJuniorCertDogRef';
    }
    if (certType === 'veteran') {
      return 'maleVeteranCertDogRef';
    }
    return 'maleCertDogRef';
  } else {
    if (certType === 'nord') {
      return 'femaleNordCertDogRef';
    }
    if (certType === 'junior') {
      return 'femaleJuniorCertDogRef';
    }
    if (certType === 'veteran') {
      return 'femaleVeteranCertDogRef';
    }
    return 'femaleCertDogRef';
  }
}
