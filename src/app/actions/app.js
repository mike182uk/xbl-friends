import { routeActions } from 'react-router-redux'
import { authenticated } from './auth'
import { friendsRetrievalRequested } from './friends'

import { AUTH as AUTH_ROUTE, FRIENDS as FRIENDS_ROUTE } from '../constants/routes'

export const APP_LOADING = 'APP_LOADING'
export const APP_LOADED = 'APP_LOADED'

export function appLoading () {
  return {
    type: APP_LOADING
  }
}

export function appLoaded () {
  return {
    type: APP_LOADED
  }
}

export function appLoadSuccessful (isAuthenticated) {
  return dispatch => {
    dispatch(appLoaded())

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
