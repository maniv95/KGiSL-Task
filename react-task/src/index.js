import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import history from './history';
import './index.css';
import Login from'./login';
import Dashboard from './Dashboard'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router history={history}>
      <div>
        <Route exact path="/" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
      </div>
    </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
