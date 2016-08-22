import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'
import App from './components/App.jsx'
import TaxLotContainer from './components/TaxLotContainer.jsx'
import { createHistory, useBasename } from 'history'

const history = useBasename(createHistory)({
  basename: null
})

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="lotprofiles/:boro/:block/:lot"  component={TaxLotContainer}/>
    </Route>  
  </Router>,
  document.getElementById('root')
)