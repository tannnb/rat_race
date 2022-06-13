


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

export function generate (ast) {
  let children = ''
  let code = `_c("${ast.tag}",${ast.attrs.length ? genProps(ast.attrs) : 'undefined'}${children ? children : ''})`
  console.log(code);
}