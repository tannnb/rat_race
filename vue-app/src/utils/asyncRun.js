
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
