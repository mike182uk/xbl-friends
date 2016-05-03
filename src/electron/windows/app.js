'use strict'

const devMode = process.env.NODE_ENV === 'dev'
const intMode = process.env.NODE_ENV === 'int'

const electron = require('electron')
const path = require('path')

const BrowserWindow = electron.BrowserWindow

const windowOpts = {
  width: 410,
  height: 600,
  show: false,
  frame: false,
  movable: false,
  resizable: false,
  fullscreenable: false,
  minimizable: false,
  maximizable: false
}

const windowUrl = (devMode || intMode)
  ? `http://localhost:${process.env.DEV_SERVER_PORT}`
  : `file://${path.resolve(__dirname, '../../app/index.html')}`

module.exports = () => {
  let opts = windowOpts

  if (devMode) {
    opts = Object.assign({}, opts, {
      width: 1100,
      height: 700,
      show: true,
      frame: true,
      movable: true,
      resizable: true
    })
  }

  let window = new BrowserWindow(opts)

  window.loadURL(windowUrl)

  if (devMode) {
    window.webContents.openDevTools()
  } else {
    window.on('blur', () => window.hide())
  }

  return window
}
