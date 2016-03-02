'use strict';

const electron = require('electron');
const path = require('path');

const constants = require('../common/constants');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const windows = {};

app.on('ready', () => {
  createAppWindow();
  createXblWindow();
  initIpc();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (windows[constants.WINDOW_ID_APP] === null) {
    createAppWindow();
  }

  if (windows[constants.WINDOW_ID_XBL] === null) {
    createXblWindow();
  }
});

function createAppWindow() {
  let window = new BrowserWindow({
    width: 1100,
    height: 700
  });

  window.loadURL(`http://localhost:${process.env.DEV_SERVER_PORT}`);

  if (process.env.NODE_ENV == 'dev') {
    window.webContents.openDevTools();
  }

  window.on('closed', () => {
    windows[constants.WINDOW_ID_APP] = null;
  });

  windows[constants.WINDOW_ID_APP] = window;
}

function createXblWindow() {
  if (process.env.NO_XBL) {
    windows[constants.WINDOW_ID_XBL] = '__no_xbl__';

    return;
  }

  let window = new BrowserWindow({
    width: 1100,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'xbl-window', 'preload.js')
    }
  });

  window.loadURL(constants.URL_FRIENDS);

  if (process.env.NODE_ENV == 'dev') {
    window.webContents.openDevTools();
  }

  window.on('closed', () => {
    windows[constants.WINDOW_ID_XBL] = null;
  });

  windows[constants.WINDOW_ID_XBL] = window;
}

function initIpc() {
  ipcMain.on(constants.IPC_CHANNEL_XBL_WINDOW_RPC, (event, message) => {
    switch (message.type) {
      case constants.IPC_MESSAGE_TYPE_REQ:
        windows[constants.WINDOW_ID_XBL]
          .webContents
          .send(constants.IPC_CHANNEL_RPC_REQ, message);
        break;
      case constants.IPC_MESSAGE_TYPE_RES:
        windows[constants.WINDOW_ID_APP]
          .webContents
          .send(constants.IPC_CHANNEL_RPC_RES, message);
        break;
    }
  });

  ipcMain.on(constants.IPC_CHANNEL_XBL_WINDOW, (event, message) => {
    switch(message.cmd) {
      case constants.XBL_WINDOW_CMD_NAVIGATE:
        xblWindownNavigateAndWaitForDom(
          message.data.url,
          windows[message.from].webContents
        );
        break;
      case constants.XBL_WINDOW_CMD_CLEAR_STORAGE:
        xblWindowClearStorage(windows[message.from].webContents);
        break;
    }
  });
}

function xblWindownNavigateAndWaitForDom(url, webContentsToNotify) {
  let xblWindowWebContents = windows[constants.WINDOW_ID_XBL].webContents;

  xblWindowWebContents.once('dom-ready', () => {
    webContentsToNotify.send(constants.IPC_CHANNEL_XBL_WINDOW_RES, {
      cmd: constants.XBL_WINDOW_CMD_NAVIGATE,
      data: {
        current_url: xblWindowWebContents.getURL()
      }
    });
  });

  xblWindowWebContents.loadURL(url);
}

function xblWindowClearStorage(webContentsToNotify) {
  windows[constants.WINDOW_ID_XBL].webContents.session.clearStorageData(() => {
    webContentsToNotify.send(constants.IPC_CHANNEL_XBL_WINDOW_RES, {
      cmd: constants.XBL_WINDOW_CMD_CLEAR_STORAGE,
      data: {}
    });
  });
}
