import Emitter from 'component-emitter';

import { name as packageName, version } from '../package.json';
import { parseOptionNameFromAttributeName, random } from './utils';

const DEFAULT_OPTIONS = {
  interval: [200, 300],
  autoStart: true,
  loop: false,
};
const NONE_BREAKING_SPACE = '\u00A0';

const autotyper = {
  version,
  init(element, options = {}) {
    const text = element.innerHTML;
    const { dataset } = element;
    const attributeOptions = Object.keys(dataset).reduce((obj, key) => {
      if (key === 'autotyper') {
        const value = JSON.parse(dataset[key]);

        return Object.assign(obj, value);
      } else if (key.indexOf(packageName) !== -1) {
        const name = parseOptionNameFromAttributeName(key, packageName);
        const value = JSON.parse(dataset[key]);

        return { ...obj, [name]: value };
      }

      return obj;
    }, {});

    this.element = element;
    this.settings = Object.assign({ text }, DEFAULT_OPTIONS, attributeOptions, options);
    this.text = text;
    this.isRunning = false;

    if (this.settings.autoStart === true) {
      this.start();
    }

    this.emit('init');

    return this;
  },
  start() {
    if (this.isRunning) {
      return this;
    }

    clearTimeout(this.timeout);

    this.isRunning = true;

    this.setText(NONE_BREAKING_SPACE);

    this.letterTotal = this.settings.text.length;
    this.letterCount = 0;

    if (this.settings.loop) {
      if (typeof this.settings.loop === 'number') {
        this.loopTotal = this.settings.loop;
      }

      this.loopCount = 0;
    }

    this.tick();

    this.emit('start');

    return this;
  },
  setText(text) {
    this.element.innerHTML = text;

    return this;
  },
  type() {
    this.tick();

    this.setText(this.settings.text.substring(0, this.letterCount += 1));

    this.emit('type');

    if (this.letterCount > this.letterTotal) {
      if (this.settings.loop) {
        return this.loop();
      }

      return this.stop();
    }

    return this;
  },
  stop() {
    if (!this.isRunning) {
      return this;
    }

    clearTimeout(this.timeout);

    this.isRunning = false;

    this.emit('stop');

    return this;
  },
  reset() {
    this.setText(this.text);

    return this;
  },
  destroy() {
    if (this.isRunning) {
      this.stop();
    }

    this.emit('destroy');

    this.element = null;
  },
  tick(interval = this.interval()) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => this.type(), interval);

    return this;
  },
  loop() {
    this.tick(this.settings.loopInterval);

    if (this.loopCount === this.loopTotal) {
      return this.stop();
    }

    this.loopCount += 1;

    this.letterTotal = this.settings.text.length;
    this.letterCount = 0;

    this.emit('loop');

    return this;
  },
  interval() {
    if (Array.isArray(this.settings.interval)) {
      if (this.settings.interval.length === 2) {
        const [min, max] = this.settings.interval;

        return random(min, max);
      }

      // throw new Error('Error: `interval` must be either an array containing 2 Numbers or a Number.');
    }

    return this.settings.interval;
  },
};

Emitter(autotyper);

export default autotyper;
