import { routeActions } from 'react-router-redux'

import { requestFriendsRetrieval as ipcRequestFriendsRetrieval } from '../ipc';

export const REQUEST_FRIENDS_RETRIEVAL = 'REQUEST_FRIENDS_RETRIEVAL';
export const BG_REQUEST_FRIENDS_RETRIEVAL = 'BG_REQUEST_FRIENDS_RETRIEVAL';
export const FRIENDS_RETRIEVED = 'FRIENDS_RETRIEVED';

export function requestFriendsRetrieval() {
  return {
    type: REQUEST_FRIENDS_RETRIEVAL
  }
}

export function bgRequestFriendsRetrieval() {
  return {
    type: BG_REQUEST_FRIENDS_RETRIEVAL
  }
}

export function friendsRetrievalRequested(bg = false) {
  return dispatch => {
    dispatch(bg ? bgRequestFriendsRetrieval() : requestFriendsRetrieval());

    return ipcRequestFriendsRetrieval();
  }
}

export function friendsRetrievalSuccessful(friends) {
  return {
    type: FRIENDS_RETRIEVED,
    friends
  }
}
