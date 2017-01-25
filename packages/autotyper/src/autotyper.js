import Emitter from 'component-emitter';

import { name as NAME, version as VERSION } from '../package.json';
import dataAttributesToObject from './data-attributes-to-object';
import interval from './interval';

const INIT = 'init';
const START = 'start';
const TYPE = 'type';
const LOOP = 'loop';
const STOP = 'stop';
const DESTROY = 'destroy';

const EVENTS = {
  INIT,
  START,
  TYPE,
  LOOP,
  STOP,
  DESTROY,
};

const DATA_ATTRIBUTES = [
  'text',
  'interval',
  'auto-start',
  'loop',
  'loop-interval',
  'empty',
];

const DEFAULTS = {
  text: 'This is the default text.',
  interval: [200, 300],
  autoStart: true,
  loop: false,
  loopInterval: 0,
  empty: '\u00A0',
};

const autotyper = Object.assign(new Emitter(), {
  init(...args) {
    const [
      element = null,
      options = {},
    ] = this.parseArguments(args);

    if (element) {
      const text = element.innerHTML.trim();
      const dataOptions = Object.assign(
        dataAttributesToObject(element, DATA_ATTRIBUTES, NAME),
        JSON.parse(element.getAttribute(`data-${NAME}-options`)),
      );

      this.element = element;
      this.settings = Object.assign(
        {},
        DEFAULTS,
        (text && { text }),
        dataOptions,
        options,
      );
      this.originalText = text;
    } else {
      this.settings = Object.assign({}, DEFAULTS, options);
      this.originalText = this.settings.text;
    }

    this.isRunning = false;

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

    if (process.env.NODE_ENV === 'test') {
      if (firstArg instanceof window.HTMLElement) {
        return args;
      }

      return [null, firstArg];
    }

    if (firstArg instanceof HTMLElement) {
      return args;
    }

    return [null, firstArg];
  },
  start() {
    if (this.isRunning) {
      return this;
    }

    clearTimeout(this.timeout);

    this.isRunning = true;

    this.letterTotal = this.settings.text.length;
    this.letterCount = 0;

    if (this.settings.loop) {
      if (typeof this.settings.loop === 'number') {
        this.loopTotal = this.settings.loop;
      }

      this.loopCount = 0;
    }

    this.emit(START);

    this.type();

    return this;
  },
  setText(text) {
    this.text = text;

    if (this.element) {
      this.element.innerHTML = text;
    }

    return this;
  },
  type() {
    let text;

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
      } else if (typeof this.settings.empty === 'string') {
        text = this.settings.empty;
      }
    } else {
      text = this.settings.text.substring(0, this.letterCount);
    }

    this.setText(text);

    this.emit(TYPE, text);

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
  resetText() {
    this.setText(this.originalText);

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

    this.letterTotal = this.settings.text.length;
    this.letterCount = 0;

    this.emit(LOOP, this.loopCount);

    return this;
  },
});

export {
  autotyper as default,
  DATA_ATTRIBUTES,
  DEFAULTS,
  EVENTS,
  NAME,
  VERSION,
};
