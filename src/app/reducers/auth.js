import {
  SUBMIT_CREDENTIALS,
  SUBMIT_AUTH_CODE,
  LOGGED_IN,
  AUTHENTICATED,
  AUTH_CODE_REQUIRED,
  LOGIN_FAILED,
  AUTH_CODE_VERIFICATION_FAILED,
  CANCEL_AUTH_CODE_SUBMISSION,
  REQUEST_SIGN_OUT,
  LOGGED_OUT,
  LOGOUT_FAILED
} from '../actions/auth';

const initialState = {
  authorized: false,
  authCodeRequired: false,
  actionInProgress: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SUBMIT_CREDENTIALS:
      return Object.assign({}, state, {
        actionInProgress: true
      });

    case SUBMIT_AUTH_CODE:
      return Object.assign({}, state, {
        actionInProgress: true
      });

    case AUTH_CODE_REQUIRED:
      return Object.assign({}, state, {
        actionInProgress: false,
        authCodeRequired: true
      });

    case AUTHENTICATED:
    case LOGGED_IN:
      return Object.assign({}, state, {
        actionInProgress: false,
        authorized: true,
        authCodeRequired: false
      });

    case LOGIN_FAILED:
    case LOGOUT_FAILED:
    case AUTH_CODE_VERIFICATION_FAILED:
      return Object.assign({}, state, {
        actionInProgress: false
      });

    case CANCEL_AUTH_CODE_SUBMISSION:
      return Object.assign({}, state, {
        actionInProgress: false,
        authCodeRequired: false
      });

    case REQUEST_SIGN_OUT:
      return Object.assign({}, state, {
        actionInProgress: true
      });

    case LOGGED_OUT:
      return Object.assign({}, state, {
        actionInProgress: false,
        authorized: false
      });

    default:
      return state;
  }
}
