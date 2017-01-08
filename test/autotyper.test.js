import test from 'ava';

import autotyper, { DEFAULT_OPTIONS, EVENTS } from '../src/autotyper';
import objectToDataAttributes from './helpers/object-to-data-attributes';
import { name as packageName } from '../package.json';

// replicate default `loopInterval` assignment from `init()`
Object.assign(DEFAULT_OPTIONS, {
  loopInterval: DEFAULT_OPTIONS.interval,
});

test('it sets default options correctly', (t) => {
  autotyper.init();

  t.deepEqual(autotyper.settings, DEFAULT_OPTIONS);
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

  t.deepEqual(autotyper.settings, DEFAULT_OPTIONS);
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
    <p id="js-example" data-${packageName}='${JSON.stringify(DEFAULT_OPTIONS)}'>${text}</p>
  `;

  autotyper.init(document.getElementById('js-example'));

  t.deepEqual(autotyper.settings, DEFAULT_OPTIONS);
});

test('it receives individual options via HTML data attributes', (t) => {
  const text = 'This text will not be used.';

  document.body.innerHTML = `
    <p id="js-example" ${objectToDataAttributes(DEFAULT_OPTIONS, packageName)}>${text}</p>
  `;

  autotyper.init(document.getElementById('js-example'));

  t.deepEqual(autotyper.settings, DEFAULT_OPTIONS);
});

test('it removes all event listeners on `destroy()`', (t) => {
  const callback = () => {};

  t.plan(EVENTS.length);

  document.body.innerHTML = `
    <p id="js-example"></p>
  `;

  autotyper.init(document.getElementById('js-example'));

  EVENTS.forEach((event) => autotyper.on(event, callback));

  autotyper.destroy();

  EVENTS.forEach((event) => t.false(autotyper.hasListeners(event)));
});

test('emits events via `emit()`', (t) => {
  t.plan(EVENTS.length);

  document.body.innerHTML = `
    <p id="js-example"></p>
  `;

  autotyper.init(document.getElementById('js-example'));

  EVENTS.forEach((event) => autotyper.on(event, () => t.pass()));

  EVENTS.forEach((event) => autotyper.emit(event));
});

test('it emits events from respective functions', (t) => {
  const autoStart = false;
  const loop = true;

  t.plan(EVENTS.length);

  document.body.innerHTML = `
    <p id="js-example"></p>
  `;

  EVENTS.forEach((event) => autotyper.on(event, () => t.pass()));

  const [INIT_EVENT, ...OTHER_EVENTS] = EVENTS;

  autotyper[INIT_EVENT](document.getElementById('js-example'), { autoStart, loop });

  OTHER_EVENTS.forEach((event) => autotyper[event]());
});
