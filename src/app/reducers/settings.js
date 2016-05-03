import deepAssign from 'deep-assign'

import { SET_NOTIFICATION_PREFERENCE, SET_BG_UPDATE_STATUS, SET_BG_UPDATE_INTERVAL } from '../actions/settings'

import { NOTIFICATION_PREFERENCE_FRIEND_ONLY } from '../constants/settings'

const initialState = {
  notifications: {
    preference: NOTIFICATION_PREFERENCE_FRIEND_ONLY
  },
  friends: {
    bgUpdate: true,
    bgUpdateInterval: 15 * 60 * 1000
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATION_PREFERENCE:
      return deepAssign({}, state, {
        notifications: {
          preference: action.preference
        }
      })

    case SET_BG_UPDATE_STATUS:
      return deepAssign({}, state, {
        friends: {
          bgUpdate: action.status
        }
      })

    case SET_BG_UPDATE_INTERVAL:
      return deepAssign({}, state, {
        friends: {
          bgUpdateInterval: action.interval
        }
      })

    default:
      return state
  }
}
