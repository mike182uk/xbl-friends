import { routeActions } from 'react-router-redux'

import { login, logout, verifyAuthCode } from '../xbl';
import {
  AUTH as AUTH_ROUTE,
  FRIENDS as FRIENDS_ROUTE
} from '../constants/routes';

import { updateFriends } from './friends';

export const SUBMIT_CREDENTIALS = 'SUBMIT_CREDENTIALS';
export const SUBMIT_AUTH_CODE = 'SUBMIT_AUTH_CODE';
export const LOGGED_IN = 'LOGGED_IN';
export const AUTH_CODE_REQUIRED = 'AUTH_CODE_REQUIRED';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const AUTH_CODE_VERIFICATION_FAILED = 'AUTH_CODE_VERIFICATION_FAILED';
export const CANCEL_AUTH_CODE_SUBMISSION = 'CANCEL_AUTH_CODE_SUBMISSION';
export const REQUEST_SIGN_OUT = 'REQUEST_SIGN_OUT';
export const LOGGED_OUT = 'LOGGED_OUT';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';

export function submitCredentials(username, password) {
  return {
    type: SUBMIT_CREDENTIALS,
    username,
    password
  }
}

export function submitAuthCode(authCode) {
  return {
    type: SUBMIT_AUTH_CODE,
    authCode
  }
}

export function cancelAuthCodeSubmission() {
  return {
    type: CANCEL_AUTH_CODE_SUBMISSION
  }
}

export function loggedIn() {
  return {
    type: LOGGED_IN
  }
}

export function authCodeRequired() {
  return {
    type: AUTH_CODE_REQUIRED
  }
}

export function loginFailed(error) {
  return {
    type: LOGIN_FAILED,
    error
  }
}

export function logoutFailed(error) {
  return {
    type: LOGOUT_FAILED,
    error
  }
}

export function authCodeVerificationFailed(error) {
  return {
    type: AUTH_CODE_VERIFICATION_FAILED,
    error
  }
}

export function loginToXBL(username, password) {
  return dispatch => {
    dispatch(submitCredentials(username, password));

    return login(username, password)
      .then(result => {
        if (result.authCodeRequired) {
          return dispatch(authCodeRequired());
        }

        [
          loggedIn(),
          updateFriends(),
          routeActions.push(FRIENDS_ROUTE)
        ].map(dispatch);
      })
      .catch(err => dispatch(loginFailed(err)) );
  }
}

export function verifyXBLAuthCode(authCode) {
  return dispatch => {
    dispatch(submitAuthCode(authCode));

    return verifyAuthCode(authCode)
      .then(() => {
        [
          loggedIn(),
          updateFriends(),
          routeActions.push(FRIENDS_ROUTE)
        ].map(dispatch);
      })
      .catch(err => dispatch(authCodeVerificationFailed(err)) );
  }
}

export function requestSignOut() {
  return {
    type: REQUEST_SIGN_OUT
  }
}

export function loggedOut() {
  return {
    type: LOGGED_OUT
  }
}

export function logoutOfXBL() {
  return dispatch => {
    dispatch(requestSignOut());

    return logout()
      .then(() => {
        dispatch(loggedOut());
        dispatch(routeActions.push(AUTH_ROUTE));
      })
      .catch(err => dispatch(logoutFailed(err)) );
  }
}
