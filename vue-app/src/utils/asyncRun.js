
// 模拟一个微任务
function asyncRun (func) {
  if (typeof Promise !== 'undefined') {
    Promise.resolve().then(func)
  } else if (typeof MutationObserver !== 'undefined') {
    const obj = new MutationObserver(func)

    // w3c规定，如果浏览器支持MutationObserver，那么尽可能将callback放入微队列中
    const textNode = document.createTextNode('0')
    obj.observe(textNode, { characterData: true })
    textNode.data = '1'
  } else {
    setTimeout(func)
  }
}


// 判断是否是奇数
// a % b
// => a - b * p   p: a/b的整数部分
// 例子： 5 % 3 = 5 - 3 * (1) = 2
function isOdd (n) {
  if (typeof n !== 'number') {
    throw new TypeError(`${n} is not a number`)
  }
  return n % 2 === 1 || n % 2 === -1;
}
