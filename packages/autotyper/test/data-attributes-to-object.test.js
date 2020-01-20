import test from 'ava';

import dataAttributesToObject from '../src/data-attributes-to-object';

test('it works without attributes', t => {
  const namespace = 'namespace';
  const names = ['thing', 'other-thing'];

  document.body.innerHTML = `
    <p id="js-example"></p>
  `;

  const result = dataAttributesToObject(
    document.getElementById('js-example'),
    names,
    namespace,
  );

  t.deepEqual(result, {});
});

test('it works with without a namespace', t => {
  const names = ['thing', 'other-thing'];

  document.body.innerHTML = `
    <p id="js-example"
       data-thing="true"
       data-other-thing='"banana"'>
    </p>
  `;

  const result = dataAttributesToObject(
    document.getElementById('js-example'),
    names,
  );

  t.deepEqual(result, {
    thing: true,
    otherThing: 'banana',
  });
});

test('it works with a namespace', t => {
  const namespace = 'namespace';
  const names = ['thing', 'other-thing'];

  document.body.innerHTML = `
    <p id="js-example"
       data-namespace-thing="true"
       data-namespace-other-thing='"banana"'>
    </p>
  `;

  const result = dataAttributesToObject(
    document.getElementById('js-example'),
    names,
    namespace,
  );

  t.deepEqual(result, {
    thing: true,
    otherThing: 'banana',
  });
});
