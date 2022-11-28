const MyPromise = require('./MyPromise')


let promise1 = new MyPromise((resolve, reject) => {
  resolve('promise1')
})

let promise2 = promise1.then((value) => {
  return new MyPromise((resolve,reject) => {
    resolve(new MyPromise((resolve,reject) => {
      resolve(new MyPromise((resolve,reject) => {
        resolve('11111')
      }))
    }))
  })
}, reason => {
  return reason
})

promise2.then().then().then().then().then(
  value => {
    console.log(value);
  },
  reason => {
    console.log(reason);
  }
)