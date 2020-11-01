import React, { FC } from 'react';
import { Item } from 'semantic-ui-react';
import { Book } from './Book';

type bookProps = {
  books: Book[];
};

const BookList: FC<bookProps> = (props) => {
  const { books } = props;

  return (
    <Item.Group>
      {books.map((book) => (
        <Item key={book.id}>
          <Item.Content>
            <Item.Header>{book.name}</Item.Header>
            <Item.Meta>{book.author}</Item.Meta>
          </Item.Content>
        </Item>
      ))}
    </Item.Group>
  );
};

export default BookList;
