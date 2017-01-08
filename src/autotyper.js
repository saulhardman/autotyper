import Emitter from 'component-emitter';

import { name as packageName, version } from '../package.json';
import dataAttributesToObject from './data-attributes-to-object';
import interval from './interval';

const INIT_EVENT = 'init';
const START_EVENT = 'start';
const TYPE_EVENT = 'type';
const LOOP_EVENT = 'loop';
const STOP_EVENT = 'stop';
const DESTROY_EVENT = 'destroy';

export const EVENTS = [
  INIT_EVENT,
  START_EVENT,
  TYPE_EVENT,
  LOOP_EVENT,
  STOP_EVENT,
  DESTROY_EVENT,
];

const ATTRIBUTE_OPTION_NAMES = [
  'text',
  'interval',
  'auto-start',
  'loop',
  'loop-interval',
  'empty-text',
];

export const DEFAULT_OPTIONS = {
  text: 'This is the default text.',
  interval: [200, 300],
  autoStart: true,
  loop: false,
  emptyText: '\u00A0',
};

const autotyper = {
  version,
  init(...args) {
    let element;
    let options;

    if (args[0] instanceof window.HTMLElement) {
      [element, options = {}] = args;
    } else {
      [options = {}] = args;
    }

    if (element) {
      const text = element.innerHTML.trim() || DEFAULT_OPTIONS.text;
      const attributeOptions = Object.assign(
        dataAttributesToObject(element, ATTRIBUTE_OPTION_NAMES, packageName),
        JSON.parse(element.getAttribute(`data-${packageName}`))
      );

      this.element = element;
      this.settings = Object.assign({}, DEFAULT_OPTIONS, { text }, attributeOptions, options);
      this.originalText = text;
    } else {
      this.element = element;
      this.settings = Object.assign({}, DEFAULT_OPTIONS, options);
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

    this.emit(INIT_EVENT);

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

    this.emit(START_EVENT);

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

    this.emit(TYPE_EVENT, text);

    this.letterCount += 1;

    return this;
  },
  stop() {
    if (!this.isRunning) {
      return this;
    }

    clearTimeout(this.timeout);

    this.isRunning = false;

    this.emit(STOP_EVENT);

    return this;
  },
  reset() {
    this.setText(this.originalText);

    return this;
  },
  destroy() {
    if (this.isRunning) {
      this.stop();
    }

    this.emit(DESTROY_EVENT);

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

    this.emit(LOOP_EVENT, this.loopCount);

    return this;
  },
};

Emitter(autotyper);

export default autotyper;
