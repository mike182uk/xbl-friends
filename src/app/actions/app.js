import { routeActions } from 'react-router-redux'

import { authenticated } from './auth'
import { friendsRetrievalRequested } from './friends'
import { notifyAppInitialising } from '../ipc'
import { AUTH as AUTH_ROUTE, FRIENDS as FRIENDS_ROUTE } from '../constants/routes'

export const APP_INITIALISING = 'APP_INITIALISING'
export const APP_INITIALISED = 'APP_INITIALISED'

export function appInitialising () {
  return {
    type: APP_INITIALISING
  }
}

export function appInitialised () {
  return {
    type: APP_INITIALISED
  }
}

export function initialiseApp () {
  return dispatch => {
    dispatch(appInitialising())

    return notifyAppInitialising()
  }
}

export function appReady (isAuthenticated) {
  return dispatch => {
    dispatch(appInitialised())

    if (isAuthenticated) {
      [
        authenticated(),
        friendsRetrievalRequested(),
        routeActions.push(FRIENDS_ROUTE)
      ].map(dispatch)
    } else {
      dispatch(routeActions.push(AUTH_ROUTE))
    }
  }
}
