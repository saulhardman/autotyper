import randomNumber from './random-number';

export default function (interval) {
  let value;

  if (Array.isArray(interval) && interval.length === 2) {
    const [min, max] = interval;

    value = randomNumber(min, max);
  } else if (typeof interval === 'function') {
    value = interval();
  } else {
    value = parseInt(interval, 10);
  }

  return value;
}
