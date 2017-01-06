# Autotyper

> A simple JavaScript plugin that automatically types out text.

[![Build Status: Linux](https://travis-ci.org/saulhardman/autotyper.svg?branch=master)](https://travis-ci.org/saulhardman/autotyper)

### Installation

#### Yarn

`yarn add autotyper`

#### NPM

`npm install --save autotyper`

### Download

The plugin is available in formats that support all of the major environments (ES, CommonJS, AMD, and UMD). Take a look at the [`dist/`](https://github.com/saulhardman/autotyper/tree/master/dist) directory to see them all.

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
  const myElement = document.getElementById('my-element');
  const myOptions = {
    text: 'Look at my autotyper typing!',
  };
  
  myAutotyper.init(myElement, myOptions);
</script>
```

### Usage

```js
// ES Modules
import autotyper from 'autotyper';
// CommonJS
const autotyper = require('autotyper');
// AMD
require(['autotyper'], function (autotyper) { /* use autotyper here */ });
// The UMD build can be used in both CommonJS and AMD environments
// It falls back to assigning autotyper to the global scope where no module system is present
// e.g. window.autotyper;

const example = Object.create(autotyper).init(document.querySelector('.js-element'));
```

### Options

These are the options and their default values:

```js
{
  text: element.innerHTML, // String representing the text to be typed out, defaults to the element's `innerHTML`
  interval: [200, 300], // Number or an array of 2 Numbers to randomise between (in milliseconds)
  autoStart: true, // Boolean or Number of milliseconds to delay start by
  loop: false, // Boolean or Number of loops
  emptyText: '\u00A0', // String to set the text to when the element is empty, defaults to the unicode literal 'no-break space' to preserve element height
}
```

### Examples

All of these (and more) can be interacted with live on [CodePen](https://codepen.io/saulhardman/pen/vgYwmO).

```js
const example = Object.create(autotyper);

example.init(document.querySelector('.js-element'), { autoStart: false });

example.on('start', () => console.log('It started!'));

// somewhere later in your code...

example.start();
```

### API

As `autotyper` is just a plain old JavaScript object the entire API is there for you to see.

That being said, these are the functions that you probably pay attention to most:

#### init(element, options)
#### start()
#### stop()
#### reset()
#### destroy()
#### setText(text)

### Events

#### init

Emitted when the instance is initialised.

#### start

Emitted when the instance starts typing.

#### type

Emitted when the instance types a new character.

#### stop

Emitted when the instance stops typing.

#### loop

Emitted when the instance loops;

#### destroy

Emitted when the instance is destroyed.
