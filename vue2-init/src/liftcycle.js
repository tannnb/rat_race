import Watcher from "./observer/watcher"
import { createElement, createTextElement } from "./vdom/index"
import {path} from './vdom/path'

export function liftCycleMixin (Vue) {
  Vue.prototype._update = function (vnode) {
    // 虚拟DOM变成真实dom进行渲染
    this.$el = path(this.$el, vnode) // 传入一个真实dom 和vnode

    // 更新 传入2个虚拟节点 - diff
    console.log(vnode)
  }
  Vue.prototype._c = function (vnode) {
    return createElement(this, ...arguments)
  }
  Vue.prototype._v = function (text) {
    return createTextElement(this, text)
  }
  Vue.prototype._s = function (val) {
    if (typeof val === 'object') {
      return JSON.stringify(val)
    }
    return val
  }
  Vue.prototype._render = function () {
   
    const vm = this;
    let { render } = vm.$options;
    let vnode = render.call(vm)
    return vnode;
  }
}


export function mountComponent (vm, el) {
  let updateComponent = () => {
    // 产生虚拟节点，根据虚拟节点产生真实节点
    vm._update(vm._render())
  }

  // 渲染是通过watcher来进行渲染的
  new Watcher(updateComponent)
}