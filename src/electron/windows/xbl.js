'use strict'

const showXBL = process.env.SHOW_XBL === 'true'

const electron = require('electron')
const path = require('path')

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

module.exports = () => {
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

  if (showXBL) {
    window.webContents.openDevTools()
  }

  // keep track of whether the user is authenticated to view there friends
  // on the XBL website
  window.authenticated = false

  return window
}
