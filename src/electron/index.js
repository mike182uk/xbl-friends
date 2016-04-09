'use strict';

const devMode = process.env.NODE_ENV == 'dev';
const intMode = process.env.NODE_ENV == 'int';

const electron = require('electron');
const path = require('path');

const constants = require((devMode || intMode) ? '../common/constants' : './common/constants');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const Menu = electron.Menu;
const Tray = electron.Tray;

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
  createXblWindow();
  initIpc();
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

  let windowUrl = (devMode || intMode) ? `http://localhost:${process.env.DEV_SERVER_PORT}` : `file://${path.resolve(__dirname, 'app/index.html')}`;

  window.loadURL(windowUrl);

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
    width: 400,
    height: 600,
    center: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'xbl-window', 'preload.js'),
    }
  };

  let window = new BrowserWindow(windowOpts);

  let appWindowWebContents = windows[constants.WINDOW_ID_APP].webContents;

  // When the window is closed, instead of destroying just hide and let the app
  // window know the window was closed. The only reason the window will be visible
  // is because the user is authenticating. If they close the window, we assume
  // they have cancelled the authorization process.
  window.on('close', (event) => {
    event.preventDefault();

    window.hide();

    appWindowWebContents.send(constants.IPC_CHANNEL_MAIN, {
        type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
        event: constants.XBL_WINDOW_EVENT_AUTH_CANCELLED
      });
  });

  // After the first initial load, let the app window know this is complete. If
  // we are on the friends page, then we are still authenticated and do not need a
  // login. The app window will listen for this event and setup the initial view
  // based on this.
  window.webContents.once('did-finish-load', () => {
    appWindowWebContents.send(constants.IPC_CHANNEL_MAIN, {
        type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
        event: constants.XBL_WINDOW_EVENT_INITIAL_LOAD_COMPLETE,
        data: {
          authenticated: window.getURL() == constants.URL_FRIENDS
        }
      });
  });

  window.loadURL(constants.URL_FRIENDS);

  windows[constants.WINDOW_ID_XBL] = window;
}

function initIpc() {
  let xblWindow = windows[constants.WINDOW_ID_XBL];
  let appWindow = windows[constants.WINDOW_ID_APP];
  let xblWindowWebContents = xblWindow.webContents;
  let appWindowWebContents = appWindow.webContents;

  // listen for action requests on the main channel
  ipcMain.on(constants.IPC_CHANNEL_MAIN, (event, message) => {
    if (message.type == constants.IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION) {
      switch (message.action) {
        // show the app window when login is requested. This will allow the user
        // to proceed with authorization via the XBL window
        case constants.XBL_WINDOW_ACTION_LOGIN:
          xblWindow.show();
          break;

        case constants.XBL_WINDOW_ACTION_LOGOUT:
          // clear XBL window session storage which will delete all cookies etc.
          // assiociated with the XBL website. Once cleared, reload the friends
          // URL which should redirect back to the login URL and send a message
          // to the app window
          xblWindowWebContents
            .session
            .clearStorageData(() => {
              xblWindowWebContents.loadURL(constants.URL_FRIENDS);

              appWindowWebContents.send(constants.IPC_CHANNEL_MAIN, {
                  type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
                  event: constants.XBL_WINDOW_EVENT_LOGGED_OUT
                });
            });
          break;

        case constants.XBL_WINDOW_ACTION_RETRIEVE_FRIENDS:
          // reload friends page to get latest data, then once loaded send message
          // to XBL window to initiate trigger of friends retrieval
          xblWindowWebContents.once('dom-ready', () => {
            xblWindowWebContents.send(constants.IPC_CHANNEL_XBL_WINDOW, {
              type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION,
              action: constants.XBL_WINDOW_ACTION_RETRIEVE_FRIENDS
            });
          });

          xblWindowWebContents.loadURL(constants.URL_FRIENDS);
          break;
      }
    }
  });

  // listen for events on the XBL window channel
  ipcMain.on(constants.IPC_CHANNEL_XBL_WINDOW, (event, message) => {
    if (message.type == constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT) {
      switch (message.event) {
        case constants.XBL_WINDOW_EVENT_FRIENDS_RETRIEVED:
          // forward on message to app window
          appWindowWebContents.send(constants.IPC_CHANNEL_MAIN, {
              type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
              event: constants.XBL_WINDOW_EVENT_FRIENDS_RETRIEVED,
              data: message.data
            });
          break;
      }
    }
  });

  // Watch navigation changes to work out when to hide the window. The window should
  // be hidden if it is visible and it has just navigated to the friends page as this
  // means the user is now logged in.
  xblWindowWebContents.on('did-navigate', () => {
    if (xblWindowWebContents.getURL() == constants.URL_FRIENDS && xblWindow.isVisible()) {
      xblWindow.hide();
      appWindow.show();

      // wait for this page to finish loading before we trigger any other page loads
      xblWindowWebContents.once('did-finish-load', () => {
        appWindowWebContents.send(constants.IPC_CHANNEL_MAIN, {
            type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
            event: constants.XBL_WINDOW_EVENT_LOGGED_IN,
          });
      });
    }
  });
}
