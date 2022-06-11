import { observer } from "./observer/index.js";

export function initState (vm) {
  const options = vm.$options;
  // props -> methods -> data -> computed -> watch

  // 初始化data选项
  if (options.data) {
    initData(vm)
  }

  if (options.computed) {

  }

  if (options.watch) {

  }
}
function proxy (target, key, property) {
  Object.defineProperty(target, property, {
    get() {
      return target[key][property]
    },
    set(newVaue) {
      target[key][property] = newVaue
    }
  })
}
function initData (vm) {
  let data = vm.$options.data

  data = vm._data = typeof data === 'function' ? data.call(vm) : data;
 
  // 添加通过vm.key -> vm._data.key 的映射访问属性
  for (const key in data) {
    proxy(vm, '_data', key)
  }

  // 对数据进行观测
  observer(data)

}