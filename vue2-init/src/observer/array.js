let oldArrayPrototype = Array.prototype

// 创建一个空对象，并且去继承oldArrayPrototype的原型： proto.__proto__ = oldArrayPrototype
export const proto = Object.create(oldArrayPrototype);

 // 函数劫持： 让Vue中的数据 可以拿到重写后的原型，如果找不到就调用数组本身的方法
 const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']
 methods.forEach(method => {
  proto[method] = function (...args) {

    console.log('Vue数据劫持方法:', method);
    const ob = this.__ob__
    const result = oldArrayPrototype[method].call(this, ...args)
   
    // 对新增的方法，再次拦截 将新增的属性进行数据观测
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2)
      default:
        break;
    }

    ob.dep.notify()
    if (inserted) {
      ob.observerArray(inserted)
    }

    return result
  }
})
