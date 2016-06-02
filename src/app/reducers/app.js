import { UPDATE_LOCATION } from 'react-router-redux'

import { APP_INITIALISING, APP_INITIALISED } from '../actions/app'
import { LOGOUT_FAILED } from '../actions/auth'
import { FRIENDS_RETRIEVED, FRIENDS_UPDATE_FAILED } from '../actions/friends'

const initialState = {
  error: null,
  initialised: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGOUT_FAILED:
    case FRIENDS_UPDATE_FAILED:
      return Object.assign({}, state, {
        error: action.error
      })

    case FRIENDS_RETRIEVED:
    case UPDATE_LOCATION:
      return Object.assign({}, state, {
        error: null
      })

    case APP_INITIALISING:
      return Object.assign({}, state, {
        initialised: false
      })

    case APP_INITIALISED:
      return Object.assign({}, state, {
        initialised: true
      })

    default:
      return state
  }
}
