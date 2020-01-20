export default function randomNumber(min, max) {
  // return a random number between min and max (inclusive of min and max)
  const minimum = Math.min(min, max);
  const maximum = Math.max(min, max);
  const multiplier = maximum - minimum + 1;

  return Math.floor(Math.random() * multiplier) + minimum;
}
