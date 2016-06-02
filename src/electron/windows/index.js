'use strict'

const _ = require('lodash')

const constants = require('../../common/constants')

module.exports = () => {
  let windows = {
    [constants.WINDOW_ID_APP]: require('./app')(),
    [constants.WINDOW_ID_XBL]: require('./xbl')()
  }

  // dereference window when closed
  _.each(windows, (window, id) => {
    window.on('closed', () => {
      windows[id] = null
    })
  })

  return windows
}
