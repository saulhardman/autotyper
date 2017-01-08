import test from 'ava';
import randomNumber from '../src/random-number';

test('it works', (t) => {
  const min = 100;
  const max = 200;
  const result = randomNumber(min, max);

  if (result >= 100 && result <= 200) {
    t.pass();
  } else {
    t.fail();
  }
});

test('it works when min is equal to max', (t) => {
  const min = 100;
  const max = 100;
  const result = randomNumber(min, max);

  t.is(result, 100);
});

test('it works when min is greater than max', (t) => {
  const min = 200;
  const max = 100;
  const result = randomNumber(min, max);

  if (result >= 100 && result <= 200) {
    t.pass();
  } else {
    t.fail();
  }
});
