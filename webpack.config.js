const fs = require('fs');
const path = require('path');

const WebpackHtmlPlugin = require('html-webpack-plugin');
const titleCase = require('title-case').titleCase;

const packagesDir = path.join(process.cwd(), 'packages');
const packageNames = fs.readdirSync(packagesDir);

const name = (() => {
  const dirs = process.cwd().split('/');

  return dirs[dirs.length - 1];
})();

const entry = packageNames.reduce(
  (acc, packageName) => ({
    ...acc,
    [packageName]: path.join(
      process.cwd(),
      `packages/${packageName}/src/index.js`,
    ),
  }),
  {},
);

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
        test: /.js$/,
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
      template: path.join(process.cwd(), 'index.html'),
      inject: false,
      packageNames,
    }),
  ],

  devtool: 'source-map',

  performance: {
    hints: false,
  },
};
