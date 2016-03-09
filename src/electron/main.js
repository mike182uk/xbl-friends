'use strict';

const electron = require('electron');
const path = require('path');

const constants = require('../common/constants');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const Menu = electron.Menu;
const Tray = electron.Tray;

const devMode = process.env.NODE_ENV == 'dev';
const noXBL = process.env.NO_XBL == 'true';
const windows = {};

app.on('ready', () => {
  if (!devMode) {
    app.dock.hide();
  }

  let appMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => app.quit()
    }
  ]);

  let appIcon = new Tray(path.join(`${__dirname}`, 'iconTemplate.png'));
  appIcon.setToolTip('XBL Friends');

  appIcon.on('click', (event, bounds) => {
    let window = windows[constants.WINDOW_ID_APP];

    if (window.isVisible()) {
      window.hide();
    } else {
      window.setPosition(bounds.x, bounds.y);
      window.show();
    }
  });

  appIcon.on('right-click', () => {
    appMenu.popup(windows[constants.WINDOW_ID_APP]);
  });

  createAppWindow();

  if (!noXBL) {
    createXblWindow();
    initIpc();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function createAppWindow() {
  let windowOpts = {
    width: 410,
    height: 600,
    show: false,
    frame: false,
    movable: false,
    resizable: false,
    fullscreenable: false,
    minimizable: false,
    maximizable: false,
    closable: false
  };

  if (devMode) {
    windowOpts = Object.assign({}, windowOpts, {
      width: 1100,
      height: 700,
      show: true,
      frame: true,
      movable: true,
      resizable: true,
      closable: true
    });
  }

  let window = new BrowserWindow(windowOpts);

  window.loadURL(`http://localhost:${process.env.DEV_SERVER_PORT}`);

  if (devMode) {
    window.webContents.openDevTools();
  }

  if (!devMode) {
    window.on('blur', () => {
      window.hide();
    });
  }

  windows[constants.WINDOW_ID_APP] = window;
}

function createXblWindow() {
  let windowOpts = {
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'xbl-window', 'preload.js')
    }
  };

  if (devMode) {
    windowOpts = Object.assign({}, windowOpts, {
      width: 1100,
      height: 700,
      show: true,
    });
  }

  let window = new BrowserWindow(windowOpts);

  window.loadURL(constants.URL_FRIENDS);

  if (devMode) {
    window.webContents.openDevTools();
  }

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
