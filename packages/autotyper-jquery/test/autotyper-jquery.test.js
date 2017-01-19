import autotyper, { DEFAULTS, EVENTS, NAME } from 'autotyper';
import jQuery from 'jquery';
import test from 'ava';

import '../src/index';

const EVENT_NAMES = Object.keys(EVENTS).map(event => EVENTS[event]);
const { DESTROY, STOP } = EVENTS;
const ASYNC_TIMEOUT = 5000;

// replicate default `loopInterval` assignment from `init()`
Object.assign(DEFAULTS, {
  loopInterval: DEFAULTS.interval,
});

test.beforeEach((t) => {
  const text = 'Example text.';

  document.body.innerHTML = `
    <p class="js-example">${text}</p>
  `;

  const element = jQuery(document.querySelector('.js-example'));

  Object.assign(t.context, { element });
});

test.afterEach((t) => {
  const { element } = t.context;

  element.autotyper('destroy');
});

test('autotyper extends jQuery', (t) => {
  const { element } = t.context;

  t.plan(2);

  t.is(typeof jQuery.fn.autotyper, 'function');

  t.is(typeof jQuery(element).autotyper, 'function');
});

test('the instance is accessible via jQuery element data', (t) => {
  const { element } = t.context;

  element.autotyper();

  const instance = element.data(NAME);

  t.true(Object.isPrototypeOf.call(autotyper, instance));
});

test('it proxies events to jQuery', (t) => {
  const { element } = t.context;
  const options = { loop: 1, interval: 50 };

  t.plan(EVENT_NAMES.length);

  EVENT_NAMES.forEach((event) => {
    element.one(`${NAME}.${event}`, () => t.pass());
  });

  element.autotyper(options);

  const instance = element.data(NAME);

  instance.on(STOP, () => instance.destroy());

  return new Promise((resolve, reject) => {
    instance.on(DESTROY, resolve);

    setTimeout(reject, ASYNC_TIMEOUT);
  });
});

test('it can call functions via the jQuery plugin', (t) => {
  const { element } = t.context;

  element.autotyper();

  element.autotyper('stop');

  t.false(element.data('autotyper').isRunning);
});

test('it works without an element', (t) => {
  t.deepEqual(jQuery.autotyper().settings, DEFAULTS);
});

test('instance no longer accessible after `destroy()`', (t) => {
  const { element } = t.context;

  element.autotyper();

  element.autotyper('destroy');

  t.is(element.data('autotyper'), undefined);
});

test('jQuery event listeners are removed on `destroy()`', (t) => {
  const { element } = t.context;
  const event = `${NAME}.start`;

  element.autotyper();

  element.on(event, () => t.fail());

  element.autotyper('destroy');

  element.trigger(event);

  t.pass();
});
