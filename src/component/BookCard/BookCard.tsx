import * as React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next';
import { Books } from 'container/Platform/Platform';
import { Tooltip } from 'antd';
import ProjectStore from 'store/project';
import { getBookTitle } from '@utils/util';

import './BookCard.scss'

interface IProps extends WithTranslation {
  book: Books;
}

const BookCard: React.SFC<IProps> = props => {
  const setBookModalVisible = React.useCallback(() => {
    ProjectStore.setBookModalVisible(true, props.book);
  }, [props.book]);

  const _title = React.useMemo<string>(() => (
    getBookTitle(props.book)
  ), [props.book]);

  const render = React.useMemo<JSX.Element>(() => (
    <Tooltip title={_title}>
      <div className={'book-card'} onClick={setBookModalVisible}>
        <p>{_title}</p>
      </div>
    </Tooltip>
  ), [_title, setBookModalVisible]);

  return render;
};

export default withTranslation()(BookCard);