import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { initialiseApp } from './actions/app'
import { requireAppInitialised as requireAppInitialisedHook } from './routing/hooks'
import { initialise as initialiseIpc } from './ipc'

import App from './containers/App'
import Friends from './containers/Friends'
import Settings from './containers/Settings'
import Auth from './containers/Auth'
import AppInitialising from './containers/AppInitialising'

import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import './styles.css'

import {
  AUTH as AUTH_ROUTE,
  FRIENDS as FRIENDS_ROUTE,
  SETTINGS as SETTINGS_ROUTE,
  APP_LOADING as APP_INITIALISING_ROUTE
} from './constants/routes'

import store from './store'

// initialise IPC
initialiseIpc(store.dispatch)

// setup hooks
const requireAppInitialised = requireAppInitialisedHook(store)

// render the app
ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={AppInitialising} />
        <Route path={APP_INITIALISING_ROUTE} component={AppInitialising} />
        <Route path={AUTH_ROUTE} component={Auth} onEnter={requireAppInitialised} />
        <Route path={FRIENDS_ROUTE} component={Friends} onEnter={requireAppInitialised} />
        <Route path={SETTINGS_ROUTE} component={Settings} onEnter={requireAppInitialised} />
      </Route>
    </Router>
  </Provider>,
  document.querySelector('#root')
)

// initialise the app
store.dispatch(initialiseApp())
