
let id =0;
class Dep {
  constructor() {
    this.id = id++;
    this.subs = []
  }
  depend () {
    Dep.target.addDep(this)
    // this.subs.push(Dep.target)
  }
  addSub(watcher) {
      this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watch => watch.update())
  }
}
Dep.target = null
export default Dep;