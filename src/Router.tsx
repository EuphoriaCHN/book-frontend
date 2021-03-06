import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';

import Platform from 'container/Platform/Platform';
import About from 'container/About/About';
import BookDetail from 'container/BookDetail/BookDetail';
import SearchDetail from 'container/SearchDetail/SearchDetail';

import NoMatch from 'component/NoMatch/NoMatch';

interface IProps {}

const routerStyle: React.CSSProperties = {
  height: 'calc(100vh - 98px)',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fff',
};

const Router: React.FC<IProps> = observer(() => (
  <div style={routerStyle}>
    <Switch>
      <Route path="/platform" component={Platform} />
      <Route path="/about" component={About} />
      <Route path="/book/:bookId" component={BookDetail} />
      <Route path="/search" component={SearchDetail} />
      <Route exact path="/" component={Platform} />
      <Route component={NoMatch} />
    </Switch>
  </div>
));

export default Router;
