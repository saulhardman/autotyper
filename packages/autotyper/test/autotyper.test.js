import test from 'ava';

import autotyper, { DEFAULTS, EVENTS, NAME } from '../src/autotyper';
import objectToDataAttributes from './helpers/object-to-data-attributes';

const EVENT_NAMES = Object.keys(EVENTS).map(name => EVENTS[name]);
const { DESTROY, STOP } = EVENTS;
const ASYNC_TIMEOUT = 10000;

// replicate default `loopInterval` assignment from `init()`
Object.assign(DEFAULTS, {
  loopInterval: DEFAULTS.interval,
});

test.beforeEach((t) => {
  const instance = Object.create(autotyper);

  document.body.innerHTML = `
    <p id="js-example"></p>
  `;

  const element = document.getElementById('js-example');

  Object.assign(t.context, {
    instance,
    element,
  });
});

test.afterEach((t) => {
  const { context: { instance } } = t;

  instance.destroy();

  document.body.innerHTML = '';
});

test('it sets default options correctly', (t) => {
  const { context: { instance } } = t;

  instance.init();

  t.deepEqual(instance.settings, DEFAULTS);
});

test('it sets options correctly', (t) => {
  const { context: { instance } } = t;

  const options = {
    text: 'Example text.',
    interval: 200,
    autoStart: false,
    loop: true,
    loopInterval: 2000,
    emptyText: '',
  };

  instance.init(options);

  t.deepEqual(instance.settings, options);
});

test('it works with an element', (t) => {
  const { context: { instance, element } } = t;

  instance.init(element);

  t.deepEqual(instance.settings, DEFAULTS);
});

test('it sets `text` to the HTML content of an element', (t) => {
  const { context: { instance, element } } = t;
  const text = 'Example text.';

  element.innerHTML = text;

  instance.init(element);

  t.is(instance.settings.text, text);
});

test('it receives an options object via a single HTML data attribute', (t) => {
  const { context: { instance } } = t;

  const text = 'This text will not be used.';

  document.body.innerHTML = `
    <p id="js-example" data-${NAME}-options='${JSON.stringify(DEFAULTS)}'>${text}</p>
  `;

  const element = document.getElementById('js-example');

  instance.init(element);

  t.deepEqual(instance.settings, DEFAULTS);
});

test('it receives individual options via HTML data attributes', (t) => {
  const { context: { instance } } = t;

  const text = 'This text will not be used.';

  document.body.innerHTML = `
    <p id="js-example" ${objectToDataAttributes(DEFAULTS, NAME)}>${text}</p>
  `;

  const element = document.getElementById('js-example');

  instance.init(element);

  t.deepEqual(instance.settings, DEFAULTS);
});

test('it removes all event listeners on `destroy()`', (t) => {
  const { context: { instance } } = t;

  const callback = () => {};

  t.plan(EVENT_NAMES.length);

  instance.init();

  EVENT_NAMES.forEach(event => instance.on(event, callback));

  instance.destroy();

  EVENT_NAMES.forEach(event => t.false(instance.hasListeners(event)));
});

test('it emits events', (t) => {
  const { context: { instance } } = t;

  t.plan(EVENT_NAMES.length);

  instance.init();

  EVENT_NAMES.forEach(event => instance.on(event, () => t.pass()));

  EVENT_NAMES.forEach(event => instance.emit(event));
});

test('it emits events from respective functions', (t) => {
  const { context: { instance } } = t;
  const options = { loop: 1, interval: 50 };

  t.plan(EVENT_NAMES.length);

  EVENT_NAMES.forEach((event) => {
    instance.on(event, () => {
      instance.off(event);

      t.pass();
    });
  });

  instance.on(STOP, () => instance.destroy());

  instance.init(options);

  return new Promise((resolve, reject) => {
    instance.on(DESTROY, resolve);

    setTimeout(reject, ASYNC_TIMEOUT);
  });
});

test('it sets `originalText` to `element.innerHTML`', (t) => {
  const { context: { instance, element } } = t;
  const text = 'Example text.';

  element.innerHTML = text;

  instance.init(element);

  t.is(instance.originalText, text);
});

test('it sets `settings.text` to default value if undefined and HTML element is empty', (t) => {
  const { context: { instance, element } } = t;

  element.innerHTML = '';

  instance.init(element);

  t.is(instance.settings.text, DEFAULTS.text);
});

test('it returns HTML element to original state on `resetText()` and `destroy()`', (t) => {
  const { context: { instance, element } } = t;
  const text = 'Example text.';
  const options = {
    text: 'This is some text.',
    interval: 50,
  };

  t.plan(2);

  element.innerHTML = text;

  instance.init(element, options);

  t.is(instance.settings.text, options.text);

  return new Promise((resolve) => {
    setTimeout(() => {
      instance.resetText()
              .destroy();

      t.is(element.innerHTML, text);

      resolve();
    }, 200);
  });
});
