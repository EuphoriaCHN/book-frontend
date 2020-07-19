import * as React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next';

import './Platform.scss'

type IProps = WithTranslation;

const Platform: React.SFC<IProps> = props => {
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [currentIndex, setCurrentIndex] = React.useState<number>(1);

  const render = React.useMemo<JSX.Element>(() => (
    <div className={'platcorm container'}>123</div>
  ), []);

  return render;
};

export default withTranslation()(Platform);