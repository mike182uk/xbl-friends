import {
  REQUEST_FRIENDS_UPDATE,
  BG_REQUEST_FRIENDS_UPDATE,
  FRIENDS_UPDATED,
  FRIENDS_UPDATE_FAILED
} from '../actions/friends';

import { LOGGED_OUT } from '../actions/auth';

const initialState = {
  friends: [],
  lastUpdatedAt: null,
  updateInProgress: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case REQUEST_FRIENDS_UPDATE:
    case BG_REQUEST_FRIENDS_UPDATE:
      return Object.assign({}, state, {
        updateInProgress: true
      });

    case FRIENDS_UPDATED:
      return Object.assign({}, state, {
        updateInProgress: false,
        lastUpdatedAt: new Date(),
        friends: action.friends
      });

    case FRIENDS_UPDATE_FAILED:
      return Object.assign({}, state, {
        updateInProgress: false
      });

    case LOGGED_OUT:
      return Object.assign({}, state, {
        friends: [],
        lastUpdatedAt: null,
        updateInProgress: false
      });

    default:
      return state;
  }
}
