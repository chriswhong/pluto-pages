import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import App from './components/App';
import TaxLotContainer from './components/TaxLotContainer';
import HomePage from './components/HomePage';


ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={HomePage} />
      <Route path="lotprofiles/:boro/:block/:lot" component={TaxLotContainer} />
    </Route>
  </Router>,
  document.getElementById('root'),
);
