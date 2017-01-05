# Autotyper

A simple JavaScript plugin that automatically types out text.

### Installation

#### yarn

`yarn add --save autotyper`

#### NPM

`npm install --save autotyper`

#### CDN

A bundled and minified UMD version of the plugin is available on [unpkg](https://unpkg.com/):

Versioned releases: `https://unpkg.com/autotyper@x.x.x/index.umd.pkgd.min.js`

Latest release: `https://unpkg.com/autotyper/index.umd.pkgd.min.js`

### Usage

```js
// ES Modules
import autotyper from 'autotyper';
// CommonJS
const autotyper = require('autotyper');
// AMD
require(['autotyper'], function (autotyper) { // use autotyper here });
// The UMD build can be used in both CommonJS and AMD environments
// It falls back to assigning autotyper to the global scope where no module system is present
// e.g. window.autotyper;

const example = Object.create(autotyper).init(document.querySelector('.js-element'));
```

### Options

These are the options and their default values:

```js
interval: [200, 300], // Number or an array of 2 Numbers to randomise between
autoStart: true, // Boolean
loop: false, // Boolean or Number
```

### Examples

All of these (and more) can be interacted with live on [CodePen](https://codepen.io/saulhardman/pen/vgYwmO).

```js
const example = Object.create(autotyper);

example.init(document.querySelector('.js-element'), { autoStart: false });

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
