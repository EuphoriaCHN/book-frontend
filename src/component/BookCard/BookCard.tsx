import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Books } from 'container/Platform/Platform';
import { Tooltip, Typography } from 'antd';
import ProjectStore from 'store/project';
import { getBookTitle } from '@utils/util';
import { MAKE_BOOK_IMAGE_URL } from 'api';

import './BookCard.scss';

interface IProps extends WithTranslation {
  book: Books;
}

const BookCard: React.SFC<IProps> = (props) => {
  const setBookModalVisible = React.useCallback(() => {
    ProjectStore.setBookModalVisible(true, props.book);
  }, [props.book]);

  const _title = React.useMemo<string>(() => getBookTitle(props.book), [
    props.book,
  ]);

  const getBookCardImageStyles = React.useMemo<React.CSSProperties>(
    () => ({
      backgroundImage: `url(${MAKE_BOOK_IMAGE_URL({
        imageName: 'bookDemo',
        extra: 'jpg',
      })})`,
    }),
    [props.book]
  );

  const render = React.useMemo<JSX.Element>(
    () => (
      <Tooltip title={_title}>
        <div className={'book-card'} onClick={setBookModalVisible}>
          <div className={'book-card-image'} style={getBookCardImageStyles} />
          <div className={'book-card-info'}>
            <Typography.Paragraph ellipsis={{ rows: 2, expandable: false }}>
              {_title}
            </Typography.Paragraph>
          </div>
        </div>
      </Tooltip>
    ),
    [_title, setBookModalVisible, getBookCardImageStyles]
  );

  return render;
};

export default withTranslation()(BookCard);
