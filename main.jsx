import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import App from './components/App';
import HomePage from './components/HomePage';


ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={HomePage} />
      <Route path="lotprofiles/:boro/:block/:lot" component={HomePage} />
    </Route>
  </Router>,
  document.getElementById('root'),
);
