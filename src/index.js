import autotyper from './autotyper';

export { autotyper as default };

if (ENV === 'development') {
  module.exports = autotyper;
}
