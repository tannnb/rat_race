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

export const parseHTML = (html) => {
  // <div id="app">hello {{ kuangjia }} <span>{{time}}</span> </div>

  // 字符串前进/截取
  function advance (len) {
    html = html.substring(len)
  }

  // 解析开始标签
  function parseStartTag () {
    const start = html.match(startTagOpen)

    // ['<div', 'div', index: 0, input: '<div id="app" age="18">hello {{ kuangjia }} <span>{{time}}</span> </div>']
    if (start) {
      const match = { tagName: start[1], attrs: [] }
      advance(start[0].length)

      let attr;
      let end;
      // 没有找到结束标签 且 匹配到了属性
      // 步骤演示： str = ' id="app" age="18">hello {{ kuangjia }} <span>{{time}}</span> </div>'
      // 第一个判断： str.match(startTagClose)  -> null 
      // 第二个判断： str.match(attribute)
      // [' id="app"', 'id', '=', 'app', undefined, undefined, index: 0, input: ' id="app" age="18">hello {{ kuangjia }} <span>{{time}}</span> </div>'] 
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
        advance(attr[0].length)
      }
      // 吧开始标签的结束标签屏蔽掉： <div id="app" age="18">hello ......</div>
      // >hello ......</div>
      // hello ......</div>
      advance(end[0].length)
      return match
    }
  }

  let root;
  let parent;
  let stack = []
  
  function createAstElement(tagName,attrs) {
    return {
      tag:tagName,
      attrs,
      type: 1,
      children:[],
      parent:null
    }
  }
  function start (tagName, attrs) {
   
    let element = createAstElement(tagName,attrs)
    if(!root) {
      root = element
    }

    let parent = stack[stack.length - 1];
    if(parent) {
      element.parent = parent
      parent.children.push(element)
    }

    stack.push(element)
  }

  function charts(text) {
    let parent = stack[stack.length - 1];
    if(text) {
      parent.children.push({ text,type:3  })
    }
  }

  function end(tagName) {
    stack.pop()
  }

  while (html) {

    const textEnd = html.indexOf('<')
    // 如果遇到< 且值是0，可能是开始标签或结束标签，那么就开始解析出标签名
    if (textEnd === 0) {
      const startTagMatch = parseStartTag() // 一个解析html的库: htmlparse2

      // 匹配到了开始标签
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      // 判断是不是结束标签开始
      const endTagMatch = html.match(endTag)
      if(endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
      }
    }

    // 开始内容是文本
    let text;
    if (textEnd > 0) {
      text = html.substring(0,textEnd)
    }
    if(text) {
      charts(text)
      advance(text.length)
    }
  }
  return root
}