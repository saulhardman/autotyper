import autotyper, { NAME, EVENTS } from 'autotyper';
import jQuery from 'jquery';

jQuery.fn.autotyper = function plugin(...args) {
  const [arg, ...functionArgs] = args;

  if (this.length === 0) {
    return this;
  }

  if (typeof arg === 'undefined' || typeof arg === 'object') {
    const options = arg;

    this.each(function init() {
      const $this = jQuery(this);
      const instance = Object.create(autotyper);

      $this.data(NAME, instance);

      EVENTS.forEach((event) => {
        instance.on(event, (...eventArgs) => {
          $this.trigger(`${NAME}:${event}`, ...eventArgs);
        });
      });

      instance.init(this, options);
    });
  } else if (typeof arg === 'string') {
    const functionName = arg;

    this.each(function callFunction() {
      const instance = jQuery(this).data(NAME);

      if (typeof instance === 'object' && typeof instance[functionName] === 'function') {
        instance[functionName](functionArgs);

        if (functionName === autotyper.destroy.name) {
          jQuery.removeData(this, NAME);
        }
      }
    });
  }

  return this;
};

if (process.env.NODE_ENV === 'development') {
  window.$ = jQuery;
}

export default autotyper;
