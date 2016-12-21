import { ipcRenderer } from 'electron'

import { loginSuccessful, logoutSuccessful, authCancelled } from './actions/auth'
import { friendsRetrieved } from './actions/friends'
import { appReady } from './actions/app'
import {
  IPC_CHANNEL_MAIN,
  IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
  IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION,
  IPC_MESSAGE_TYPE_APP_WINDOW_ACTION,
  XBL_WINDOW_EVENT_INITIALISED,
  XBL_WINDOW_EVENT_WINDOW_CLOSED,
  XBL_WINDOW_EVENT_LOGGED_IN,
  XBL_WINDOW_EVENT_LOGGED_OUT,
  XBL_WINDOW_EVENT_FRIENDS_RETRIEVED,
  APP_WINDOW_EVENT_INITIALISING,
  XBL_WINDOW_ACTION_LOGIN,
  XBL_WINDOW_ACTION_LOGOUT,
  XBL_WINDOW_ACTION_RETRIEVE_FRIENDS
} from '../constants'

export function initialise (dispatch) {
  ipcRenderer.on(IPC_CHANNEL_MAIN, (event, message) => {
    if (message.type === IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT) {
      switch (message.event) {
        case XBL_WINDOW_EVENT_INITIALISED:
          return dispatch(appReady(message.data.authenticated))
        case XBL_WINDOW_EVENT_WINDOW_CLOSED:
          return dispatch(authCancelled())
        case XBL_WINDOW_EVENT_LOGGED_IN:
          return dispatch(loginSuccessful())
        case XBL_WINDOW_EVENT_LOGGED_OUT:
          return dispatch(logoutSuccessful())
        case XBL_WINDOW_EVENT_FRIENDS_RETRIEVED:
          return dispatch(friendsRetrieved(message.data.friends))
      }
    }
  })
}

export function notifyAppInitialising () {
  sendIpcMessageToMain({
    type: IPC_MESSAGE_TYPE_APP_WINDOW_ACTION,
    event: APP_WINDOW_EVENT_INITIALISING
  })
}

export function requestLogin () {
  sendIpcMessageToMain({
    type: IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION,
    action: XBL_WINDOW_ACTION_LOGIN
  })
}

export function requestLogout () {
  sendIpcMessageToMain({
    type: IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION,
    action: XBL_WINDOW_ACTION_LOGOUT
  })
}

export function requestFriendsRetrieval () {
  sendIpcMessageToMain({
    type: IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION,
    action: XBL_WINDOW_ACTION_RETRIEVE_FRIENDS
  })
}

function sendIpcMessageToMain (message) {
  ipcRenderer.send(IPC_CHANNEL_MAIN, message)
}
