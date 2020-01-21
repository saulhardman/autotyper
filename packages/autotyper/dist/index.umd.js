(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("component-emitter")) : typeof define === "function" && define.amd ? define([ "exports", "component-emitter" ], factory) : (global = global || self, 
  factory(global.autotyper = {}, global.Emitter));
})(this, (function(exports, Emitter) {
  "use strict";
  Emitter = Emitter && Emitter.hasOwnProperty("default") ? Emitter["default"] : Emitter;
  function _defineProperty(obj, key, value) {
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
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter((function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      }));
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach((function(key) {
          _defineProperty(target, key, source[key]);
        }));
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach((function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        }));
      }
    }
    return target;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }
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
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
  const name = "autotyper";
  const version = "0.15.1";
  function upperCaseFirstLetter(string) {
    return "".concat(string.substring(0, 1).toUpperCase()).concat(string.substring(1));
  }
  function paramCaseToCamelCase(string) {
    return string.split("-").map((function(s, i) {
      if (i === 0) {
        return s;
      }
      return upperCaseFirstLetter(s);
    })).join("");
  }
  function attributeName(name, namespace) {
    if (namespace) {
      return "data-".concat(namespace, "-").concat(name);
    }
    return "data-".concat(name);
  }
  function dataAttributesToObject(element, names, namespace) {
    return names.reduce((function(obj, name) {
      var value = element.getAttribute(attributeName(name, namespace));
      var propertyName = paramCaseToCamelCase(name);
      if (value === null) {
        return obj;
      }
      return _objectSpread2({}, obj, _defineProperty({}, propertyName, JSON.parse(value)));
    }), {});
  }
  function randomNumber(min, max) {
    var minimum = Math.min(min, max);
    var maximum = Math.max(min, max);
    var multiplier = maximum - minimum + 1;
    return Math.floor(Math.random() * multiplier) + minimum;
  }
  function interval(interval) {
    var value;
    if (Array.isArray(interval) && interval.length === 2) {
      var _interval = _slicedToArray(interval, 2), min = _interval[0], max = _interval[1];
      value = randomNumber(min, max);
    } else if (typeof interval === "function") {
      value = interval();
    } else {
      value = parseInt(interval, 10);
    }
    return value;
  }
  var NAME = name;
  var VERSION = version;
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
  var DATA_ATTRIBUTES = [ "text", "interval", "auto-start", "loop", "loop-interval", "empty" ];
  var DEFAULTS = {
    text: "This is the default text.",
    interval: [ 200, 300 ],
    autoStart: true,
    loop: false,
    loopInterval: 0,
    empty: " "
  };
  var autotyper = Emitter({
    init: function init() {
      var _this = this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var _this$parseArguments = this.parseArguments(args), _this$parseArguments2 = _slicedToArray(_this$parseArguments, 2), _this$parseArguments3 = _this$parseArguments2[0], element = _this$parseArguments3 === void 0 ? null : _this$parseArguments3, _this$parseArguments4 = _this$parseArguments2[1], options = _this$parseArguments4 === void 0 ? {} : _this$parseArguments4;
      if (element) {
        var text = element.innerHTML.trim();
        var dataOptions = _objectSpread2({}, dataAttributesToObject(element, DATA_ATTRIBUTES, NAME), {}, JSON.parse(element.getAttribute("data-".concat(NAME, "-options"))));
        this.element = element;
        this.settings = _objectSpread2({}, DEFAULTS, {}, text ? {
          text: text
        } : {}, {}, dataOptions, {}, options);
        Object.defineProperty(this, "text", {
          set: function set(value) {
            if (this.element) {
              this.element.innerHTML = value;
            }
          },
          get: function get() {
            return this.text;
          }
        });
      } else {
        this.settings = _objectSpread2({}, DEFAULTS, {}, options);
      }
      this.isRunning = false;
      this.reset();
      this.emit(INIT);
      if (this.settings.autoStart === true) {
        this.start();
      } else {
        var delay = parseInt(this.settings.autoStart, 10);
        if (!isNaN(delay)) {
          setTimeout((function() {
            return _this.start();
          }), delay);
        }
      }
      return this;
    },
    parseArguments: function parseArguments(args) {
      if (args.length === 0) {
        return args;
      }
      var _args = _slicedToArray(args, 1), firstArg = _args[0];
      if (firstArg instanceof HTMLElement) {
        return args;
      }
      return [ null, firstArg ];
    },
    reset: function reset() {
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
    start: function start() {
      if (this.isRunning) {
        return this;
      }
      clearTimeout(this.timeout);
      this.isRunning = true;
      this.emit(START);
      this.type();
      return this;
    },
    type: function type() {
      var text;
      var character;
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
    stop: function stop() {
      if (!this.isRunning) {
        return this;
      }
      clearTimeout(this.timeout);
      this.isRunning = false;
      this.emit(STOP);
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
      this.timeout = setTimeout((function() {
        return _this2.type();
      }), duration);
      return this;
    },
    loop: function loop() {
      this.tick(interval(this.settings.loopInterval));
      if (this.loopCount === this.loopTotal) {
        return this.stop();
      }
      this.loopCount += 1;
      this.letterCount = 0;
      this.emit(LOOP, this.loopCount);
      return this;
    },
    empty: function empty() {
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
    fill: function fill() {
      clearTimeout(this.timeout);
      this.text = this.settings.text;
      this.letterCount = this.settings.text.length;
      if (this.isRunning) {
        this.tick(interval(this.settings.interval));
      }
      return this;
    }
  });
  exports.DATA_ATTRIBUTES = DATA_ATTRIBUTES;
  exports.DEFAULTS = DEFAULTS;
  exports.EVENTS = EVENTS;
  exports.NAME = NAME;
  exports.VERSION = VERSION;
  exports.default = autotyper;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
}));
