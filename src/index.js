import React from 'react';
import ReactDom from 'react-dom';
import { hot } from 'react-hot-loader';

import App from './App.tsx';

import 'antd/dist/antd.css';

import './i18n';

const HotApp = hot(module)(App);

ReactDom.render(<HotApp />, document.getElementById('root'));
