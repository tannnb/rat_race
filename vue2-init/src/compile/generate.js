
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g

function genProps (attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]

    if (attr.name === 'style') {
      let style = {}
      // "color:'red";background:red;
      attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
        style[arguments[1]] = arguments[2]
      })
      attr.value = style
    }

    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function gen (el) {
  if (el.type === 1) {
    return generate(el)
  } else {
    let text = el.text
    if (!defaultTagRE.test(text)) {
      return `_v("${text}")`
    } else {
      let tokens = []
      let match;

      let lastIndex = defaultTagRE.lastIndex = 0
      while (match = defaultTagRE.exec(text)) {
        let index = match.index; // 匹配到了数据就放入tokens中
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      return `_v(${tokens.join('+')})`
    }
  }
}

function genChildren (ast) {
  let children = ast.children;
  if (children && children.length > 0) {
    return children.map(child => gen(child)).join(',')
  }
}
export function generate (ast) {
  let children = genChildren(ast)
  let code = `_c("${ast.tag}",${ast.attrs.length ? genProps(ast.attrs) : 'undefined'}${children ? ',' + children : ''})`
  return code
}