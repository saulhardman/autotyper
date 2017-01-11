import autotyper, {
  NAME,
  DEFAULTS,
  EVENTS,
  VERSION,
} from 'autotyper';
import jQuery from 'jquery';

const { DESTROY } = EVENTS;

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

      Object.keys(EVENTS).map(name => EVENTS[name]).forEach((event) => {
        instance.on(event, (...eventArgs) => {
          $this.trigger(`${NAME}:${event}`, ...eventArgs);
        });
      });

      instance.on(DESTROY, () => {
        instance.off(DESTROY);

        $this.off(NAME);
      });

      instance.init(this, options);
    });
  } else if (typeof arg === 'string') {
    const functionName = arg;

    this.each(function callFunction() {
      const $this = jQuery(this);
      const instance = $this.data(NAME);

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

jQuery.autotyper = autotyper;

jQuery.extend(jQuery.autotyper, {
  NAME,
  DEFAULTS,
  EVENTS,
  VERSION,
});

if (process.env.NODE_ENV === 'development') {
  window.$ = jQuery;
}

export default autotyper;
