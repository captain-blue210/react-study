import { parseFromTimeZone } from 'date-fns-timezone';
import admin from 'firebase-admin';
import { collectionName } from '../services/react-study/contants';
import { Author } from '../services/react-study/models/author';
import { blankBook, Book } from '../services/react-study/models/book';
import { FeedMemo } from '../services/react-study/models/feed-memo';
import { Publisher } from '../services/react-study/models/publisher';
import { BookItem } from '../services/react-study/rakuten/models/book-item';
import { uniform } from '../utils/text-processor';
import { addCounter } from './record-counter';

export const createBook = async (
  db: admin.firestore.Firestore,
  memo: FeedMemo,
  bookItem: BookItem,
  authors: Author[],
  publisher: Publisher,
) => {
  const { title, titleKana, isbn, itemUrl, largeImageUrl } = bookItem;
  const match = itemUrl.match(/books.rakuten.co.jp\/rb\/(\d+)/);
  const rbCode = match ? match[1] : '';
  const hasImage = /\.jpg/.test(largeImageUrl);
  const publishDate = parseFromTimeZone(memo.releaseDate!, {
    timeZone: 'Asia/Tokyo',
  });
  const publishedOn = admin.firestore.Timestamp.fromDate(publishDate);

  const book: Book = {
    ...blankBook,
    title: uniform(title),
    titleReading: uniform(titleKana),
    publisherId: publisher.id!,
    publisher,
    authorIds: authors.map((a) => a.id!),
    authors,
    isbn,
    rbCode,
    hasImage,
    publishedOn,
  };

  const booksRef = db.collection(collectionName.books);
  await booksRef.doc(book.isbn).set({
    ...book,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  await addCounter(db, collectionName.books);

  return { ...book, id: isbn };
};
