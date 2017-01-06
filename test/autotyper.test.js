import test from 'ava';
import autotyper, { DEFAULT_OPTIONS } from '../src/autotyper';

test('it works', (t) => {
  const text = 'Example text.';

  document.body.innerHTML = `
    <p id="js-example">${text}</p>
  `;

  autotyper.init(document.getElementById('js-example'));

  t.deepEqual(autotyper.settings, Object.assign(DEFAULT_OPTIONS, { text }));
});
