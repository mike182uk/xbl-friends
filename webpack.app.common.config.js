const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const config = {
  entry: path.resolve(__dirname, 'src/app/index.js'),
  output: {
    filename: 'bundle.js',
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
    require('postcss-cssnext')
  ]
}

module.exports = config
