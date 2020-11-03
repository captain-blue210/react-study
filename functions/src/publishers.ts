import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { collectionName } from './services/react-study/contants';

module.exports = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const snap = await admin
      .firestore()
      .collection(collectionName.publishers)
      .get();
    const data = snap.docs.map((doc) => doc.data());
    res.send({ data });
  });
