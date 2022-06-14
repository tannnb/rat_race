import { parseHTML } from "./parse"
import { generate } from "./generate"


export function compileToFunction(html) {
  // 1 把模版变成AST语法树
  // 2 优化静态静态节点
  // 3 吧AST变成render
  const ast = parseHTML(html)

  console.log('ast', ast)
  const result = generate(ast)

  console.log('ast:', result)
}