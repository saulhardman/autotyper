import camelCase from 'camel-case';
import Emitter from 'component-emitter';

var name = "autotyper";







var version = "0.3.1";

function random(min, max) {
  return Math.floor(Math.random() * (max - (min + 1))) + min;
}

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULTS = {
  interval: [200, 300],
  autoStart: true,
  loop: false
};

var autotyper = {
  version: version,
  init: function init(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var text = element.innerHTML;
    var dataset = element.dataset;

    var attrOptions = Object.keys(dataset).reduce(function (obj, key) {
      if (key.indexOf(name) !== -1) {
        var attr = camelCase(key.substring(name.length));

        return _extends({}, obj, _defineProperty({}, attr, JSON.parse(dataset[key])));
      }

      return obj;
    }, {});

    this.element = element;
    this.settings = Object.assign({ text: text }, DEFAULTS, attrOptions, options);
    this.text = text;
    this.isRunning = false;

    if (this.settings.autoStart === true) {
      this.start();
    }

    this.emit('init');

    return this;
  },
  start: function start() {
    if (this.isRunning) {
      return this;
    }

    clearTimeout(this.timeout);

    this.isRunning = true;

    this.setText('');

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
  setText: function setText(text) {
    this.element.innerHTML = text;

    return this;
  },
  type: function type() {
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
  stop: function stop() {
    if (!this.isRunning) {
      return this;
    }

    clearTimeout(this.timeout);

    this.isRunning = false;

    this.emit('stop');

    return this;
  },
  reset: function reset() {
    this.setText(this.text);

    return this;
  },
  destroy: function destroy() {
    if (this.isRunning) {
      this.stop();
    }

    this.emit('destroy');

    this.element = null;
  },
  tick: function tick() {
    var _this = this;

    var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.interval();

    clearTimeout(this.timeout);

    this.timeout = setTimeout(function () {
      return _this.type();
    }, interval);

    return this;
  },
  loop: function loop() {
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
  interval: function interval() {
    if (Array.isArray(this.settings.interval)) {
      if (this.settings.interval.length === 2) {
        var _settings$interval = _slicedToArray(this.settings.interval, 2),
            min = _settings$interval[0],
            max = _settings$interval[1];

        return random(min, max);
      }

      // throw new Error('Error: `interval` must be either an array containing 2 Numbers or a Number.');
    }

    return this.settings.interval;
  }
};

Emitter(autotyper);

export default autotyper;
