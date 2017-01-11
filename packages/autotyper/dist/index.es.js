import Emitter from 'component-emitter';

var name = "autotyper";







var version = "0.12.1";

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

var defineProperty = function (obj, key, value) {
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

var _extends = Object.assign || function (target) {
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





















var slicedToArray = function () {
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

  return function (arr, i) {
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

    return _extends({}, obj, defineProperty({}, propertyName, JSON.parse(value)));
  }, {});
}

function randomNumber(min, max) {
  // return a random number between min and max (inclusive of min and max)
  var minimum = Math.min(min, max);
  var maximum = Math.max(min, max);
  var multiplier = maximum - minimum + 1;

  return Math.floor(Math.random() * multiplier) + minimum;
}

var interval = function (interval) {
  var value = void 0;

  if (Array.isArray(interval) && interval.length === 2) {
    var _interval = slicedToArray(interval, 2),
        min = _interval[0],
        max = _interval[1];

    value = randomNumber(min, max);
  } else if (typeof interval === 'function') {
    value = interval();
  } else {
    value = parseInt(interval, 10);
  }

  return value;
};

var INIT = 'init';
var START = 'start';
var TYPE = 'type';
var LOOP = 'loop';
var STOP = 'stop';
var DESTROY = 'destroy';

var EVENTS = {
  INIT: INIT,
  START: START,
  TYPE: TYPE,
  LOOP: LOOP,
  STOP: STOP,
  DESTROY: DESTROY
};

var ATTRIBUTE_OPTION_NAMES = ['text', 'interval', 'auto-start', 'loop', 'loop-interval', 'empty-text'];

var DEFAULTS = {
  text: 'This is the default text.',
  interval: [200, 300],
  autoStart: true,
  loop: false,
  // loopInterval: DEFAULTS.interval,
  emptyText: '\xA0'
};

var autotyper = {
  init: function init() {
    var _this = this;

    var element = void 0;
    var options = void 0;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args[0] instanceof HTMLElement) {
      var _args3 = slicedToArray(args, 2);

      element = _args3[0];
      var _args3$ = _args3[1];
      options = _args3$ === undefined ? {} : _args3$;
    } else {
      var _args4 = slicedToArray(args, 1);

      var _args4$ = _args4[0];
      options = _args4$ === undefined ? {} : _args4$;
    }

    if (element) {
      var text = element.innerHTML.trim();
      var attributeOptions = _extends(dataAttributesToObject(element, ATTRIBUTE_OPTION_NAMES, name), JSON.parse(element.getAttribute('data-' + name)));

      this.element = element;
      this.settings = _extends({}, DEFAULTS, text && { text: text }, attributeOptions, options);
      this.originalText = text;
    } else {
      this.element = element;
      this.settings = _extends({}, DEFAULTS, options);
      this.originalText = this.settings.text;
    }

    this.settings.loopInterval = this.settings.loopInterval || this.settings.interval;

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

    this.emit(INIT);

    return this;
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
      if (typeof this.settings.loop === 'number') {
        this.loopTotal = this.settings.loop;
      }

      this.loopCount = 0;
    }

    this.tick(interval(this.settings.interval));

    this.emit(START);

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

    this.emit(LOOP, this.loopCount);

    return this;
  }
};

Emitter(autotyper);

export { name as NAME, DEFAULTS, EVENTS, version as VERSION };export default autotyper;
