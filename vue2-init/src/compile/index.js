import { parseHTML } from "./parse"
import { generate } from "./generate"


export function compileToFunction (html) {
  // 把模版变成AST语法树
  const ast = parseHTML(html)
  const code = generate(ast)

  // 吧AST变成render
  const render = new Function(`with(this){return ${code}}`)

  return render
}