import test from 'ava';

import autotyper, { DEFAULTS, EVENTS } from '../src/autotyper';
import objectToDataAttributes from './helpers/object-to-data-attributes';
import { name as packageName } from '../package.json';

const EVENT_NAMES = Object.keys(EVENTS).map(name => EVENTS[name]);
const { INIT } = EVENTS;

// replicate default `loopInterval` assignment from `init()`
Object.assign(DEFAULTS, {
  loopInterval: DEFAULTS.interval,
});

test('it sets default options correctly', (t) => {
  autotyper.init();

  t.deepEqual(autotyper.settings, DEFAULTS);
});

test('it sets options correctly', (t) => {
  const options = {
    text: 'Example text.',
    interval: 200,
    autoStart: false,
    loop: true,
    loopInterval: 2000,
    emptyText: '',
  };

  autotyper.init(options);

  t.deepEqual(autotyper.settings, options);
});

test('it works with an element', (t) => {
  document.body.innerHTML = `
    <p id="js-example"></p>
  `;

  autotyper.init(document.getElementById('js-example'));

  t.deepEqual(autotyper.settings, DEFAULTS);
});

test('it sets `text` to the HTML content of an element', (t) => {
  const text = 'Example text.';

  document.body.innerHTML = `
    <p id="js-example">${text}</p>
  `;

  autotyper.init(document.getElementById('js-example'));

  t.is(autotyper.settings.text, text);
});

test('it receives an options object via a single HTML data attribute', (t) => {
  const text = 'This text will not be used.';

  document.body.innerHTML = `
    <p id="js-example" data-${packageName}-options='${JSON.stringify(DEFAULTS)}'>${text}</p>
  `;

  autotyper.init(document.getElementById('js-example'));

  t.deepEqual(autotyper.settings, DEFAULTS);
});

test('it receives individual options via HTML data attributes', (t) => {
  const text = 'This text will not be used.';

  document.body.innerHTML = `
    <p id="js-example" ${objectToDataAttributes(DEFAULTS, packageName)}>${text}</p>
  `;

  autotyper.init(document.getElementById('js-example'));

  t.deepEqual(autotyper.settings, DEFAULTS);
});

test('it removes all event listeners on `destroy()`', (t) => {
  const callback = () => {};

  t.plan(EVENT_NAMES.length);

  document.body.innerHTML = `
    <p id="js-example"></p>
  `;

  autotyper.init(document.getElementById('js-example'));

  EVENT_NAMES.forEach(event => autotyper.on(event, callback));

  autotyper.destroy();

  EVENT_NAMES.forEach(event => t.false(autotyper.hasListeners(event)));
});

test('emits events via `emit()`', (t) => {
  t.plan(EVENT_NAMES.length);

  document.body.innerHTML = `
    <p id="js-example"></p>
  `;

  autotyper.init(document.getElementById('js-example'));

  EVENT_NAMES.forEach(event => autotyper.on(event, () => t.pass()));

  EVENT_NAMES.forEach(event => autotyper.emit(event));
});

test('it emits events from respective functions', (t) => {
  const autoStart = false;
  const loop = true;
  const options = { autoStart, loop };

  t.plan(EVENT_NAMES.length);

  document.body.innerHTML = `
    <p id="js-example"></p>
  `;

  const element = document.getElementById('js-example');

  EVENT_NAMES.forEach((event) => {
    let args = [];

    autotyper.on(event, () => {
      autotyper.off(event);

      t.pass();
    });

    if (event === INIT) {
      args = [element, options];
    }

    autotyper[event](...args);
  });
});

test('it sets `originalText` to `element.innerHTML`', (t) => {
  const text = 'Example text.';

  document.body.innerHTML = `
    <p id="js-example">${text}</p>
  `;

  const element = document.getElementById('js-example');

  autotyper.init(element);

  t.is(autotyper.originalText, text);
});

test('it sets `settings.text` to default value if undefined and HTML element is empty', (t) => {
  document.body.innerHTML = `
    <p id="js-example"></p>
  `;

  const element = document.getElementById('js-example');

  autotyper.init(element);

  t.is(autotyper.settings.text, DEFAULTS.text);
});

test('it returns HTML element to original state on `resetText()` and `destroy()`', (t) => {
  const text = 'Example text.';
  const interval = 50;

  t.plan(2);

  return new Promise((resolve) => {
    document.body.innerHTML = `
      <p id="js-example">${text}</p>
    `;

    const element = document.getElementById('js-example');

    autotyper.init(element, { interval });

    setTimeout(() => {
      t.not(autotyper.text, text);

      autotyper.resetText()
               .destroy();

      t.is(element.innerHTML, text);

      resolve();
    }, 200);
  });
});
