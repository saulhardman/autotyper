# Autotyper

> A simple JavaScript plugin that automatically types out text.

[![npm](https://img.shields.io/npm/v/autotyper.svg)](https://www.npmjs.com/package/autotyper) [![Build Status: Linux](https://travis-ci.org/saulhardman/autotyper.svg?branch=master)](https://travis-ci.org/saulhardman/autotyper)

### Installation

#### Yarn

```
yarn add autotyper
```

#### NPM

```
npm install --save autotyper
```

### Usage

```js
// ES Modules
import autotyper from 'autotyper';
// CommonJS
const autotyper = require('autotyper');
// AMD
require(['autotyper'], function (autotyper) { /* use `autotyper` here */ });
// The UMD build can be used in both CommonJS and AMD environments
// It falls back to assigning autotyper to the global scope where no module system is present
// e.g. window.autotyper;

const example = Object.create(autotyper)

example.init(document.querySelector('.js-element'));
```

### Options

These are the options and their default values:

```js
{
  text: element.innerHTML, // String representing the text to be typed out, defaults to the element's `innerHTML`
  interval: [200, 300], // Number or an array of 2 Numbers to randomise between (in milliseconds)
  autoStart: true, // Boolean or Number of milliseconds to delay start by
  loop: false, // Boolean or Number of loops
  loopInterval: interval // Number or an array of 2 Numbers to randomise between (in milliseconds), defaults to `interval`
  emptyText: '\u00A0', // String to set the text to when the element is empty, defaults to the unicode literal 'no-break space' to preserve element height
}
```

#### HTML Data Attributes

Options can be passed via HTML data attributes. Either as individual properties or a single options object. The attribute names should be:

- prefixed with 'autotyper'
- in param case

The attribute values should be JSON formatted strings.

```html
<!-- Options passed as a single JSON formatted object -->
<p data-autotyper='{ "text": "This is the text that is typed." }'>
  This is some example text.
</p>

<!-- The `autoStart` option being passed as an individual value -->
<p data-autotyper-auto-start="2000">
  This is some different example text.
</p>
```

### Examples

Some examples of autotyper in action can be found on [CodePen](https://codepen.io/saulhardman/pen/vgYwmO).

### Alternative Installation

If you're not using a module bundler or npm as your package manager then the following methods are available to you.

#### Bower

```
bower install autotyper=https://unpkg.com/autotyper/index.umd.pkgd.js
```

#### Download

The latest UMD build is available for download:

- Latest version, bundled (UMD): [index.umd.pkgd.js](https://unpkg.com/autotyper/index.umd.pkgd.js)
- Latest version, bundled and minified (UMD): [index.umd.pkgd.min.js](https://unpkg.com/autotyper/index.umd.pkgd.min.js)

#### CDN

All versions and formats of the module are available via [unpkg](https://unpkg.com/).

This is an example of using the UMD format served via the CDN:

```html
<!-- Use a specific release (replace `x.x.x` with a version number) -->
<script src="https://unpkg.com/autotyper@x.x.x/index.umd.pkgd.min.js"></script>
<!-- Use the latest minor or patch release (stay up to date safely) -->
<script src="https://unpkg.com/autotyper@0/index.umd.pkgd.min.js"></script>
<!-- DANGER: Use the latest major release (could introduce breaking changes) -->
<script src="https://unpkg.com/autotyper/index.umd.pkgd.min.js"></script>

<script>
  // autotyper is then available within the global scope
  // e.g. as `autotyper` or more explicitly `window.autotyper`
  const myAutotyper = Object.create(window.autotyper);
  const myElement = document.getElementById('js-element');
  const myOptions = {
    text: 'Look at my autotyper typing!',
  };
  
  myAutotyper.init(myElement, myOptions);
</script>
```

### API

As `autotyper` is just a plain old JavaScript object the entire API is exposed.

Here are the functions that you will probably pay attention to most:

#### autotyper.init(element, options)
#### autotyper.start()
#### autotyper.stop()
#### autotyper.reset()
#### autotyper.destroy()
#### autotyper.setText(text)

### Events

The `autotyper` object is an [event emitter](https://github.com/component/emitter) and emits the following events:

#### autotyper#init

Emitted when the instance is initialised.

#### autotyper#start

Emitted when the instance starts typing.

#### autotyper#type(text)

Emitted when the instance types a new character. The current text value is passed as the first argument.

#### autotyper#loop(loopCount)

Emitted when the instance loops. The number of times the instance has looped is passed as the first argument.

#### autotyper#stop

Emitted when the instance stops typing.

#### autotyper#destroy

Emitted when the instance is destroyed.
