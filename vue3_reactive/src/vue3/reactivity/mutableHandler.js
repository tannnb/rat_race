import { isObject, hasOwnProperty, isEqual } from "../shared/utils";
import { reactive } from "./reactive";

const get = createGetter()
const set = createSetter()

function createGetter () {
  return function (target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    console.log('响应式获取:', res);
    if (isObject(res)) {
      return reactive(res)
    }
    return res
  }
}
function createSetter () {
  return function (target, key, value, receiver) {
    // 判断这个设置的key存不存在： 存在(更新) / 不存在(新增)
    const isKeyExist = hasOwnProperty(target, key)

    // 旧值
    const oldValue = target[key]

    const res = Reflect.get(target, key, value, receiver)

    if (!isKeyExist) {
      // 响应式【新增】之后可以做一些处理
    } else if (isEqual(value, oldValue)) {
      // 响应式【修改】之后可以做一些处理
    }
    return res
  }
}

const mutableHandler = {
  get,
  set
}

export {
  mutableHandler
}