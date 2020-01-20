import babelRegister from '@babel/register';

babelRegister({
  babelrc: false,
  ignore: ['node_modules/*', 'test/helpers/*'],
  presets: ['@babel/preset-env'],
});
