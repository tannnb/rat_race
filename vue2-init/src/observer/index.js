
class Observer {
  constructor(value) {
    // 将用户传入的选项 循环重写
    this.walk(value)
  }
  walk (target) {
    Object.keys(target).forEach(key => {
      defineReactive(target, key, target[key])
    })
  }
}

function defineReactive (target, key, value) {
  // 将target这个对象中的key进行重写,定义响应式

  // 递归对象类型检测(默认情况下要对所有都进行递归操作)
  observer(value)

  Object.defineProperty(target, key, {
    get () {
      return value
    },
    set (newValue) {
      if(newValue === value) return

      // 如果设置的值是对象，那么就再次调用ovserver让对象变成响应式
      observer(newValue)

      value = newValue
    }
  })
}


export function observer (data) {
  // data是指用户传入的数据，我们要对其进行观测

  // 如果不是对象或者为null，没意义不观测
  if (typeof data !== 'object' || data === null) {
    return
  }

  return new Observer(data)
}