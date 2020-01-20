import test from 'ava';

import upperCaseFirstLetter from '../src/upper-case-first-letter';

test('it works', t => {
  const string = 'example';
  const result = upperCaseFirstLetter(string);

  t.is(result, 'Example');
});
