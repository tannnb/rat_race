
import Dep from './dep'
let id = 0;

class Watcher {
  constructor(fn) {
    this.id = id++;
    // 将用户传入的fn保存在getter属性上
    this.getter = fn;

    this.get()
  }

  get () {
    // 将watch暴露到全局变量上
    Dep.target = this
    //第一次渲染会默认调用getter
    this.getter()
    Dep.target = null
  }
  update() {
    this.get()
  }

}

export default Watcher;