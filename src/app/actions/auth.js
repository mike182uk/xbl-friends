import { routeActions } from 'react-router-redux'

import { friendsRetrievalRequested } from './friends'
import { requestLogin as ipcRequestLogin, requestLogout as ipcRequestLogout } from '../ipc'

import { AUTH as AUTH_ROUTE, FRIENDS as FRIENDS_ROUTE } from '../constants/routes'

export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export const LOGGED_IN = 'LOGGED_IN'
export const REQUEST_LOGOUT = 'REQUEST_LOGOUT'
export const LOGGED_OUT = 'LOGGED_OUT'
export const AUTHENTICATED = 'AUTHENTICATED'
export const AUTHENTICATING = 'AUTHENTICATING'
export const AUTH_CANCELLED = 'AUTH_CANCELLED'

export function requestLogin () {
  return {
    type: REQUEST_LOGIN
  }
}

export function loginRequested () {
  return dispatch => {
    dispatch(requestLogin())

    return ipcRequestLogin()
  }
}

export function loggedIn () {
  return {
    type: LOGGED_IN
  }
}

export function authenticated () {
  return {
    type: AUTHENTICATED
  }
}

export function requestLogout () {
  return {
    type: REQUEST_LOGOUT
  }
}

export function logoutRequested () {
  return dispatch => {
    dispatch(requestLogout())

    return ipcRequestLogout()
  }
}

export function loggedOut () {
  return {
    type: LOGGED_OUT
  }
}

export function authenticating () {
  return {
    type: AUTHENTICATING
  }
}

export function loginSuccessful () {
  return dispatch => {
    [
      loggedIn(),
      friendsRetrievalRequested(),
      routeActions.push(FRIENDS_ROUTE)
    ].map(dispatch)
  }
}

export function logoutSuccessful () {
  return dispatch => {
    [
      loggedOut(),
      routeActions.push(AUTH_ROUTE)
    ].map(dispatch)
  }
}

export function authCancelled () {
  return {
    type: AUTH_CANCELLED
  }
}
