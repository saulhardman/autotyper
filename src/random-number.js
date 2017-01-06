export default function randomNumber(min, max) {
  // return a random number between min and max
  return Math.floor(Math.random() * (max - (min + 1))) + min;
}
