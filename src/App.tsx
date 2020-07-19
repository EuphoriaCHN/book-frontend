import * as React from 'react';
import { ConfigProvider, Layout } from 'antd';
import { HashRouter } from 'react-router-dom';
import * as H from 'history';

// Antd 组件国际化
import antdLocale from 'common/constants/antdLocale';

import Header from 'component/Header/Header';
import Router from 'Router';
import Footer from 'component/Footer/Footer';
import Sider from 'component/Sider/Sider';

type IProps = H.History;

const App: React.FC<IProps> = (props: IProps): React.ReactElement => (
  <ConfigProvider locale={antdLocale}>
    <HashRouter>
      <Layout>
        <Sider />
        <Layout className={'container'}>
          <Header />
          <Router />
          <Footer />
        </Layout>
      </Layout>
    </HashRouter>
  </ConfigProvider>
);

export default App;
