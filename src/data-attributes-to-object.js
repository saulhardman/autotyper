import paramCaseToCamelCase from './param-case-to-camel-case';

function attributeName(name, namespace) {
  if (namespace) {
    return `data-${namespace}-${name}`;
  }

  return `data-${name}`;
}

export default function dataAttributesToObject(element, names, namespace) {
  return names.reduce((obj, name) => {
    const value = element.getAttribute(attributeName(name, namespace));
    const propertyName = paramCaseToCamelCase(name);

    if (value === null) {
      return obj;
    }

    return { ...obj, [propertyName]: JSON.parse(value) };
  }, {});
}
