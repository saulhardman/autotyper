import autotyper, { DEFAULTS, EVENTS, NAME, VERSION } from 'autotyper';
import jQuery from 'jquery';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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

var DESTROY = EVENTS.DESTROY;

var EVENT_NAMES = Object.keys(EVENTS).map(function (name) {
  return EVENTS[name];
});

var jAutotyper = Object.create(autotyper);

_extends(jAutotyper, {
  parseArguments: function parseArguments(args) {
    var _args = slicedToArray(args, 2),
        firstArg = _args[0],
        secondArg = _args[1];

    if (args.length === 0) {
      return args;
    }

    if (firstArg instanceof jQuery) {
      return [firstArg[0], secondArg];
    }

    return [null, secondArg];
  }
});

jQuery.fn.autotyper = function plugin() {
  var _this = this;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var arg = args[0],
      functionArgs = args.slice(1);


  if (this.length === 0) {
    return this;
  }

  if (typeof arg === 'string') {
    var _ret = function () {
      var functionName = arg;

      _this.each(function callFunction() {
        var $this = jQuery(this);
        var instance = $this.data(NAME);

        if ((typeof instance === 'undefined' ? 'undefined' : _typeof(instance)) === 'object' && typeof instance[functionName] === 'function') {
          instance[functionName](functionArgs);
        }
      });

      return {
        v: _this
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  var options = arg;

  this.each(function init() {
    var $this = jQuery(this);
    var instance = Object.create(jAutotyper);

    $this.data(NAME, instance);

    EVENT_NAMES.forEach(function (event) {
      instance.on(event, function () {
        for (var _len2 = arguments.length, eventArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          eventArgs[_key2] = arguments[_key2];
        }

        $this.trigger.apply($this, [NAME + '.' + event].concat(eventArgs));

        if (event === DESTROY) {
          $this.off(NAME);

          jQuery.removeData($this[0], NAME);
        }
      });
    });

    instance.init($this, options);
  });

  return this;
};

jQuery.autotyper = function (options) {
  return Object.create(jAutotyper).init(options);
};

jQuery.extend(jQuery.autotyper, {
  DEFAULTS: DEFAULTS,
  EVENTS: EVENTS,
  VERSION: VERSION,
  NAME: NAME
});

export default autotyper;
