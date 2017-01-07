(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('component-emitter')) :
	typeof define === 'function' && define.amd ? define(['component-emitter'], factory) :
	(global.autotyper = factory(global.Emitter));
}(this, (function (Emitter) { 'use strict';

Emitter = 'default' in Emitter ? Emitter['default'] : Emitter;

var name = "autotyper";







var version = "0.9.0";

function upperCaseFirstLetter(string) {
  // e.g. text => Text
  return "" + string.substring(0, 1).toUpperCase() + string.substring(1);
}

function paramCaseToCamelCase(string) {
  return string.split('-').map(function (s, i) {
    if (i === 0) {
      return s;
    }

    return upperCaseFirstLetter(s);
  }).join('');
}

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function attributeName(name, namespace) {
  if (namespace) {
    return 'data-' + namespace + '-' + name;
  }

  return 'data-' + name;
}

function dataAttributesToObject(element, names, namespace) {
  return names.reduce(function (obj, name) {
    var value = element.getAttribute(attributeName(name, namespace));
    var propertyName = paramCaseToCamelCase(name);

    if (value === null) {
      return obj;
    }

    return Object.assign({}, obj, _defineProperty({}, propertyName, JSON.parse(value)));
  }, {});
}

function randomNumber(min, max) {
  // return a random number between min and max
  return Math.floor(Math.random() * (max - (min + 1))) + min;
}

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var interval = function (interval) {
  if (Array.isArray(interval)) {
    if (interval.length === 2) {
      var _interval = _slicedToArray(interval, 2),
          min = _interval[0],
          max = _interval[1];

      return randomNumber(min, max);
    }
  }

  return interval;
};

var INIT_EVENT = 'init';
var START_EVENT = 'start';
var TYPE_EVENT = 'type';
var LOOP_EVENT = 'loop';
var STOP_EVENT = 'stop';
var DESTROY_EVENT = 'destroy';



var ATTRIBUTE_OPTION_NAMES = ['text', 'interval', 'auto-start', 'loop', 'loop-interval', 'empty-text'];

var DEFAULT_OPTIONS = {
  interval: [200, 300],
  autoStart: true,
  loop: false,
  emptyText: '\xA0'
};

var autotyper = {
  version: version,
  init: function init(element) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var text = element.innerHTML;
    var attributeOptions = Object.assign(dataAttributesToObject(element, ATTRIBUTE_OPTION_NAMES, name), JSON.parse(element.getAttribute('data-' + name)));

    this.element = element;
    this.settings = Object.assign({ text: text }, DEFAULT_OPTIONS, attributeOptions, options);
    this.originalText = text;
    this.isRunning = false;

    if (this.settings.autoStart === true) {
      this.start();
    } else {
      var delay = parseInt(this.settings.autoStart, 10);

      if (!isNaN(delay)) {
        setTimeout(function () {
          return _this.start();
        }, delay);
      }
    }

    this.emit(INIT_EVENT);

    return this;
  },
  start: function start() {
    if (this.isRunning) {
      return this;
    }

    clearTimeout(this.timeout);

    this.isRunning = true;

    this.setText(this.settings.emptyText);

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
  setText: function setText(text) {
    this.element.innerHTML = text;

    return this;
  },
  type: function type() {
    this.tick(interval(this.settings.interval));

    this.setText(this.settings.text.substring(0, this.letterCount += 1));

    this.emit(TYPE_EVENT);

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

    this.emit(STOP_EVENT);

    return this;
  },
  reset: function reset() {
    this.setText(this.originalText);

    return this;
  },
  destroy: function destroy() {
    if (this.isRunning) {
      this.stop();
    }

    this.emit(DESTROY_EVENT);

    this.off();

    this.element = null;
  },
  tick: function tick(duration) {
    var _this2 = this;

    clearTimeout(this.timeout);

    if (duration === 0) {
      return this.type();
    }

    this.timeout = setTimeout(function () {
      return _this2.type();
    }, duration);

    return this;
  },
  loop: function loop() {
    this.tick(interval(this.settings.loopInterval));

    if (this.loopCount === this.loopTotal) {
      return this.stop();
    }

    this.loopCount += 1;

    this.letterTotal = this.settings.text.length;
    this.letterCount = 0;

    this.emit(LOOP_EVENT);

    return this;
  }
};

Emitter(autotyper);

return autotyper;

})));
