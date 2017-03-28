import React from 'react';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import HomePage from './HomePage';
import LotProfile from './LotProfile';

const App = React.createClass({ // eslint-disable-line
  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={HomePage} />
          <Route path="/bbl/:boro/:block/:lot/:slug" component={LotProfile} />
        </div>
      </Router>
    );
  },
});

module.exports = App;
