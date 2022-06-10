import {initMixin} from './init'

// 构造函数
function Vue (options) {
  this._init(options)
}
initMixin(Vue)

export default Vue 

// 当new Vue 的时候都发生了什么，默认会进行vue初始化操作_init(),后面组件也会调用_init()