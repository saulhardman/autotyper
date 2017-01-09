const webpack = require('webpack');
const WebpackHtmlPlugin = require('html-webpack-plugin');
const titleCase = require('title-case');

const { name } = require('./package.json');

module.exports = {
  entry: {
    [name]: './src/index.js',
  },
  output: {
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /.js/,
        include: /src/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('development'),
    }),
    new WebpackHtmlPlugin({
      name,
      title: titleCase(name),
      template: 'index.html',
      inject: false,
    }),
  ],
  devtool: 'source-map',
  performance: {
    hints: false,
  },
};
