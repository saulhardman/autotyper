(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.autotyper = factory());
}(this, (function () { 'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index$1 = createCommonjsModule(function (module) {
/**
 * Expose `Emitter`.
 */

{
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};
});

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

index$1(autotyper);

return autotyper;

})));
