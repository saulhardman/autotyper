export { default } from './autotyper';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./autotyper').default; // eslint-disable-line global-require
}
