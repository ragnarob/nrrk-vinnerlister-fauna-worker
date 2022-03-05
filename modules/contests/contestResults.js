/* eslint-disable import/prefer-default-export */

import { Collection, Ref } from 'faunadb';
import { createDocument, getFaunaError } from '../utils';

export async function addContestResults(req, res, faunaClient) {
  try {
    const contestId = req.params.id;
    const results = await req.body();
    const addPromises = [];

    for (const result of results) {
      const contestResult = {
        dogRef: Ref(Collection('Dogs'), result.dogId),
        contestRef: Ref(Collection('Contests'), contestId),
        result: result.result,
        critiqueLink: result.critiqueLink || '',
      };

      addPromises.push(createDocument(faunaClient, 'ContestResults', contestResult));
    }

    await Promise.all(addPromises);
    res.end();
  } catch (err) {
    const faunaError = getFaunaError(err);
    res.send(faunaError.status, faunaError);
  }
}
