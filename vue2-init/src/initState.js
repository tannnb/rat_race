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

function initData (vm) {
  let data = vm.$options.data

  data = vm._data = typeof data === 'function' ? data.call(vm) : data;

  // 对数据进行观测
  observer(data)

}