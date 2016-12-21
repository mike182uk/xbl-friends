const baseConfig = require('./webpack.config.base')
const deepAssign = require('deep-assign')
const path = require('path')

module.exports = deepAssign({}, baseConfig, {
  output: {
    path: path.join(__dirname, 'build', 'app')
  }
})
