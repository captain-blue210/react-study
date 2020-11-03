import admin from 'firebase-admin';
import { BookItem } from '../services/rakuten/models/book-item';
import { collectionName } from '../services/react-study/contants';
import { Author, blankAuthor } from '../services/react-study/models/author';
import { normalize, uniform } from '../utils/text-processor';
import { addCounter } from './record-counter';

export const findOrCreateAuthors = async (
  db: admin.firestore.Firestore,
  bookItem: BookItem,
) => {
  const authorsRef = db.collection(collectionName.authors);
  const authorNames = bookItem.author.split('/');
  const authorNameReadings = bookItem.authorKana
    .split('/')
    .map((name) => name.replace(/\s+/g, ' ').replace(/,/g, ' '));

  const authors: Author[] = authorNames.map((name, i) => ({
    ...blankAuthor,
    name: uniform(name),
    nameReading: uniform(authorNameReadings[i]),
    variation: normalize(name),
  }));

  let i = 0;
  for await (const author of authors) {
    const snap = await authorsRef
      .where('variation', '==', normalize(author.name))
      .get();

    if (snap.size) {
      authors[i].id = snap.docs[0].id;
    } else {
      const docRef = authorsRef.doc();
      await docRef.set({
        ...author,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      await addCounter(db, collectionName.authors);
      authors[i].id = docRef.id;
    }
    i += 1;
  }

  return authors;
};
