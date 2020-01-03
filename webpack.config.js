const path = require('path');

const context = path.resolve(__dirname, 'src');

module.exports = {
  mode: 'production',
  context,
  entry: './index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'anycontrol',
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: context,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        include: context,
      },
    ],
  },
  externals: [],
  stats: {
    colors: true,
  },
  devtool: 'source-map',
};
