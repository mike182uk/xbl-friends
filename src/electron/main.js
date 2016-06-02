'use strict'

const devMode = process.env.NODE_ENV === 'dev'
const showXBL = process.env.SHOW_XBL === 'true'

const _ = require('lodash')
const electron = require('electron')
const path = require('path')

const constants = require(path.resolve(__dirname, '../common/constants'))
const initialiseWindows = require('./windows')
const initialiseIpc = require('./ipc')

const app = electron.app
const Menu = electron.Menu
const Tray = electron.Tray
const windows = {}

app.on('ready', () => {
  // cache windows globally so we can access them in other events
  _.each(initialiseWindows(), (window, id) => {
    windows[id] = window
  })

  // hide dock icon
  if (!devMode) {
    app.dock.hide()
  }

  // set app menu
  let appMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => app.quit()
    }
  ])

  let appIcon = new Tray(path.join(`${__dirname}`, 'iconTemplate.png'))
  appIcon.setToolTip('XBL Friends')

  appIcon.on('click', (event, bounds) => {
    let window = windows[constants.WINDOW_ID_APP]

    if (window.isVisible()) {
      window.hide()
    } else {
      window.setPosition(bounds.x, bounds.y)
      window.show()
    }
  })

  appIcon.on('right-click', () => {
    appMenu.popup(windows[constants.WINDOW_ID_APP])
  })

  // initialise IPC
  initialiseIpc(..._.toArray(windows))

  // initialise auth related events
  initialiseAuthEvents(..._.toArray(windows))
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  windows[constants.WINDOW_ID_XBL].forceClose = true
})

function initialiseAuthEvents (appWindow, xblWindow) {
  // When the XBL window is closed, instead of destroying just hide and let the app
  // window know the window was closed. The only reason the window should be visible
  // is because the user is authenticating.
  xblWindow.on('close', event => {
    if (xblWindow.forceClose) return

    event.preventDefault()

    xblWindow.hide()

    appWindow.webContents.send(constants.IPC_CHANNEL_MAIN, {
      type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
      event: constants.XBL_WINDOW_EVENT_WINDOW_CLOSED
    })
  })

  // Watch navigation changes to work out when to hide the window. The window should
  // be hidden if it is visible and it has just navigated to the friends page as this
  // means the user is now logged in.
  xblWindow.webContents.on('did-navigate', () => {
    if (xblWindow.webContents.getURL() === constants.URL_FRIENDS && !xblWindow.authenticated) {
      xblWindow.authenticated = true

      if (!showXBL) {
        xblWindow.hide()
      }

      appWindow.show()

      // wait for this page to finish loading before we trigger any other page loads
      xblWindow.webContents.once('did-finish-load', () => {
        appWindow.webContents.send(constants.IPC_CHANNEL_MAIN, {
          type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
          event: constants.XBL_WINDOW_EVENT_LOGGED_IN
        })
      })
    }
  })
}
