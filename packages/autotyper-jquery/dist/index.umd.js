(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("autotyper"), require("jquery")) : typeof define === "function" && define.amd ? define([ "exports", "autotyper", "jquery" ], factory) : (global = global || self, 
  factory(global.autotyperJquery = {}, global.autotyper, global.jQuery));
})(this, (function(exports, autotyper, jQuery) {
  "use strict";
  var autotyper__default = "default" in autotyper ? autotyper["default"] : autotyper;
  jQuery = jQuery && jQuery.hasOwnProperty("default") ? jQuery["default"] : jQuery;
  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }
    return _typeof(obj);
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
  var DESTROY = autotyper.EVENTS.DESTROY;
  var EVENT_NAMES = Object.keys(autotyper.EVENTS).map((function(name) {
    return autotyper.EVENTS[name];
  }));
  var jAutotyper = Object.create(autotyper__default);
  jQuery.extend(jAutotyper, {
    parseArguments: function parseArguments(args) {
      if (args.length === 0) {
        return args;
      }
      var _args = _slicedToArray(args, 2), firstArg = _args[0], secondArg = _args[1];
      if (firstArg instanceof jQuery) {
        return [ firstArg[0], secondArg ];
      }
      return [ null, firstArg ];
    }
  });
  jQuery.fn.autotyper = function plugin() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var arg = args[0], functionArgs = args.slice(1);
    if (this.length === 0) {
      return this;
    }
    if (typeof arg === "string") {
      var functionName = arg;
      this.each((function callFunction() {
        var $this = jQuery(this);
        var instance = $this.data(autotyper.NAME);
        if (_typeof(instance) === "object" && typeof instance[functionName] === "function") {
          instance[functionName](functionArgs);
        }
      }));
      return this;
    }
    var options = arg;
    this.each((function init() {
      var $this = jQuery(this);
      var instance = Object.create(jAutotyper);
      $this.data(autotyper.NAME, instance);
      EVENT_NAMES.forEach((function(event) {
        instance.on(event, (function() {
          for (var _len2 = arguments.length, eventArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            eventArgs[_key2] = arguments[_key2];
          }
          $this.trigger.apply($this, [ "".concat(autotyper.NAME, ".").concat(event) ].concat(eventArgs));
          if (event === DESTROY) {
            $this.off(autotyper.NAME);
            jQuery.removeData($this[0], autotyper.NAME);
          }
        }));
      }));
      instance.init($this, options);
    }));
    return this;
  };
  jQuery.autotyper = function() {
    var _Object$create;
    return (_Object$create = Object.create(jAutotyper)).init.apply(_Object$create, arguments);
  };
  jQuery.extend(jQuery.autotyper, {
    DEFAULTS: autotyper.DEFAULTS,
    EVENTS: autotyper.EVENTS,
    NAME: autotyper.NAME,
    VERSION: autotyper.VERSION
  });
  exports.default = jAutotyper;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
}));
