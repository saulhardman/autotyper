import test from 'ava';

import interval from '../src/interval';

test('it works with a number', t => {
  const value = 100;
  const result = interval(value);

  t.is(result, 100);
});

test('it works with an array', t => {
  const value = [100, 200];
  const result = interval(value);

  if (result >= 100 && result <= 200) {
    t.pass();
  } else {
    t.fail();
  }
});

test('it works with a function', t => {
  const value = () => 100;
  const result = interval(value);

  t.is(result, 100);
});
