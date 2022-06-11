



// 匹配属性 a = b | a = 'b'
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

const ncname = '[a-zA-Z_][\\w\\-\\.]*'

// 匹配标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`

// 标签开头 捕获的内容是标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`)

// 标签结尾 匹配标签结束
const startTagClose = /^\s*(\/?)>/

// 匹配标签结尾的 
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

// 匹配花括号 {{ key }}
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g

export function compileToFunction(html) {
  // 1 把模版变成AST语法树
  // 2 优化静态静态节点
  // 3 吧AST变成render
  console.log('html:', html)
}