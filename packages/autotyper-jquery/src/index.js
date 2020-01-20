import autotyper, { DEFAULTS, EVENTS, VERSION, NAME } from 'autotyper';
import jQuery from 'jquery';

const { DESTROY } = EVENTS;
const EVENT_NAMES = Object.keys(EVENTS).map(name => EVENTS[name]);

const jAutotyper = Object.create(autotyper);

jQuery.extend(jAutotyper, {
  parseArguments(args) {
    if (args.length === 0) {
      return args;
    }

    const [firstArg, secondArg] = args;

    if (firstArg instanceof jQuery) {
      return [firstArg[0], secondArg];
    }

    return [null, firstArg];
  },
});

jQuery.fn.autotyper = function plugin(...args) {
  const [arg, ...functionArgs] = args;

  if (this.length === 0) {
    return this;
  }

  if (typeof arg === 'string') {
    const functionName = arg;

    this.each(function callFunction() {
      const $this = jQuery(this);
      const instance = $this.data(NAME);

      if (
        typeof instance === 'object' &&
        typeof instance[functionName] === 'function'
      ) {
        instance[functionName](functionArgs);
      }
    });

    return this;
  }

  const options = arg;

  this.each(function init() {
    const $this = jQuery(this);
    const instance = Object.create(jAutotyper);

    $this.data(NAME, instance);

    EVENT_NAMES.forEach(event => {
      instance.on(event, (...eventArgs) => {
        $this.trigger(`${NAME}.${event}`, ...eventArgs);

        if (event === DESTROY) {
          $this.off(NAME);

          jQuery.removeData($this[0], NAME);
        }
      });
    });

    instance.init($this, options);
  });

  return this;
};

jQuery.autotyper = (...args) => Object.create(jAutotyper).init(...args);

jQuery.extend(jQuery.autotyper, {
  DEFAULTS,
  EVENTS,
  NAME,
  VERSION,
});

export default jAutotyper;
