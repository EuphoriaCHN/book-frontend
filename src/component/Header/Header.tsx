import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ClickParam } from 'antd/lib/menu/index';
import classnames from 'classnames';
import Cookies from 'js-cookie';

import { LOCALE } from 'common/constants/locale';

import { Dropdown, Button, Menu } from 'antd';
import { GlobalOutlined, CheckOutlined } from '@ant-design/icons';

import './Header.scss';

type IProps = WithTranslation;

const Header: React.SFC<IProps> = props => {
  const _locale: string = props.i18n.language;
  const [localeDropdownVisible, setLocaleDropdownVisible] = React.useState(false);

  const handleI18n = (param: ClickParam): void => {
    const { key } = param;

    if (key !== _locale) {
      Cookies.set('locale', key);
      props.i18n.changeLanguage(key);
    }
  };

  const menu: React.ReactElement = (
    <Menu>
      {Object.keys(LOCALE).map(
        (language: string): JSX.Element => {
          const activity = _locale === language;
          const classNames = classnames({ 'local-activity': activity });
          return (
            <Menu.Item key={language} onClick={handleI18n}>
              <div className={classNames}>
                {activity ? <CheckOutlined /> : null}
                {LOCALE[language]}
              </div>
            </Menu.Item>
          );
        }
      )}
    </Menu>
  );

  const handleToggleLocaleDropdownVisible = (): void => {
    setLocaleDropdownVisible(!localeDropdownVisible);
  };


  const render: JSX.Element = React.useMemo(
    () => (
      <header className={'header'}>
        <Dropdown overlay={menu} visible={localeDropdownVisible} onVisibleChange={handleToggleLocaleDropdownVisible}>
          <Button>
            {props.t(LOCALE[_locale])} <GlobalOutlined />
          </Button>
        </Dropdown>
      </header>
    ),
    [props.i18n.language, localeDropdownVisible]
  );

  return render;
};

export default withTranslation()(Header);
