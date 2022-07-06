

import { proto } from './array';
import Dep from './dep'

class Observer {
  constructor(value) {

    // 给当前调用者挂载一个Observer实例
    Object.defineProperty(value, '__ob__', {
      enumerable: false, // 在后续循环中不可枚举的属性不能被循环出来，否则会死循环
      value: this
    })

    if (Array.isArray(value)) {
      // 如果data中的key的value是数组:[value,value,...]，为了良好性能不对数组中的每一项进行数据观测，而是重写shift unshift pop push 等方法
      value.__proto__ = proto

      // 如果数组里放的是对象类型: [{key:value}],
      this.observerArray(value)

    } else {
      // 将用户传入的选项 循环重写
      this.walk(value)
    }
  }
  walk (target) {
    Object.keys(target).forEach(key => {
      defineReactive(target, key, target[key])
    })
  }
  observerArray (target) {
    for (let i = 0; i < target.length; i++) {
      observer(target[i])
    }
  }
}

function defineReactive (target, key, value) {
  // dep为当前key来进行服务的
  let dep = new Dep()

  // 将target这个对象中的key进行重写,定义响应式

  // 递归对象类型检测(默认情况下要对所有都进行递归操作)
  observer(value)

  Object.defineProperty(target, key, {
    get () {
      if (Dep.target) {
        // 让属性对应的dep记住当前的watch
        dep.depend()
      }
      return value
    },
    set (newValue) {
      if (newValue === value) return

      // 如果设置的值是对象，那么就再次调用ovserver让对象变成响应式
      observer(newValue)

      value = newValue
      dep.notify()
    }
  })
}


export function observer (data) {
  // data是指用户传入的数据，我们要对其进行观测

  // 如果不是对象或者为null，没意义不观测
  if (typeof data !== 'object' || data === null) {
    return
  }

  // 如果一个数据有__ob__说明已经被观测过了
  if (data.__ob__) {
    return
  }

  return new Observer(data)
}