import { observe } from "./observe"

function defineReactiveData (data, key, value) {
  observe(value)
  Object.defineProperty(data, key, {
    get () {
      console.log('获取了:', value)
      return value
    },
    set (newValue) {
      if(newValue === value) return
      observe(newValue)
      value = newValue
    }
  })
}

export {
  defineReactiveData
}