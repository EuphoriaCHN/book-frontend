import * as React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';

import './BookDetail.scss'

type HistoryBookProps = {
  bookId: string;
};

interface IProps extends WithTranslation, RouteComponentProps<HistoryBookProps> { }

const BookDetail: React.SFC<IProps> = props => {
  const render = React.useMemo<JSX.Element>(() => (
    <h1>{props.match.params.bookId}</h1>
  ), []);

  return render;
};

export default withTranslation()(BookDetail);