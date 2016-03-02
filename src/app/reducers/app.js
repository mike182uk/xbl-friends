import {
  APP_LOADING,
  APP_LOADED
} from '../actions/app';

import {
  LOGIN_FAILED,
  AUTH_CODE_VERIFICATION_FAILED,
  LOGOUT_FAILED,
  LOGGED_IN,
  CANCEL_AUTH_CODE_SUBMISSION
} from '../actions/auth';

import {
  FRIENDS_UPDATED,
  FRIENDS_UPDATE_FAILED
} from '../actions/friends';

import { UPDATE_LOCATION } from 'react-router-redux'

const initialState = {
  error: null,
  loaded: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_FAILED:
    case LOGOUT_FAILED:
    case FRIENDS_UPDATE_FAILED:
    case AUTH_CODE_VERIFICATION_FAILED:
      return Object.assign({}, state, {
        error: action.error
      });

    case LOGGED_IN:
    case FRIENDS_UPDATED:
    case CANCEL_AUTH_CODE_SUBMISSION:
    case UPDATE_LOCATION:
      return Object.assign({}, state, {
        error: null
      });

    case APP_LOADING:
      return Object.assign({}, state, {
        loaded: false
      });

    case APP_LOADED:
      return Object.assign({}, state, {
        loaded: true
      });

    default:
      return state;
  }
}
