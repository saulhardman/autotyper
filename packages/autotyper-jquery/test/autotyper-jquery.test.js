import test from 'ava';
import jQuery from 'jquery';

import '../src/index';

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
