
function isObject (target) {
  return typeof target === 'object' && target !== null
}

function hasOwnProperty (target, key) {
  return Object.prototype.hasOwnProperty.call(target, key)
}

function isEqual(newValue,oldValue) {
  return newValue === oldValue
}

export {
  isObject,
  hasOwnProperty,
  isEqual
}