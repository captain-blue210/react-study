import React, { FC } from 'react';
import { Book } from './Book';
import { Item } from 'semantic-ui-react';

type bookProps = {
    books: Book[];
}

const BookList: FC<bookProps> = (bookProps) => {
    const { books } = bookProps;

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
