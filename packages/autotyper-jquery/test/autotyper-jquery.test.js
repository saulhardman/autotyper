import test from 'ava';
import jQuery from 'jquery';

import { EVENTS, NAME } from 'autotyper';
import '../src/index';

const EVENT_NAMES = Object.keys(EVENTS).map(event => EVENTS[event]);
const { LOOP } = EVENTS;

test.beforeEach((t) => {
  const text = 'Example text.';

  document.body.innerHTML = `
    <p class="js-example">${text}</p>
  `;

  const element = document.querySelector('.js-example');

  Object.assign(t.context, { element });
});

test('does autotyper extend jQuery', (t) => {
  const { element } = t.context;

  t.plan(2);

  t.is(typeof jQuery.fn.autotyper, 'function');

  t.is(typeof jQuery(element).autotyper, 'function');
});

// test('is the autotyper instance on the jQuery element');

// test('are autotyper events proxied to jQuery events', (t) => {
//   const { element } = t.context;
//   const $element = jQuery(element);
//   const options = { loop: 1 };
//
//   t.plan(EVENT_NAMES.length);
//
//   EVENT_NAMES.forEach((event) => {
//     const namespacedEvent = `${NAME}:${event}`;
//
//     $element.on(namespacedEvent, () => {
//       $element.off(namespacedEvent);
//
//       t.pass();
//     });
//   });
//
//   $element.autotyper(options);
//
//   const autotyper = $element.data(NAME);
//
//   autotyper.on(LOOP, () => autotyper.destroy());
// });
