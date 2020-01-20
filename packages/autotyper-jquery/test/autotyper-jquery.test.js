import autotyper, { DEFAULTS, EVENTS, NAME } from 'autotyper';
import jQuery from 'jquery';
import test from 'ava';

import '../src/index';

const EVENT_NAMES = Object.keys(EVENTS).map(event => EVENTS[event]);
const { DESTROY, STOP } = EVENTS;
const ASYNC_TIMEOUT = 5000;

test.beforeEach(t => {
  const text = 'Example text.';

  document.body.innerHTML = `
    <p class="js-example">${text}</p>
  `;

  const element = jQuery(document.querySelector('.js-example'));

  Object.assign(t.context, { element });
});

test.afterEach(t => {
  const { element } = t.context;

  element.autotyper('destroy').remove();
});

test('autotyper extends jQuery', t => {
  const { element } = t.context;

  t.plan(2);

  t.is(typeof jQuery.fn.autotyper, 'function');

  t.is(typeof jQuery(element).autotyper, 'function');
});

test('the instance is accessible via jQuery element data', t => {
  const { element } = t.context;

  const instance = element.autotyper().data(NAME);

  t.true(Object.isPrototypeOf.call(autotyper, instance));
});

test('it proxies events to jQuery', t => {
  const { element } = t.context;
  const options = {
    loop: 1,
    interval: 50,
  };

  t.plan(EVENT_NAMES.length);

  EVENT_NAMES.forEach(event => element.one(`${NAME}.${event}`, () => t.pass()));

  return new Promise((resolve, reject) => {
    const instance = element.autotyper(options).data(NAME);

    instance.on(STOP, () => instance.destroy());

    instance.on(DESTROY, resolve);

    setTimeout(reject, ASYNC_TIMEOUT);
  });
});

test('it fails silently when no elements are found', t => {
  try {
    jQuery('.does-not-exist').autotyper();
  } catch (e) {
    t.fail();
  }

  t.pass();
});

test('it sets the defaults correctly when used with an element', t => {
  document.body.innerHTML = `
    <p class="js-example"></p>
  `;

  const element = jQuery(document.querySelector('.js-example'));

  const instance = element.autotyper().data(NAME);

  t.deepEqual(instance.settings, DEFAULTS);
});

test('it sets the defaults correctly when used without an element', t => {
  const instance = jQuery.autotyper();

  t.deepEqual(instance.settings, DEFAULTS);
});

test('it sets options correctly when used with an element', t => {
  const { element } = t.context;
  const options = {
    text: 'Example text',
    interval: 100,
    autoStart: false,
    loop: true,
    loopInterval: 100,
    empty: '>',
  };

  const { settings } = element.autotyper(options).data(NAME);

  t.deepEqual(settings, options);
});

test('it sets options correctly when used without an element', t => {
  const options = {
    text: 'Example text',
    interval: 100,
    autoStart: false,
    loop: true,
    loopInterval: 100,
    empty: '>',
  };

  const { settings } = jQuery.autotyper(options);

  t.deepEqual(settings, options);
});

test('it can call functions via the jQuery plugin', t => {
  const { element } = t.context;

  const instance = element
    .autotyper()
    .autotyper('stop')
    .data(NAME);

  t.false(instance.isRunning);
});

test('instance no longer accessible after `destroy()`', t => {
  const { element } = t.context;

  const instance = element
    .autotyper()
    .autotyper('destroy')
    .data(NAME);

  t.is(instance, undefined);
});

test('jQuery event listeners are removed on `destroy()`', t => {
  const { element } = t.context;
  const event = `${NAME}.start`;

  element
    .autotyper()
    .on(event, () => t.fail())
    .autotyper('destroy')
    .trigger(event);

  t.pass();
});
