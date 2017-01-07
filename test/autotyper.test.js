import test from 'ava';
import autotyper, { DEFAULT_OPTIONS, EVENTS } from '../src/autotyper';

test('it works', (t) => {
  const text = 'Example text.';

  document.body.innerHTML = `
    <p id="js-example">${text}</p>
  `;

  autotyper.init(document.getElementById('js-example'));

  t.deepEqual(autotyper.settings, Object.assign(DEFAULT_OPTIONS, { text }));
});

test('it removes all event listeners on `destroy()`', (t) => {
  const text = 'Example text.';
  const callback = () => {};

  t.plan(EVENTS.length);

  document.body.innerHTML = `
    <p id="js-example">${text}</p>
  `;

  autotyper.init(document.getElementById('js-example'));

  EVENTS.forEach((event) => autotyper.on(event, callback));

  autotyper.destroy();

  EVENTS.forEach((event) => t.false(autotyper.hasListeners(event)));
});

test('emits events via `emit()`', (t) => {
  const text = 'Example text.';

  t.plan(EVENTS.length);

  document.body.innerHTML = `
    <p id="js-example">${text}</p>
  `;

  autotyper.init(document.getElementById('js-example'));

  EVENTS.forEach((event) => autotyper.on(event, () => t.pass()));

  EVENTS.forEach((event) => autotyper.emit(event));
});

test('it emits events from respective functions', (t) => {
  const text = 'Example text.';
  const autoStart = false;
  const loop = true;

  t.plan(EVENTS.length);

  document.body.innerHTML = `
    <p id="js-example">${text}</p>
  `;

  EVENTS.forEach((event) => autotyper.on(event, () => t.pass()));

  const [INIT_EVENT, ...OTHER_EVENTS] = EVENTS;

  autotyper[INIT_EVENT](document.getElementById('js-example'), { autoStart, loop });

  OTHER_EVENTS.forEach((event) => autotyper[event]());
});
