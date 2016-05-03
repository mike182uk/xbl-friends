import { combineReducers } from 'redux'
import { routeReducer as routing } from 'react-router-redux'

import app from './app'
import auth from './auth'
import friends from './friends'
import settings from './settings'

export default combineReducers({
  settings,
  friends,
  app,
  auth,
  routing
})
