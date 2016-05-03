'use strict'

const devMode = process.env.NODE_ENV === 'dev'

const electron = require('electron')
const path = require('path')
const _ = require('lodash')

const constants = require(path.resolve(__dirname, '../common/constants'))
const initWindows = require('./windows')
const initIpc = require('./ipc')

const app = electron.app
const Menu = electron.Menu
const Tray = electron.Tray
const windows = {}

app.on('ready', () => {
  _.each(initWindows(), (window, id) => {
    windows[id] = window
  })

  if (!devMode) {
    app.dock.hide()
  }

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

  initIpc(
    windows[constants.WINDOW_ID_APP],
    windows[constants.WINDOW_ID_XBL]
  )
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  windows[constants.WINDOW_ID_XBL].forceClose = true
})
