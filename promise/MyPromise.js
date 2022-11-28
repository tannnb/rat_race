const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class Promise {
  constructor(executor) {
    this.states = PENDING
    this.value = undefined
    this.reason = undefined

    this.onFulfilledCallbacks = []     // 保存异步成功回调
    this.onRejectedCallbacks = []     // 保存异步失败回调

    const resolve = (value) => {
      if (this.states === PENDING) {
        this.states = FULFILLED
        this.value = value
        // 发布
        this.onFulfilledCallbacks.forEach(fn => fn())
      }
    }
    const reject = (reason) => {
      if (this.states === PENDING) {
        this.states = REJECTED
        this.reason = reason
        // 发布
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    try {
      // 执行器 (executor) 接收两个参数，分别是 resolve, reject
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then (onFulfilled, onRejected) {

    // onFulfilled和onRejected都是可选的，需要给默认值，并且then是能够穿透的
    // promise().then().then().then().....then((resolve,reject) => {code})
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    let promise2 = new Promise((resolve, reject) => {

      if (this.states === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }

      if (this.states === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }

      // 当 Promise 状态为等待状态(pending)时，将 onFulfilled 和 onRejected 存入对应的回调队列
      // 在状态改变成 FULFILLED或REJECTED的时候,forEach循环调用执行
      // 订阅
      if (this.states === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        this.onRejectedCallbacks.push(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
    })
    return promise2
  }

  catch (errorCallback) {
    return this.then(null, errorCallback)
  }

}

function resolvePromise (promise2, x, resolve, reject) {

  // 如果promise2和x的引用是同一个,防止循环引用
  if (promise2 === x) {
    return reject(new Error('Error 循环引用'))
  }

  // 如果 x 是一个 Promise 实例
  if (x instanceof Promise) {
    x.then(
      value => resolvePromise(promise2, value, resolve, reject),
      reject
    )
    return
  }

  // 是否调用过/标志位，防止重复调用
  // 例子: promise((resolve,reject) => {  resolve(); reject() }) 既调用成功，又调用失败,只处理第一个调用
  let called = false;

  // 如果是一个对象或函数
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      let then = x.then; // 在取值then的时候可能会拦截抛出了异常,需要捕获返回reject(reason)

      // then没有错误时，则判断then是不是一个函数，只有是一个函数里面才有回调函数，不是函数那么可能是一个普通值直接resolve(x)
      if (typeof then === 'function') {
        // 规定: 如果 then 是一个方法，把 x 当作 this 来调用它
        // 其中第一个参数为 resolvePromise，第二个参数为 rejectPromise
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            // 有可能resoleve(new Promise(resolve => new Promise(resolve => resolve('ok')))) ,需要递归的去执行每一个resolve
            // 防止 y 的返回值还是一个 Promise
            resolvePromise(promise2, y, resolve, reject)
          },
          (r) => {
            // 将失败结果会向下传递
            if (called) return
            called = true;
            reject(r)
          }
        )
      } else {
        // then 不是一个函数，用 x 完成 promise
        resolve(x)
      }
    } catch (e) {
      // 如果取 x.then 的值时抛出错误 e 则以 e 为原因执行 reject
      if (called) return
      called = true;
      reject(e)
    }
  } else {
    // 普通值就直接调用 resolve(x)
    resolve(x)
  }
}

module.exports = Promise