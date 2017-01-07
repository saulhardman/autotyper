import randomNumber from './random-number';

export default function (interval) {
  if (Array.isArray(interval)) {
    if (interval.length === 2) {
      const [min, max] = interval;

      return randomNumber(min, max);
    }
  }

  return interval;
}
