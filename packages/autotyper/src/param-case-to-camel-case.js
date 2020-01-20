import upperCaseFirstLetter from './upper-case-first-letter';

export default function paramCaseToCamelCase(string) {
  return string
    .split('-')
    .map((s, i) => {
      if (i === 0) {
        return s;
      }

      return upperCaseFirstLetter(s);
    })
    .join('');
}
