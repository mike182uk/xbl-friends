import {
  REQUEST_LOGIN,
  LOGGED_IN,
  AUTHENTICATED,
  REQUEST_LOGOUT,
  LOGGED_OUT,
  AUTH_CANCELLED
} from '../actions/auth';

const initialState = {
  authorized: false,
  actionInProgress: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATED:
    case LOGGED_IN:
      return Object.assign({}, state, {
        actionInProgress: false,
        authorized: true,
        authCodeRequired: false
      });

    case REQUEST_LOGIN:
    case REQUEST_LOGOUT:
      return Object.assign({}, state, {
        actionInProgress: true
      });

    case LOGGED_OUT:
    case AUTH_CANCELLED:
      return Object.assign({}, state, {
        actionInProgress: false,
        authorized: false
      });

    default:
      return state;
  }
}
