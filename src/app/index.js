import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { appLoading } from './actions/app'
import { requireAppLoaded as requireAppLoadedHook } from './routing/hooks'
import { init as initIpc } from './ipc'

import App from './containers/App'
import Friends from './containers/Friends'
import Settings from './containers/Settings'
import Auth from './containers/Auth'
import AppLoading from './containers/AppLoading'

import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'

import {
  AUTH as AUTH_ROUTE,
  FRIENDS as FRIENDS_ROUTE,
  SETTINGS as SETTINGS_ROUTE,
  APP_LOADING as APP_LOADING_ROUTE
} from './constants/routes'

import store from './store'

// initialize IPC
initIpc(store.dispatch)

// initialize the app
store.dispatch(appLoading())

// setup hooks
const requireAppLoaded = requireAppLoadedHook(store)

// render the app
ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={AppLoading} />
        <Route path={APP_LOADING_ROUTE} component={AppLoading} />
        <Route path={AUTH_ROUTE} component={Auth} onEnter={requireAppLoaded} />
        <Route path={FRIENDS_ROUTE} component={Friends} onEnter={requireAppLoaded} />
        <Route path={SETTINGS_ROUTE} component={Settings} onEnter={requireAppLoaded} />
      </Route>
    </Router>
  </Provider>,
  document.querySelector('#root')
)
