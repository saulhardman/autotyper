/*
 *  Autotyper - v0.0.1
 *  A simple JavaScript (currently jQuery) plugin to automatically type out text.
 *  https://github.com/saulhardman/autotyper
 *
 *  Made by Saul Hardman
 *  Under MIT License
 */
(function (factory) {

    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof exports === "object") {
        factory(require("jquery"));
    } else {
        factory(jQuery);
    }

}(function ($) {

    "use strict";

    var autotyper = {
        name: "autotyper",
        defaults: {
            interval: [200, 300],
            autoStart: true,
            loop: false
        },
        init: function init(element, options) {
            var text;

            this.element = element;
            this.$element = $(element);

            text = this.$element.text();

            this.settings = $.extend({ text: text }, this.defaults, options);

            this.text = text;
            this.isRunning = false;

            if (this.settings.autoStart) {
                this.start();
            }

            this.$element.trigger("autotyper:init", this);

            return this;
        },
        start: function start() {
            if (this.isRunning) {
                return this;
            }

            clearTimeout(this.timeout);

            this.isRunning = true;

            this.setText("");

            this.letterTotal = this.settings.text.length;
            this.letterCount = 0;

            if (this.settings.loop) {
                if (typeof this.settings.loop === "number") {
                    this.loopTotal = this.settings.loop;
                }

                this.loopCount = 0;
            }

            this.tick();

            this.$element.trigger("autotyper:start", this);

            return this;
        },
        setText: function setText(text) {
            this.$element.text(text);

            return this;
        },
        type: function type() {
            this.tick();

            this.setText(this.settings.text.substring(0, this.letterCount++));

            this.$element.trigger("autotyper:type", this);

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

            this.$element.trigger("autotyper:stop", this);

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

            this.$element
                    .removeData(this.name)
                    .trigger("autotyper:destroy", this);

            this.element = this.$element = null;

            return;
        },
        tick: function tick(interval) {
            clearTimeout(this.timeout);

            this.timeout = setTimeout(this.type.bind(this), interval || this.interval());

            return this;
        },
        loop: function loop() {
            this.tick(this.settings.loopInterval);

            if (this.loopCount === this.loopTotal) {
                return this.stop();
            }

            this.loopCount++;

            this.letterTotal = this.settings.text.length;
            this.letterCount = 0;

            this.$element.trigger("autotyper:loop", this);

            return this;
        },
        interval: function interval() {
            if (Array.isArray(this.settings.interval) &&
                this.settings.interval.length === 2) {
                return this.random(this.settings.interval[0], this.settings.interval[1]);
            }

            return this.settings.interval;
        },
        random: function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        parseOptionName: function parseOptionName(name) {
            name = name.replace(this.name, "");

            return name.charAt(0).toLowerCase() + name.slice(1);
        }
    };

    // Object.create support test, and fallback for browsers without it
    // Source: https://github.com/jquery-boilerplate/jquery-patterns/blob/master/patterns/jquery.prototypal-inheritance.plugin-boilerplate.js
    if (typeof Object.create !== "function") {
        Object.create = function (o) {
            function F () {}
            F.prototype = o;
            return new F();
        };
    }

    $.fn.autotyper = function (options) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data(),
                method,
                i;

            if (typeof options === "undefined") {
                options = {};
            } else if (typeof options === "string") {
                method = options;

                if (data.hasOwnProperty("autotyper")) {
                    return data.autotyper[method].apply(data.autotyper, [].slice.call(arguments, 1));
                }

                throw new Error("An autotyper instance must be instantiated on an element before methods can be called.");
            }

            for (i in data) {
                if (data.hasOwnProperty(i) && i.indexOf(autotyper.name) > -1) {
                    if (i === autotyper.name + "Options") {
                        options = $.extend(data[i], options);
                    } else {
                        options[autotyper.parseOptionName(i)] = data[i];
                    }
                }
            }

            $this.data(autotyper.name, Object.create(autotyper).init(this, options));
        });
    };

    return autotyper;

}));
