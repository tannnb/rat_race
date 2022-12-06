

import { update } from "./render.js"

const validateReg = /\{\{(.+?)\}\}/

class Ref {
  constructor(defaultValue) {
    this.deps = new Set()
    this._value = defaultValue
    this._defaultValue = defaultValue
  }
  get value () {
    return this._value
  }
  set value(newValue) {
    this._value = newValue
    update(this)
  }
  $reset() {
    this.value = this._defaultValue
  }
}

function ref (defaultValue) {
  // 第一种
  return new Ref(defaultValue)

  // 第二种
  // const refWrapper = {
  //   deps: new Set(),
  //   _value: defaultValue,
  //   _defaultValue: defaultValue,
  //   $reset () {
  //     this.value = this._defaultValue
  //   }
  // }
  // Object.defineProperty(refWrapper, 'value', {
  //   get () {
  //     return refWrapper._value
  //   },
  //   set (newValue) {
  //     refWrapper._value = newValue
  //     update(refWrapper)
  //   }
  // })
  // return refWrapper
}

function createRefs (refs, allNodes) {
  allNodes.forEach(node => {
    if (validateReg.test(node.textContent)) {
      const refKey = node.textContent.match(validateReg)[1].trim()
      refs[refKey].deps.add(node)
    }
  })
  return refs
}

export {
  ref,
  createRefs
}