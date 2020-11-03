/* eslint-disable no-console */
import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { collectionName } from './services/react-study/contants';
import { tokenize } from './utils/text-processor';

module.exports = functions
  .region(functions.config().locale.region)
  .https.onRequest(async (req, res) => {
    const searchWord = req.query.q as string;
    const booksRef = admin.firestore().collection(collectionName.books);

    let query = booksRef.limit(10);
    tokenize(searchWord).forEach((token) => {
      query = query.where(`tokenMap.${token}`, '==', true);
    });
    const snap = await query.get();
    // const snap = await query.orderBy('publishedOn').get();
    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.send({ data });
  });
