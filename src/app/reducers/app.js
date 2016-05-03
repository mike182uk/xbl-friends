import { APP_LOADING, APP_LOADED } from '../actions/app'

import { LOGOUT_FAILED } from '../actions/auth'

import { FRIENDS_RETRIEVED, FRIENDS_UPDATE_FAILED } from '../actions/friends'

import { UPDATE_LOCATION } from 'react-router-redux'

const initialState = {
  error: null,
  loaded: false
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

    case APP_LOADING:
      return Object.assign({}, state, {
        loaded: false
      })

    case APP_LOADED:
      return Object.assign({}, state, {
        loaded: true
      })

    default:
      return state
  }
}
