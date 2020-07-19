import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

import './Footer.scss';

type IProps = WithTranslation;

const Footer: React.FC<IProps> = props => {
  const render: JSX.Element = React.useMemo(
    () => (
      <footer className={'footer'}>
        <span>Copyright &copy; 2020 </span>
        <a target="__blank" href="https://www.xust-kcsoft.club" rel="noopener noreferrer">
          Xi'an University of Science & Technology KCSoft Laboratory.
        </a>
        <span>All Rights Reserved.</span>
      </footer>
    ),
    [props.i18n.language]
  );

  return render;
}

export default withTranslation()(Footer);
