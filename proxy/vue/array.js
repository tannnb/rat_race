import { AEE_METHODS } from './config'

var originArrMethods = Array.prototype;
var arrMethods = Object.create(originArrMethods)

AEE_METHODS.map(function (m) {
  arrMethods[m] = function () {
    var args = Array.prototype.slice.call(arguments); // 将类数组变成数组
    var rt = originArrMethods[m].apply(this, args);
    var newArr;

    switch (m) {
      case 'push':
      case 'unshift':
        newArr = args
        break;
      case 'splice':
        newArr = args.slice(2)
        break;
      default:
        break
    }

    newArr && observeArr(newArr)
    return rt;
  }
})

export {
  arrMethods
}