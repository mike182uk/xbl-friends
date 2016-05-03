'use strict'

const showXBL = process.env.SHOW_XBL === 'true'

const electron = require('electron')
const path = require('path')

const constants = require('../../common/constants')

const BrowserWindow = electron.BrowserWindow

const windowOpts = {
  show: false,
  width: 400,
  height: 600,
  center: true,
  alwaysOnTop: true,
  webPreferences: {
    preload: path.resolve(__dirname, './preload-scripts/xbl.js')
  }
}

module.exports = (appWindow) => {
  let opts = windowOpts

  if (showXBL) {
    opts = Object.assign({}, opts, {
      show: true,
      width: 1100,
      height: 700,
      alwaysOnTop: false
    })
  }

  let window = new BrowserWindow(opts)

  // When the window is closed, instead of destroying just hide and let the app
  // window know the window was closed. The only reason the window will be visible
  // is because the user is authenticating. If they close the window, we assume
  // they have cancelled the authorization process.
  window.on('close', event => {
    if (window.forceClose) return

    event.preventDefault()

    window.hide()

    appWindow.webContents.send(constants.IPC_CHANNEL_MAIN, {
      type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
      event: constants.XBL_WINDOW_EVENT_AUTH_CANCELLED
    })
  })

  // After the first initial load, let the app window know this is complete. If
  // we are on the friends page, then we are still authenticated and do not need a
  // login. The app window will listen for this event and setup the initial view
  // based on this.
  window.webContents.once('did-finish-load', () => {
    appWindow.webContents.send(constants.IPC_CHANNEL_MAIN, {
      type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
      event: constants.XBL_WINDOW_EVENT_INITIAL_LOAD_COMPLETE,
      data: {
        authenticated: window.getURL() === constants.URL_FRIENDS
      }
    })
  })

  window.loadURL(constants.URL_FRIENDS)

  if (showXBL) {
    window.webContents.openDevTools()
  }

  return window
}
