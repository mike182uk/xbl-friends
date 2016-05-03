'use strict'

const showXBL = process.env.SHOW_XBL === 'true'

const electron = require('electron')
const path = require('path')

const constants = require(path.resolve(__dirname, '../common/constants'))

const ipcMain = electron.ipcMain

module.exports = (appWindow, xblWindow) => {
  let appWindowWebContents = appWindow.webContents
  let xblWindowWebContents = xblWindow.webContents

  // listen for action requests on the main channel
  ipcMain.on(constants.IPC_CHANNEL_MAIN, (event, message) => {
    if (message.type === constants.IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION) {
      switch (message.action) {
        // show the app window when login is requested. This will allow the user
        // to proceed with authorization via the XBL window
        case constants.XBL_WINDOW_ACTION_LOGIN:
          xblWindow.show()
          break

        case constants.XBL_WINDOW_ACTION_LOGOUT:
          // clear XBL window session storage which will delete all cookies etc.
          // assiociated with the XBL website. Once cleared, reload the friends
          // URL which should redirect back to the login URL and send a message
          // to the app window
          xblWindowWebContents
            .session
            .clearStorageData(() => {
              xblWindowWebContents.loadURL(constants.URL_FRIENDS)

              appWindowWebContents.send(constants.IPC_CHANNEL_MAIN, {
                type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
                event: constants.XBL_WINDOW_EVENT_LOGGED_OUT
              })
            })
          break

        case constants.XBL_WINDOW_ACTION_RETRIEVE_FRIENDS:
          // reload friends page to get latest data, then once loaded send message
          // to XBL window to initiate trigger of friends retrieval
          xblWindowWebContents.once('dom-ready', () => {
            xblWindowWebContents.send(constants.IPC_CHANNEL_XBL_WINDOW, {
              type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_ACTION,
              action: constants.XBL_WINDOW_ACTION_RETRIEVE_FRIENDS
            })
          })

          xblWindowWebContents.loadURL(constants.URL_FRIENDS)
          break
      }
    }
  })

  // listen for events on the XBL window channel
  ipcMain.on(constants.IPC_CHANNEL_XBL_WINDOW, (event, message) => {
    if (message.type === constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT) {
      switch (message.event) {
        case constants.XBL_WINDOW_EVENT_FRIENDS_RETRIEVED:
          // forward on message to app window
          appWindowWebContents.send(constants.IPC_CHANNEL_MAIN, {
            type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
            event: constants.XBL_WINDOW_EVENT_FRIENDS_RETRIEVED,
            data: message.data
          })
          break
      }
    }
  })

  // Watch navigation changes to work out when to hide the window. The window should
  // be hidden if it is visible and it has just navigated to the friends page as this
  // means the user is now logged in.
  xblWindowWebContents.on('did-navigate', () => {
    let loggedInEventSent = false
    let condition = () => (showXBL) ? loggedInEventSent : xblWindow.isVisible()

    if (xblWindowWebContents.getURL() === constants.URL_FRIENDS && condition()) {
      if (!showXBL) {
        xblWindow.hide()
      } else {
        loggedInEventSent = true
      }

      appWindow.show()

      // wait for this page to finish loading before we trigger any other page loads
      xblWindowWebContents.once('did-finish-load', () => {
        appWindowWebContents.send(constants.IPC_CHANNEL_MAIN, {
          type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
          event: constants.XBL_WINDOW_EVENT_LOGGED_IN
        })
      })
    }
  })
}
