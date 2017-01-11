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

const ATTRIBUTE_OPTION_NAMES = [
  'text',
  'interval',
  'auto-start',
  'loop',
  'loop-interval',
  'empty-text',
];

const DEFAULTS = {
  text: 'This is the default text.',
  interval: [200, 300],
  autoStart: true,
  loop: false,
  // loopInterval: DEFAULTS.interval,
  emptyText: '\u00A0',
};

const autotyper = {
  init(...args) {
    let element;
    let options;

    if (process.env.NODE_ENV === 'test') {
      if (args[0] instanceof window.HTMLElement) {
        [element, options = {}] = args;
      } else {
        [options = {}] = args;
      }
    } else if (args[0] instanceof HTMLElement) {
      [element, options = {}] = args;
    } else {
      [options = {}] = args;
    }

    if (element) {
      const text = element.innerHTML.trim();
      const attributeOptions = Object.assign(
        dataAttributesToObject(element, ATTRIBUTE_OPTION_NAMES, NAME),
        JSON.parse(element.getAttribute(`data-${NAME}`)),
      );

      this.element = element;
      this.settings = Object.assign(
        {},
        DEFAULTS,
        (text && { text }),
        attributeOptions,
        options,
      );
      this.originalText = text;
    } else {
      this.element = element;
      this.settings = Object.assign({}, DEFAULTS, options);
      this.originalText = this.settings.text;
    }

    this.settings.loopInterval = this.settings.loopInterval || this.settings.interval;

    this.isRunning = false;

    if (this.settings.autoStart === true) {
      this.start();
    } else {
      const delay = parseInt(this.settings.autoStart, 10);

      if (!isNaN(delay)) {
        setTimeout(() => this.start(), delay);
      }
    }

    this.emit(INIT);

    return this;
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

    this.tick(interval(this.settings.interval));

    this.emit(START);

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
      text = this.settings.emptyText;
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

    if (duration === 0) {
      return this.type();
    }

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
};

Emitter(autotyper);

export {
  autotyper as default,
  NAME,
  DEFAULTS,
  EVENTS,
  VERSION,
};