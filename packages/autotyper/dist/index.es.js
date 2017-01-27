import Emitter from 'component-emitter';

var name = "autotyper";







var version = "0.14.1";

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

var DATA_ATTRIBUTES = ['text', 'interval', 'auto-start', 'loop', 'loop-interval', 'empty'];

var DEFAULTS = {
  text: 'This is the default text.',
  interval: [200, 300],
  autoStart: true,
  loop: false,
  loopInterval: 0,
  empty: '\xA0'
};

var autotyper = _extends(new Emitter(), {
  init: function init() {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _parseArguments = this.parseArguments(args),
        _parseArguments2 = slicedToArray(_parseArguments, 2),
        _parseArguments2$ = _parseArguments2[0],
        element = _parseArguments2$ === undefined ? null : _parseArguments2$,
        _parseArguments2$2 = _parseArguments2[1],
        options = _parseArguments2$2 === undefined ? {} : _parseArguments2$2;

    if (element) {
      var text = element.innerHTML.trim();
      var dataOptions = _extends(dataAttributesToObject(element, DATA_ATTRIBUTES, name), JSON.parse(element.getAttribute('data-' + name + '-options')));

      this.element = element;

      this.settings = _extends({}, DEFAULTS, text && { text: text }, dataOptions, options);

      Object.defineProperty(this, 'text', {
        set: function set$$1(value) {
          if (this.element) {
            this.element.innerHTML = value;
          }
        }
      });
    } else {
      this.settings = _extends({}, DEFAULTS, options);
    }

    this.isRunning = false;

    this.reset();

    this.emit(INIT);

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

    return this;
  },
  parseArguments: function parseArguments(args) {
    if (args.length === 0) {
      return args;
    }

    var _args = slicedToArray(args, 1),
        firstArg = _args[0];

    if (firstArg instanceof HTMLElement) {
      return args;
    }

    return [null, firstArg];
  },
  reset: function reset() {
    this.letterTotal = this.settings.text.length;
    this.letterCount = 0;

    if (this.settings.loop) {
      if (typeof this.settings.loop === 'number') {
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
    var text = void 0;
    var character = void 0;

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
      } else if (typeof this.settings.empty === 'string') {
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

    this.letterCount = 0;

    this.emit(LOOP, this.loopCount);

    return this;
  },
  empty: function empty() {
    clearTimeout(this.timeout);

    if (typeof this.settings.empty === 'string') {
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

export { DATA_ATTRIBUTES, DEFAULTS, EVENTS, name as NAME, version as VERSION };export default autotyper;
