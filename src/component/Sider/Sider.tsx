import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as H from 'history';

import { Layout, Menu, Tooltip } from 'antd';
import { ClickParam } from 'antd/lib/menu/index';
import {
  SearchOutlined,
  MenuOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

import './Sider.scss';

type SIDER_DATA = {
  k: string;
  icon: React.ReactElement;
  value?: string;
  title?: string;
  auth?: Array<number>;
  children?: Array<SIDER_DATA>;
};

const Sider: React.SFC<WithTranslation> = (props) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const _history: H.History<H.LocationState> = useHistory();
  const _defaultMenuKey = window.location.pathname.slice(1);

  const getTitle: null | React.ReactNode = collapsed ? (
    <div className={'collapsed-title'} />
  ) : (
    <Tooltip title={props.t('书籍管理系统')}>
      <h3 className={'title'}>{props.t('书籍管理系统')}</h3>
    </Tooltip>
  );

  const handleChangeRoute = (param: ClickParam): void => {
    const { key } = param;
    _history.push(`/${key}`);
  };

  const siderData: Array<SIDER_DATA> = [
    { k: 'search', icon: <SearchOutlined />, value: props.t('章节搜索') },
    { k: 'platform', icon: <MenuOutlined />, value: props.t('书本列表') },
    { k: 'about', icon: <QuestionCircleOutlined />, value: props.t('关于') },
  ];

  const getSiderItem = (item: SIDER_DATA) => {
    if (item.k && item.k.length) {
      return (
        <Menu.Item key={item.k} icon={item.icon} onClick={handleChangeRoute}>
          {item.value}
        </Menu.Item>
      );
    }
    return (
      <Menu.SubMenu icon={item.icon} title={item.title}>
        {item.children.map(getSiderItem)}
      </Menu.SubMenu>
    );
  };

  const render: JSX.Element = React.useMemo(
    () => (
      <Layout.Sider
        className={'sider'}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        collapsible
      >
        {getTitle}
        <Menu
          theme={'dark'}
          defaultSelectedKeys={[_defaultMenuKey]}
          mode={'inline'}
        >
          {siderData.map(getSiderItem)}
        </Menu>
      </Layout.Sider>
    ),
    [collapsed, props.i18n.language]
  );

  return render;
};

export default withTranslation()(Sider);
