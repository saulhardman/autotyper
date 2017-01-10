import autotyper, { EVENTS, NAME } from 'autotyper';
import jQuery from 'jquery';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

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

  if (typeof arg === 'undefined' || (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object') {
    (function () {
      var options = arg;

      _this.each(function init() {
        var $this = jQuery(this);
        var instance = Object.create(autotyper);

        $this.data(NAME, instance);

        EVENTS.forEach(function (event) {
          instance.on(event, function () {
            for (var _len2 = arguments.length, eventArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              eventArgs[_key2] = arguments[_key2];
            }

            $this.trigger.apply($this, [NAME + ':' + event].concat(eventArgs));
          });
        });

        instance.init(this, options);
      });
    })();
  } else if (typeof arg === 'string') {
    (function () {
      var functionName = arg;

      _this.each(function callFunction() {
        var instance = jQuery(this).data(NAME);

        if ((typeof instance === 'undefined' ? 'undefined' : _typeof(instance)) === 'object' && typeof instance[functionName] === 'function') {
          instance[functionName](functionArgs);

          if (functionName === autotyper.destroy.name) {
            jQuery.removeData(this, NAME);
          }
        }
      });
    })();
  }

  return this;
};

export default autotyper;
