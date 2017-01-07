import test from 'ava';
import paramCaseToCamelCase from '../src/param-case-to-camel-case';

test('it works for a non-hypenated string', (t) => {
  const string = 'example';
  const result = paramCaseToCamelCase(string);

  t.is(result, 'example');
});

test('it works for a hypenated string', (t) => {
  const string = 'example-example';
  const result = paramCaseToCamelCase(string);

  t.is(result, 'exampleExample');
});
