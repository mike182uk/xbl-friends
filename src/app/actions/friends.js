import { routeActions } from 'react-router-redux'

import { fetchFriends } from '../xbl';

export const REQUEST_FRIENDS_UPDATE = 'REQUEST_FRIENDS_UPDATE';
export const BG_REQUEST_FRIENDS_UPDATE = 'BG_REQUEST_FRIENDS_UPDATE';
export const FRIENDS_UPDATED = 'FRIENDS_UPDATED';
export const FRIENDS_UPDATE_FAILED = 'FRIENDS_UPDATE_FAILED';

export function requestFriendsUpdate() {
  return {
    type: REQUEST_FRIENDS_UPDATE
  }
}

export function bgRequestFriendsUpdate() {
  return {
    type: BG_REQUEST_FRIENDS_UPDATE
  }
}

export function friendsUpdated(friends) {
  return {
    type: FRIENDS_UPDATED,
    friends
  }
}

export function friendsUpdateFailed(error) {
  return {
    type: FRIENDS_UPDATE_FAILED,
    error
  }
}

export function updateFriends() {
  return dispatch => {
    dispatch(requestFriendsUpdate());

    return fetchFriends()
      .then(friends => dispatch(friendsUpdated(friends)) )
      .catch(err => dispatch(friendsUpdateFailed(err)) );
  }
}

export function bgUpdateFriends() {
  return dispatch => {
    dispatch(bgRequestFriendsUpdate());

    return fetchFriends()
      .then(friends => dispatch(friendsUpdated(friends)) )
      .catch(err => dispatch(friendsUpdateFailed(err)) );
  }
}
