const commonConfig = require('./webpack.config.common')
const deepAssign = require('deep-assign')
const path = require('path')

module.exports = deepAssign({}, commonConfig, {
  output: {
    path: path.join(__dirname, 'build', 'app')
  }
})
