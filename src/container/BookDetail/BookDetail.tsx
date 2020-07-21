import * as React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next';

import './BookDetail.scss'

type IProps = WithTranslation;

const BookDetail: React.SFC<IProps> = props => {
  const render = React.useMemo<JSX.Element>(() => (
    <h1>BookDetail</h1>
  ), []);

  return render;
};

export default withTranslation()(BookDetail);