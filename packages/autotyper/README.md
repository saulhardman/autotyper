# autotyper

> ⌨️ A simple, lightweight JavaScript package for automatically typing text.

[![npm version](https://img.shields.io/npm/v/autotyper.svg)](https://www.npmjs.com/package/autotyper) [![Build Status: Linux](https://travis-ci.org/saulhardman/autotyper.svg?branch=master)](https://travis-ci.org/saulhardman/autotyper) [![Build status: Windows](https://ci.appveyor.com/api/projects/status/s0dcjgnkfe1pikos?svg=true)](https://ci.appveyor.com/project/saulhardman/autotyper) [![Coverage Status](https://coveralls.io/repos/github/saulhardman/autotyper/badge.svg?branch=master)](https://coveralls.io/github/saulhardman/autotyper?branch=master) [![npm downloads](https://img.shields.io/npm/dm/autotyper.svg)](https://www.npmjs.com/package/autotyper)

![autotyper terminal example](https://raw.githubusercontent.com/saulhardman/autotyper/master/media/terminal.gif)

- ⚖ Has a file size of 2.15 kB, minified and gzipped.
- 🔎 Text can be read directly from an element (SEO friendly).
- 🔧 Can be used with or without an `HTMLElement`.
- ⚙ Provides configurable [options](#options).
- 📡 Emits [events](#events) for triggering custom functionality.
- 💵 Available as a standalone [jQuery plugin](https://github.com/saulhardman/autotyper/tree/master/packages/autotyper-jquery).

See it in action on [CodePen](https://codepen.io/collection/Drkmyk)!

## Installation

### Yarn

```
yarn add autotyper
```

### npm

```
npm install --save autotyper
```

## Usage

With an `HTMLElement`:

```js
import autotyper from 'autotyper';

const example = Object.create(autotyper);
const element = document.querySelector('.js-element');
const options = {
  text: 'Hello World.',
};

example.init(element, options);
```

Without an `HTMLElement`:

```js
import autotyper from 'autotyper';

const example = Object.create(autotyper).init({
  text: 'Look, Mom, no element!',
});

// `example.text` updates when a new character is typed

// listen for the 'type' event
example.on('type', (text) => {
  // do something with `text`
});
```

### CommonJS

```js
const autotyper = require('autotyper').default;
```

### AMD

```js
require(['autotyper'], function (autotyper) {
  // use `autotyper.default` here
});
```

## Options

```js
const defaults = {
  text: element.innerHTML || 'This is the default text.',
  interval: [200, 300],
  autoStart: true,
  loop: false,
  loopInterval: 0,
  empty: '\u00A0',
};
```

See the [API](#api) for more information.

#### Pass Options with HTML Data Attributes

Options can be passed via HTML data attributes. Either as individual properties or a single options object. The attribute names should be:

- prefixed with 'autotyper'
- in param case

The attribute values should be JSON formatted strings.

```html
<!-- Options passed as a single JSON formatted object -->
<p data-autotyper-options='{ "text": "This is the text that is typed." }'>
  This is some example text.
</p>

<!-- The `autoStart` option being passed as an individual value -->
<p data-autotyper-auto-start="2000">
  This is some different example text.
</p>
```

## Browser Support

`autotyper` is written and compiled in a way that it *should* support the majority of browsers, old and new. However, these are the browsers for which we offer **official** support. Should you find a bug in the package, don't hesitate to submit an issue and we'll assist you as best we can.

![Edge](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/39.1.1/edge/edge_32x32.png) | ![Firefox](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/39.1.1/firefox/firefox_32x32.png) | ![Chrome](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/39.1.1/chrome/chrome_32x32.png) | ![Safari](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/39.1.1/safari/safari_32x32.png) | ![Opera](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/39.1.1/opera/opera_32x32.png)
--- | --- | --- | --- | ---
Edge | Firefox | Chrome | Safari | Opera
Last 2 versions | last 2 versions | last 2 versions | last 2 versions | last 2 versions 

## Alternative Installation

If you're not using a module bundler or `npm` as your package manager then the following methods are available to you.

### Bower

```
bower install autotyper=https://unpkg.com/autotyper/dist/index.min.js
```

### Download

The latest version of the UMD build (bundled and minified) is available for download:

- [index.min.js](https://unpkg.com/autotyper/dist/index.min.js)

### CDN

All versions and formats of the module are available via [unpkg](https://unpkg.com/):

```html
<!-- Use a specific release (replace `x.x.x` with a version number) -->
<script src="https://unpkg.com/autotyper@x.x.x/dist/index.min.js"></script>
<!-- Use the latest minor or patch release (replace `x` with a version number) -->
<script src="https://unpkg.com/autotyper@x/dist/index.min.js"></script>
<!-- DANGER: Use the latest major release (could introduce breaking changes) -->
<script src="https://unpkg.com/autotyper/dist/index.min.js"></script>

<script>
  // Package available via `window.autotyper.default`
</script>
```

## API

### autotyper.init([element, ][options])

#### Arguments

[**`element`**] ***(HTMLElement)***: The element to type in.

[**`options={}`**] ***(Object)***: The options object.
  
[**`options.text=element.innerHTML|'This is the default text.'`**] ***(string)***: The text to type.

[**`options.interval=[200, 300]`**] ***(number|number[min, max]|function)***: The number of milliseconds between each keystroke or a min and max number of milliseconds to randomise between or a function that returns a number of milliseconds.

[**`options.autoStart=true`**] ***(boolean|number)***: Specify whether to `start()` automatically or the number of milliseconds to delay.

[**`options.loop=false`**] ***(boolean|number)***: Specify whether to loop or the number of times to loop.

[**`options.loopInterval=0`**] ***(number|number[min, max]|function)***: The number of milliseconds between each loop or a min and max number of milliseconds to randomise between or a function that returns a number of milliseconds.

[**`options.empty='\u00A0'`**] ***(string|boolean)***: The first character to type or a boolean specifying whether the first character should be empty.

#### Returns

***(Object)***: Returns the `autotyper` instance.

### autotyper.start()

#### Returns

***(Object)***: Returns the `autotyper` instance.

### autotyper.stop()

#### Returns

***(Object)***: Returns the `autotyper` instance.

### autotyper.destroy()

#### Returns

***(Object)***: Returns the `autotyper` instance.

### autotyper.reset()

#### Returns

***(Object)***: Returns the `autotyper` instance.

### autotyper.empty()

#### Returns

***(Object)***: Returns the `autotyper` instance.

### autotyper.fill()

#### Returns

***(Object)***: Returns the `autotyper` instance.

## Events

`autotyper` is an [event emitter](https://github.com/component/emitter). You can bind to the following events using `autotyper.on(eventName, callback)`:

### autotyper#init

### autotyper#start

### autotyper#type(text, character)

#### Arguments

**text** ***(string)***: The current text value.

**character** ***(string)***: The character that was typed.

### autotyper#loop(loopCount)

#### Arguments

**loopCount** ***(number)***: The number of times the instance has looped.

### autotyper#stop

### autotyper#destroy

## License

MIT © [Saul Hardman](http://saulhardman.com)
