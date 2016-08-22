var webpack = require('webpack')

module.exports = {
  entry: [
    'webpack/hot/only-dev-server',
    './main.jsx'
  ],
  output: {
    path: 'js',
    filename: 'bundle.js',
    publicPath: '/js/'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loaders: ['react-hot', 'babel?presets[]=es2015&presets[]=react']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"development"'
      }
    })
  ]
};
