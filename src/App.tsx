import React, { FC } from 'react';
import { Book } from './Book';
import BookList from './BookList';
import './App.css';

const App: FC = () => {
  const books: Book[] = [
    {
      id: 1,
      name: '独学大全',
      author: '読書猿'
    },
    {
      id: 2,
      name: '数学ガールの秘密ノート／場合の数',
      author: '結城浩'
    },
    {
      id: 3,
      name: 'アジャイルサムライーー達人開発者への道',
      author: 'Jonathan Ramusson, 西村直人'
    }
  ];

  return (
    <div className="container">
      <header>
        <h1>書籍一覧</h1>
      </header>
      <BookList books={books} />
    </div>
  );
}

export default App;
