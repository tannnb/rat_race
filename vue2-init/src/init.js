
import { initState } from "./initState";

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this

    // 后续所有原型中都可以通过 vm.$options 拿到用户传递的选项
    this.$options = options

    //  状态传递: 初始化用户传入的props data computed watch ...
    initState(vm)
    
  }
}