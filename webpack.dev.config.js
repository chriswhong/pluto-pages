const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    'babel-polyfill',
    './main.jsx',
  ],
  output: {
    path: path.join(__dirname, './public'),
    filename: 'js/bundle.js',
    publicPath: '/',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
      path.join(__dirname, 'node_modules'),
    ],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              emitWarning: true,
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'react-hot-loader',
          },
          {
            loader: 'babel-loader',
            query: {
              presets: ['babel-preset-react', 'babel-preset-es2015', 'babel-preset-stage-0'].map(require.resolve),
              plugins: ['babel-plugin-es6-promise'].map(require.resolve),
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
    }),
    new Dotenv(),
  ],
};
