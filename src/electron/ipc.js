'use strict'

const electron = require('electron')
const path = require('path')

const constants = require(path.resolve(__dirname, '../common/constants'))

const ipcMain = electron.ipcMain

module.exports = (appWindow, xblWindow) => {
  let appWindowWebContents = appWindow.webContents
  let xblWindowWebContents = xblWindow.webContents

  // listen for action requests on the main channel
  ipcMain.on(constants.IPC_CHANNEL_MAIN, (event, message) => {
    // listen for XBL window actions
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
          // to the app window. Set xblWindow.authenticated to be false so the
          // user can re-authenticate without restarting the app
          xblWindowWebContents
            .session
            .clearStorageData(() => {
              xblWindow.authenticated = false

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

    // listen for app window actions
    if (message.type === constants.IPC_MESSAGE_TYPE_APP_WINDOW_ACTION) {
      switch (message.event) {
        // load / reload the friends page and send a message to the app window
        // informing it the XBL window has loaded and also send along the
        // authentication status
        case constants.APP_WINDOW_EVENT_INITIALISING:
          xblWindowWebContents.once('did-finish-load', () => {
            let authenticated = xblWindowWebContents.getURL() === constants.URL_FRIENDS

            xblWindow.authenticated = authenticated

            appWindowWebContents.send(constants.IPC_CHANNEL_MAIN, {
              type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
              event: constants.XBL_WINDOW_EVENT_INITIALISED,
              data: {
                authenticated: authenticated
              }
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
        // when friends have been retrieved from XBL window, forward on message
        // to app window
        case constants.XBL_WINDOW_EVENT_FRIENDS_RETRIEVED:
          appWindowWebContents.send(constants.IPC_CHANNEL_MAIN, {
            type: constants.IPC_MESSAGE_TYPE_XBL_WINDOW_EVENT,
            event: constants.XBL_WINDOW_EVENT_FRIENDS_RETRIEVED,
            data: message.data
          })
          break
      }
    }
  })
}
