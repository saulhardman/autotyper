export default function objectToDataAttributes(object, namespace) {
  return Object.keys(object)
    .map(name => {
      const value = object[name];

      return `data-${namespace}-${name}='${JSON.stringify(value)}'`;
    })
    .join(' ');
}
