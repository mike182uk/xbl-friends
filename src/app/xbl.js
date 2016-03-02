import { ipcRenderer } from 'electron';

import {
  WINDOW_ID_APP,
  XBL_WINDOW_CMD_CLEAR_STORAGE,
  XBL_WINDOW_CMD_NAVIGATE,
  IPC_CHANNEL_XBL_WINDOW_RPC,
  IPC_CHANNEL_XBL_WINDOW,
  IPC_CHANNEL_XBL_WINDOW_RES,
  IPC_CHANNEL_RPC_RES,
  URL_FRIENDS,
  URL_LOGOUT,
  IPC_RPC_LOGIN,
  IPC_RPC_VERIFY_AUTH_CODE,
  IPC_RPC_GET_FRIENDS,
  IPC_MESSAGE_TYPE_REQ
} from '../common/constants';

export function init() {
  return new Promise((resolve, reject) => {
    xblWindowNavigateAndWaitForDom(URL_FRIENDS)
      .then(currentUrl => {
        let isLoggedIn = currentUrl.indexOf(URL_FRIENDS) == 0;

        resolve(isLoggedIn);
      });
  });
}

export function login(username, password) {
  return new Promise((resolve, reject) => {
    sendXblWindowRpcAndWaitForRes(IPC_RPC_LOGIN, { username, password })
      .then(result => {
        if (!result.status) {
          reject('There was a problem signing you into your Xbox Live account.');
        } else {
          let authCodeRequired = result.hasOwnProperty('authCodeRequired') ? result.authCodeRequired : false;

          resolve({ authCodeRequired });
        }
      });
  });
}

export function verifyAuthCode(authCode) {
  return new Promise((resolve, reject) => {
    sendXblWindowRpcAndWaitForRes(IPC_RPC_VERIFY_AUTH_CODE, { authCode })
      .then(result => {
        if (!result.status) {
          reject('There was a problem verifying the auth code.');
        } else {
          resolve();
        }
      });
  });
}

export function logout() {
  return new Promise((resolve, reject) => {
    xblWindowClearStorage()
      .then(() => xblWindowNavigateAndWaitForDom(URL_LOGOUT))
      .then(currentUrl => {
        if (currentUrl.indexOf('login.live.com') > -1) {
          resolve();
        } else {
          reject('There was a problem signing you out of your Xbox Live account.');
        }
      });
  });
}

export function fetchFriends() {
  return new Promise((resolve, reject) => {
    xblWindowNavigateAndWaitForDom(URL_FRIENDS)
      .then(currentUrl => {
        if (currentUrl == -1) {
          reject('There was a problem updating your friends list.');
        }

        sendXblWindowRpcAndWaitForRes(IPC_RPC_GET_FRIENDS)
          .then(result => resolve(result));
      });
  });
}

function sendXblWindowRpcAndWaitForRes(action, data) {
  return new Promise((resolve, reject) => {
    const listener = (event, message) => {
      if (message.action == action) {
        ipcRenderer.removeListener(IPC_CHANNEL_RPC_RES, listener);

        resolve(message.data);
      }
    }

    ipcRenderer.on(IPC_CHANNEL_RPC_RES, listener);

    sendXblWindowRpc(action, data);
  });
}

function sendXblWindowRpc(action, data) {
  ipcRenderer.send(IPC_CHANNEL_XBL_WINDOW_RPC, {
    type: IPC_MESSAGE_TYPE_REQ,
    action,
    data
  });
}

function xblWindowNavigateAndWaitForDom(url) {
  return sendXblWindowCmdAndWait(XBL_WINDOW_CMD_NAVIGATE, { url })
    .then(result => result.current_url);
}

function xblWindowClearStorage() {
  return sendXblWindowCmdAndWait(XBL_WINDOW_CMD_CLEAR_STORAGE);
}

function sendXblWindowCmdAndWait(cmd, data = {}) {
  return new Promise((resolve, reject) => {
    const listener = (event, message) => {
      if (message.cmd == cmd) {
        ipcRenderer.removeListener(IPC_CHANNEL_XBL_WINDOW_RES, listener);

        resolve(message.data);
      }
    }

    ipcRenderer.on(IPC_CHANNEL_XBL_WINDOW_RES, listener);

    sendXblWindowCmd(cmd, data);
  })
}

function sendXblWindowCmd(cmd, data) {
  ipcRenderer.send(IPC_CHANNEL_XBL_WINDOW, {
    from: WINDOW_ID_APP,
    cmd,
    data
  });
}
