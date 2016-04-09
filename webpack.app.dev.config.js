const commonConfig = require('./webpack.app.common.config');
const deepAssign = require('deep-assign');

const config = deepAssign({}, commonConfig , {
    devtool: 'source-map',
    output: {
      publicPath: `http://localhost:${process.env.DEV_SERVER_PORT}/`
    }
});

module.exports = config;
