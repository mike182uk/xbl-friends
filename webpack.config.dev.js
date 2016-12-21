const commonConfig = require('./webpack.config.common')
const deepAssign = require('deep-assign')

module.exports = deepAssign({}, commonConfig, {
  devtool: 'source-map',
  output: {
    publicPath: `http://localhost:${process.env.DEV_SERVER_PORT}/`
  }
})
