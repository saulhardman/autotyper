# autotyper-jquery

> ⌨️ A jQuery plugin for automatically typing text.

For more information see the [core package](https://github.com/saulhardman/autotyper/tree/master/packages/autotyper).

## Installation

### Yarn

```
yarn add jquery autotyper-query
```

### NPM

```
npm install --save jquery autotyper-jquery
```

## Usage

```js
import $ from 'jQuery';
import autotyper from 'autotyper-jquery';

const $example = $('.js-example');

$example.autotyper({
  text: 'This is the jQuery Plugin in action!',
  interval: [50, 100],
  autoStart: false,
});

$example.on('autotyper:type', (e, text) => {
  // do something with `text`
});

// call functions on the `autotyper` instance
$example.autotyper('start');

// directly access the `autotyper` instance
const instance = $example.data('autotyper');

instance.stop();
```

### CommonJS

```js
const $ = require('jquery');
const autotyper = require('autotyper');

// plugin is ready to use
```

### AMD

```js
require(['jquery', 'autotyper'], ($, autotyper) => {
  // plugin is ready to use
});
```

## Download

The latest version of the UMD build (bundled and minified) is available for download:

- [index.min.js](https://unpkg.com/autotyper-jquery/dist/index.min.js)

## CDN

```html
<!-- Be sure to include jQuery first -->
<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
<!-- Use a specific release (replace `x.x.x` with a version number) -->
<script src="https://unpkg.com/autotyper-jquery@x.x.x/dist/index.min.js"></script>
<!-- Use the latest minor or patch release (replace `x` with a version number) -->
<script src="https://unpkg.com/autotyper-jquery@x/dist/index.min.js"></script>
<!-- DANGER: Use the latest major release (could introduce breaking changes) -->
<script src="https://unpkg.com/autotyper-jquery/dist/index.min.js"></script>

<script>
  // plugin is ready to use
</script>
```

## API

See the [core package](https://github.com/saulhardman/autotyper/tree/master/packages/autotyper).

## License

MIT © [Saul Hardman](http://saulhardman.com)
