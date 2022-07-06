
import { initState } from "./initState";
import { compileToFunction } from "./compile/index.js";
import { mountComponent } from "./liftcycle";

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this

    // 后续所有原型中都可以通过 vm.$options 拿到用户传递的选项
    this.$options = options

    //  状态传递: 初始化用户传入的props methods data computed watch ...
    initState(vm)

    // 判断用户是否传入了el, 进行页面挂载
    if (options.el) {
      vm.$mount(options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    el = document.querySelector(el)
    vm.$el = el
    const options = vm.$options

    let render;
    // 模版使用顺序 render -> template -> outerHTML
    if (!options.render) {
      let template = options.template
      if (!template) {
        template = el.outerHTML
      }
      // 模版编译
      options.render = compileToFunction(template)
    }

    render = options.render
  
    mountComponent(vm, el)
  }
}