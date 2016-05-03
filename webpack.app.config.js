const commonConfig = require('./webpack.app.common.config')
const deepAssign = require('deep-assign')
const path = require('path')

const config = deepAssign({}, commonConfig, {
  output: {
    path: path.join(__dirname, 'build', 'app')
  }
})

module.exports = config
