import Emitter from "component-emitter";

const name = "autotyper";

const version = "0.15.1";

function upperCaseFirstLetter(string) {
  return `${string.substring(0, 1).toUpperCase()}${string.substring(1)}`;
}

function paramCaseToCamelCase(string) {
  return string.split("-").map((s, i) => {
    if (i === 0) {
      return s;
    }
    return upperCaseFirstLetter(s);
  }).join("");
}

function attributeName(name, namespace) {
  if (namespace) {
    return `data-${namespace}-${name}`;
  }
  return `data-${name}`;
}

function dataAttributesToObject(element, names, namespace) {
  return names.reduce((obj, name) => {
    const value = element.getAttribute(attributeName(name, namespace));
    const propertyName = paramCaseToCamelCase(name);
    if (value === null) {
      return obj;
    }
    return {
      ...obj,
      [propertyName]: JSON.parse(value)
    };
  }, {});
}

function randomNumber(min, max) {
  const minimum = Math.min(min, max);
  const maximum = Math.max(min, max);
  const multiplier = maximum - minimum + 1;
  return Math.floor(Math.random() * multiplier) + minimum;
}

function interval(interval) {
  let value;
  if (Array.isArray(interval) && interval.length === 2) {
    const [min, max] = interval;
    value = randomNumber(min, max);
  } else if (typeof interval === "function") {
    value = interval();
  } else {
    value = parseInt(interval, 10);
  }
  return value;
}

const NAME = name;

const VERSION = version;

const INIT = "init";

const START = "start";

const TYPE = "type";

const LOOP = "loop";

const STOP = "stop";

const DESTROY = "destroy";

const EVENTS = {
  INIT: INIT,
  START: START,
  TYPE: TYPE,
  LOOP: LOOP,
  STOP: STOP,
  DESTROY: DESTROY
};

const DATA_ATTRIBUTES = [ "text", "interval", "auto-start", "loop", "loop-interval", "empty" ];

const DEFAULTS = {
  text: "This is the default text.",
  interval: [ 200, 300 ],
  autoStart: true,
  loop: false,
  loopInterval: 0,
  empty: " "
};

var autotyper = Emitter({
  init(...args) {
    const [element = null, options = {}] = this.parseArguments(args);
    if (element) {
      const text = element.innerHTML.trim();
      const dataOptions = {
        ...dataAttributesToObject(element, DATA_ATTRIBUTES, NAME),
        ...JSON.parse(element.getAttribute(`data-${NAME}-options`))
      };
      this.element = element;
      this.settings = {
        ...DEFAULTS,
        ...text ? {
          text: text
        } : {},
        ...dataOptions,
        ...options
      };
      Object.defineProperty(this, "text", {
        set(value) {
          if (this.element) {
            this.element.innerHTML = value;
          }
        },
        get() {
          return this.text;
        }
      });
    } else {
      this.settings = {
        ...DEFAULTS,
        ...options
      };
    }
    this.isRunning = false;
    this.reset();
    this.emit(INIT);
    if (this.settings.autoStart === true) {
      this.start();
    } else {
      const delay = parseInt(this.settings.autoStart, 10);
      if (!isNaN(delay)) {
        setTimeout(() => this.start(), delay);
      }
    }
    return this;
  },
  parseArguments(args) {
    if (args.length === 0) {
      return args;
    }
    const [firstArg] = args;
    if (firstArg instanceof HTMLElement) {
      return args;
    }
    return [ null, firstArg ];
  },
  reset() {
    this.letterTotal = this.settings.text.length;
    this.letterCount = 0;
    if (this.settings.loop) {
      if (typeof this.settings.loop === "number") {
        this.loopTotal = this.settings.loop;
      }
      this.loopCount = 0;
    }
    return this;
  },
  start() {
    if (this.isRunning) {
      return this;
    }
    clearTimeout(this.timeout);
    this.isRunning = true;
    this.emit(START);
    this.type();
    return this;
  },
  type() {
    let text;
    let character;
    this.tick(interval(this.settings.interval));
    if (this.letterCount > this.letterTotal) {
      if (this.settings.loop) {
        return this.loop();
      }
      return this.stop();
    }
    if (this.letterCount === 0) {
      if (this.settings.empty === false) {
        this.letterCount += 1;
        text = this.settings.text.substring(0, this.letterCount);
        character = this.settings.text.substring(this.letterCount - 1, this.letterCount);
      } else if (typeof this.settings.empty === "string") {
        text = this.settings.empty;
        character = this.settings.empty;
      }
    } else {
      text = this.settings.text.substring(0, this.letterCount);
      character = this.settings.text.substring(this.letterCount - 1, this.letterCount);
    }
    this.text = text;
    this.emit(TYPE, text, character);
    this.letterCount += 1;
    return this;
  },
  stop() {
    if (!this.isRunning) {
      return this;
    }
    clearTimeout(this.timeout);
    this.isRunning = false;
    this.emit(STOP);
    return this;
  },
  destroy() {
    if (this.isRunning) {
      this.stop();
    }
    this.emit(DESTROY);
    this.off();
    this.element = null;
  },
  tick(duration) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.type(), duration);
    return this;
  },
  loop() {
    this.tick(interval(this.settings.loopInterval));
    if (this.loopCount === this.loopTotal) {
      return this.stop();
    }
    this.loopCount += 1;
    this.letterCount = 0;
    this.emit(LOOP, this.loopCount);
    return this;
  },
  empty() {
    clearTimeout(this.timeout);
    if (typeof this.settings.empty === "string") {
      this.text = this.settings.empty;
    } else {
      this.text = DEFAULTS.empty;
    }
    this.letterCount = 0;
    if (this.isRunning) {
      this.tick(interval(this.settings.interval));
    }
    return this;
  },
  fill() {
    clearTimeout(this.timeout);
    this.text = this.settings.text;
    this.letterCount = this.settings.text.length;
    if (this.isRunning) {
      this.tick(interval(this.settings.interval));
    }
    return this;
  }
});

export default autotyper;

export { DATA_ATTRIBUTES, DEFAULTS, EVENTS, NAME, VERSION };
