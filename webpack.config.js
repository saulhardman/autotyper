const fs = require('fs');
const path = require('path');
const WebpackHtmlPlugin = require('html-webpack-plugin');
const titleCase = require('title-case');

const { name } = require('./package.json');

const packagesDir = path.join(__dirname, 'packages');
const packageNames = fs.readdirSync(packagesDir);

const entry = packageNames.reduce((obj, packageName) => (
  Object.assign(obj, {
    [packageName]: path.join(__dirname, `packages/${packageName}/src/index.js`),
  })
), {});

module.exports = {
  entry,
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
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader?$!expose-loader?jQuery',
      },
    ],
  },
  plugins: [
    new WebpackHtmlPlugin({
      name,
      title: titleCase(name),
      template: path.join(__dirname, 'index.html'),
      inject: false,
      packageNames,
    }),
  ],
  devtool: 'source-map',
  performance: {
    hints: false,
  },
};
