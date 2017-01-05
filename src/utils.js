export function lowerCaseFirstLetter(string) {
  // e.g. AutoStart => autoStart
  return `${string.substring(0, 1).toLowerCase()}${string.substring(1)}`;
}

export function parseOptionNameFromAttributeName(name, packageName) {
  // e.g. autotyperAutoStart => autoStart
  return lowerCaseFirstLetter(name.substring(packageName.length));
}

export function random(min, max) {
  // return a random number between min and max
  return Math.floor(Math.random() * (max - (min + 1))) + min;
}
