const baseConfig = require('./webpack.config.base')
const deepAssign = require('deep-assign')

module.exports = deepAssign({}, baseConfig, {
  devtool: 'source-map',
  output: {
    publicPath: `http://localhost:${process.env.DEV_SERVER_PORT}/`
  }
})
