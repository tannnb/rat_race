
// 使用类似HOC函数思想，可以达到优化性能效果
const createRemoveSpace = () => {
  const reg = /\s/g;
  const replacement = ''
  return (str) => str.replace(reg, replacement)
}

// 调用的时候才会开始占用内存(存在闭包), 内存不会随着调用次数越多忽上忽下
let createSpace = createRemoveSpace()
createSpace('qwsdihd iasgdiaugsd')
createSpace('qwsdihd iasgdiaugsd')
createSpace('qwsdihd iasgdiaugsd')
createSpace('qwsdihd iasgdiaugsd')

// 释放内存
createSpace = null 

