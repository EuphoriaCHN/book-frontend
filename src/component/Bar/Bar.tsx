import * as React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next';
import { Books } from 'container/Platform/Platform';
import BookCard from 'component/BookCard/BookCard';

import './Bar.scss'

interface IProps extends WithTranslation {
  books: Array<Books>;
};

const Bar: React.SFC<IProps> = props => {
  const render = React.useMemo<JSX.Element>(() => (
    <div className={'bar'}>
      <div className={'bar-books'}>
        {props.books.map((book, index: number) => (
          <BookCard book={book} key={index} />
        ))}
      </div>
      <div className={'bar-bottom'} />
    </div>
  ), [props.books, props.i18n.language]);

  return render;
};

export default withTranslation()(Bar);