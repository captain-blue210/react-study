import puppeteer from 'puppeteer';
import {
  blankFeedMemo,
  FeedMemo,
} from '../services/react-study/models/feed-memo';

export const feedCalendar = async (page: puppeteer.Page) => {
  const url = 'http://kc.kodansha.co.jp/calendar';
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const memos: FeedMemo[] = [];

  for await (const _ of [0, 1]) { // eslint-disable-line
    const items = await page.$$('.comicList .contIn .contR .spaceSp .block');

    for await (const item of items) {
      const memo = { ...blankFeedMemo };

      const releaseDate = await item.$eval('.date', (e) => e.textContent);
      if (releaseDate) memo.releaseDate = releaseDate?.replace(/\./g, '-');
      memo.title = await item.$eval('.tit', (e) => e.textContent);
      const author = await item.$eval('.name', (e) => e.textContent);
      if (author) memo.author = author.replace(/\s/g, ' ').replace(/, /g, ',');
      memo.publisher = '講談社';

      memos.push(memo);
    }

    await page.click('.linkTitW > ul > li:nth-child(2)');
  }

  return memos;
};
