export default function upperCaseFirstLetter(string) {
  // e.g. text => Text
  return `${string.substring(0, 1).toUpperCase()}${string.substring(1)}`;
}
