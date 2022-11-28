import { proxyData } from './proxy'
import { observe } from './observe'

function initState (vm) {
  var options = vm.$options
  if (options.data) {
    initData(vm)
  }
}

function initData (vm) {
  var data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}

  // 数据劫持
  // this.title => this._data.title
  for (var key in data) {
    proxyData(vm, '_data', key)
  }

  // 观测数据
  observe(vm._data)


}

export {
  initState
}