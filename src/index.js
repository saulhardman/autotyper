export { default } from './autotyper';

if (ENV === 'development') {
  module.exports = require('./autotyper').default; // eslint-disable-line global-require
}
