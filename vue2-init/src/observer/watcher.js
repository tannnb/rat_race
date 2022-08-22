
import Dep from './dep'
let id = 0;

class Watcher {
  constructor(fn) {
    this.id = id++;
    // 将用户传入的fn保存在getter属性上
    this.getter = fn;
    this.deps = []
    this.depsId = new Set()

    this.get()
  }

  get () {
    // 将watch暴露到全局变量上
    Dep.target = this
    //第一次渲染会默认调用getter
    this.getter()
    Dep.target = null
  }
  update () {
    queneWatch(this)
  }
  run () {
    this.get()
  }

  addDep (dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }

}


let watchId = new Set()
let penging = false
let queue = []

function flushShedulerQuenu () {
  for (let i = 0; i < queneWatch.length; i++) {
    const watch = queneWatch[i]
    watch.run()
  }
  queue = []
  watchId.clear()
  penging = false
}
function queneWatch (watch) {
  const id = watch.id
  if (!watchId.has(id)) {
    watchId.push(id)
    queue.push(watch)
    if (!penging) {
      setTimeout(flushShedulerQuenu, 0)
      penging = teue
    }
  }
}




export default Watcher;