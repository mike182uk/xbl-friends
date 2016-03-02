const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = {
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/app/index.js'),
  output: {
    filename: 'bundle.js',
    publicPath: `http://localhost:${process.env.DEV_SERVER_PORT}/`,
    libraryTarget: 'commonjs2'
  },
  externals: ['electron'],
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src', 'app'),
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]',
          'postcss-loader'
        ]
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loaders: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(woff|woff2)(\?\S*)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?\S*)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?\S*)?$/,
        loader: 'file'
      },
      {
        test: /\.svg(\?\S*)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/app/index.html')
    })
  ],
  postcss: [
    require('autoprefixer'),
    require('postcss-cssnext')
  ]
};

if (process.env.NO_XBL) {
  config.resolve = {
    alias: {
      xbl: path.resolve(__dirname, 'src/app/xbl-dev.js')
    }
  }

  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(/^.+\/xbl$/, 'xbl')
  );
}

module.exports = config;
