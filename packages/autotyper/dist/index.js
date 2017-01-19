"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var Emitter = _interopDefault(require("component-emitter"));

var name = "autotyper";

var version = "0.13.3";

function upperCaseFirstLetter(string) {
  return "" + string.substring(0, 1).toUpperCase() + string.substring(1);
}

function paramCaseToCamelCase(string) {
  return string.split("-").map(function(s, i) {
    if (i === 0) {
      return s;
    }
    return upperCaseFirstLetter(s);
  }).join("");
}

var defineProperty = function(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
};

var _extends = Object.assign || function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

var slicedToArray = function() {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  return function(arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

function attributeName(name, namespace) {
  if (namespace) {
    return "data-" + namespace + "-" + name;
  }
  return "data-" + name;
}

function dataAttributesToObject(element, names, namespace) {
  return names.reduce(function(obj, name) {
    var value = element.getAttribute(attributeName(name, namespace));
    var propertyName = paramCaseToCamelCase(name);
    if (value === null) {
      return obj;
    }
    return _extends({}, obj, defineProperty({}, propertyName, JSON.parse(value)));
  }, {});
}

function randomNumber(min, max) {
  var minimum = Math.min(min, max);
  var maximum = Math.max(min, max);
  var multiplier = maximum - minimum + 1;
  return Math.floor(Math.random() * multiplier) + minimum;
}

var interval = function(interval) {
  var value = void 0;
  if (Array.isArray(interval) && interval.length === 2) {
    var _interval = slicedToArray(interval, 2), min = _interval[0], max = _interval[1];
    value = randomNumber(min, max);
  } else if (typeof interval === "function") {
    value = interval();
  } else {
    value = parseInt(interval, 10);
  }
  return value;
};

var INIT = "init";

var START = "start";

var TYPE = "type";

var LOOP = "loop";

var STOP = "stop";

var DESTROY = "destroy";

var EVENTS = {
  INIT: INIT,
  START: START,
  TYPE: TYPE,
  LOOP: LOOP,
  STOP: STOP,
  DESTROY: DESTROY
};

var DATA_ATTRIBUTES = [ "text", "interval", "auto-start", "loop", "loop-interval", "empty-text" ];

var DEFAULTS = {
  text: "This is the default text.",
  interval: [ 200, 300 ],
  autoStart: true,
  loop: false,
  emptyText: " "
};

var autotyper = {
  init: function init() {
    var _this = this;
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var _parseArguments = this.parseArguments(args), _parseArguments2 = slicedToArray(_parseArguments, 2), _parseArguments2$ = _parseArguments2[0], element = _parseArguments2$ === undefined ? null : _parseArguments2$, _parseArguments2$2 = _parseArguments2[1], options = _parseArguments2$2 === undefined ? {} : _parseArguments2$2;
    if (element) {
      var text = element.innerHTML.trim();
      var dataOptions = _extends(dataAttributesToObject(element, DATA_ATTRIBUTES, name), JSON.parse(element.getAttribute("data-" + name + "-options")));
      this.element = element;
      this.settings = _extends({}, DEFAULTS, text && {
        text: text
      }, dataOptions, options);
      this.originalText = text;
    } else {
      this.settings = _extends({}, DEFAULTS, options);
      this.originalText = this.settings.text;
    }
    this.settings.loopInterval = this.settings.loopInterval || this.settings.interval;
    this.isRunning = false;
    this.emit(INIT);
    if (this.settings.autoStart === true) {
      this.start();
    } else {
      var delay = parseInt(this.settings.autoStart, 10);
      if (!isNaN(delay)) {
        setTimeout(function() {
          return _this.start();
        }, delay);
      }
    }
    return this;
  },
  parseArguments: function parseArguments(args) {
    if (args.length === 0) {
      return args;
    }
    var _args = slicedToArray(args, 1), firstArg = _args[0];
    if (firstArg instanceof HTMLElement) {
      return args;
    }
    return [ null, firstArg ];
  },
  start: function start() {
    if (this.isRunning) {
      return this;
    }
    clearTimeout(this.timeout);
    this.isRunning = true;
    this.letterTotal = this.settings.text.length;
    this.letterCount = 0;
    if (this.settings.loop) {
      if (typeof this.settings.loop === "number") {
        this.loopTotal = this.settings.loop;
      }
      this.loopCount = 0;
    }
    this.emit(START);
    this.type();
    return this;
  },
  setText: function setText(text) {
    this.text = text;
    if (this.element) {
      this.element.innerHTML = text;
    }
    return this;
  },
  type: function type() {
    var text = void 0;
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
  stop: function stop() {
    if (!this.isRunning) {
      return this;
    }
    clearTimeout(this.timeout);
    this.isRunning = false;
    this.emit(STOP);
    return this;
  },
  resetText: function resetText() {
    this.setText(this.originalText);
    return this;
  },
  destroy: function destroy() {
    if (this.isRunning) {
      this.stop();
    }
    this.emit(DESTROY);
    this.off();
    this.element = null;
  },
  tick: function tick(duration) {
    var _this2 = this;
    clearTimeout(this.timeout);
    if (duration === 0) {
      return this.type();
    }
    this.timeout = setTimeout(function() {
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
    this.emit(LOOP, this.loopCount);
    return this;
  }
};

Emitter(autotyper);

exports["default"] = autotyper;

exports.DATA_ATTRIBUTES = DATA_ATTRIBUTES;

exports.DEFAULTS = DEFAULTS;

exports.EVENTS = EVENTS;

exports.NAME = name;

exports.VERSION = version;
