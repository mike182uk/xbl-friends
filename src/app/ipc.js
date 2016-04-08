import { ipcRenderer } from 'electron';

import {
  loginSuccessful,
  logoutSuccessful,
  authenticated,
  authenticating,
  authCancelled
} from './actions/auth';
import { friendsRetrievalSuccessful } from './actions/friends';
import { appLoadSuccessful } from './actions/app';

import {
  IPC_CHANNEL_MAIN,
  IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
  IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION,
  XBL_WINDOW_EVENT_LOGGED_IN,
  XBL_WINDOW_EVENT_LOGGED_OUT,
  XBL_WINDOW_EVENT_FRIENDS_RETRIEVED,
  XBL_WINDOW_EVENT_WINDOW_DISPLAYED,
  XBL_WINDOW_EVENT_INITIAL_LOAD_COMPLETE,
  XBL_WINDOW_EVENT_AUTH_CANCELLED,
  XBL_WINDOW_ACTION_LOGIN,
  XBL_WINDOW_ACTION_LOGOUT,
  XBL_WINDOW_ACTION_RETRIEVE_FRIENDS,
} from '../common/constants';

export function init(dispatch) {
  ipcRenderer.on(IPC_CHANNEL_MAIN, (event, message) => {
    if (message.type == IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT) {
      switch (message.event) {
        case XBL_WINDOW_EVENT_LOGGED_IN:
          return dispatch(loginSuccessful());
        case XBL_WINDOW_EVENT_LOGGED_OUT:
          return dispatch(logoutSuccessful());
        case XBL_WINDOW_EVENT_FRIENDS_RETRIEVED:
          return dispatch(friendsRetrievalSuccessful(message.data.friends));
        case XBL_WINDOW_EVENT_WINDOW_DISPLAYED:
          return dispatch(authenticating());
        case XBL_WINDOW_EVENT_INITIAL_LOAD_COMPLETE:
          return dispatch(appLoadSuccessful(message.data.authenticated));
        case XBL_WINDOW_EVENT_AUTH_CANCELLED:
          return dispatch(authCancelled());
      }
    }
  });
}

export function requestLogin() {
  sendIpcMessageToMain({
    type: IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION,
    action: XBL_WINDOW_ACTION_LOGIN
  });
}

export function requestLogout() {
  sendIpcMessageToMain({
    type: IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION,
    action: XBL_WINDOW_ACTION_LOGOUT
  });
}

export function requestFriendsRetrieval() {
  sendIpcMessageToMain({
    type: IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION,
    action: XBL_WINDOW_ACTION_RETRIEVE_FRIENDS
  });
}

function sendIpcMessageToMain(message) {
  ipcRenderer.send(IPC_CHANNEL_MAIN, message);
}
