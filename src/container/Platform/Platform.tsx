import * as React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next';

import './Platform.scss'

type IProps = WithTranslation;

const Platform: React.SFC<IProps> = props => {
  const render = React.useMemo<JSX.Element>(() => (
    <h1>Platform</h1>
  ), []);

  return render;
};

export default withTranslation()(Platform);