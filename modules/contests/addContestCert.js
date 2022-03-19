import { Collection, Ref, Update } from "faunadb";
import { getFaunaError } from "../utils";

export default async function addContestCert(req, res, faunaClient) {
  try {
    const contestId = req.params.id;
    const body = await req.body();
    const { dogGender, isCert, dogId } = body;

    const genderCertKey = dogGender === 'M' ? 'maleCertDogRef' : 'femaleCertDogRef';
    const certValue = isCert ? Ref(Collection('Dogs'), dogId) : null;
    const updateObj = {
      [genderCertKey]: certValue
    }

    await faunaClient.query(
      Update(
        Ref(Collection('Contests'), contestId),
        { data: updateObj },
      ),
    );

    res.send(204);
  } catch (err) {
    console.log(err)
    const faunaError = getFaunaError(err);
    res.send(faunaError.status, faunaError);
  }
}