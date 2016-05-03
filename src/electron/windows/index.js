'use strict'

const _ = require('lodash')

const constants = require('../../common/constants')

module.exports = () => {
  let appWindow = require('./app')()
  let xblWindow = require('./xbl')(appWindow)

  let windows = {
    [constants.WINDOW_ID_APP]: appWindow,
    [constants.WINDOW_ID_XBL]: xblWindow
  }

  // dereference window when closed
  _.each(windows, (window, id) => {
    window.on('closed', () => {
      windows[id] = null
    })
  })

  return windows
}
