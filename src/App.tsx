import * as React from 'react';
import logo from './euphoria.jpg';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Tooltip } from 'antd';

import './App.scss';

interface IProps extends WithTranslation { }

const App: React.FC<IProps> = props => {
  const handleChangeLanguage = React.useCallback(() => {
    if (props.i18n.language === 'zh-CN') {
      props.i18n.changeLanguage('en-US');
      return;
    }
    props.i18n.changeLanguage('zh-CN');
  }, [props.i18n.language]);

  const getTooltipTitle = React.useMemo<string>(() => {
    return `点击可切换语言，现在的语言是 ${props.i18n.language}`;
  }, [props.i18n.language]);

  const render = React.useMemo(() => (
    <div className={'main'}>
      <Tooltip title={getTooltipTitle}>
        <img className={'logo'} src={logo} onClick={handleChangeLanguage} />
      </Tooltip>
      <h2>{props.t('Euphoria 快乐每一天！')}</h2>
    </div>
  ), [props.i18n.language]);

  return render;
};

export default withTranslation()(App);
