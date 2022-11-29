
import { ATTR, REPLACE, REMOVE, TEXT } from './patchType'
import { setAttrs, render } from './virtualDom';

let finalPatches = {}
let rnIndex = 0

function doPatch (rDOM, patches) {
  finalPatches = patches;
  rNodeWalk(rDOM)
}

function rNodeWalk (rNode) {
  // 从patch中按照顺序获取 0:{ type:'',attrs:{},... } 
  const rnPatch = finalPatches[rnIndex++];
  const childNodes = rNode.childNodes; // HtmlNodeCollect类数组
  [...childNodes].map(child => {
    rNodeWalk(child) // 递归调用
  })
  // 必须能从pathes中取到值才能进行操作
  if (rnPatch) {
    patchAction(rNode, rnPatch)
  }
}

function patchAction (rNode, rnPatch) {
  rnPatch.map(path => {
    switch (path.type) {
      // 属性更改
      case ATTR:
        // 枚举对象key值，有值则进行修改，没值则代表原来的属性被删除了
        for (let key in path.attrs) {
          const value = path.attrs[key]
          if (value) {
            setAttrs(rNode, key, value)
          } else {
            rNode.removeAttribute(key)
          }
        }
        break;
      // 文本替换  
      case TEXT:
        rNode.textContent = path.text
        break;
      // 节点替换  
      case REPLACE:
        // 'REPLACE'类型的newNode有可能是Element类型并不是一个真实DOM，需要render之后变成真实DOM
        // 否则可能就是文本节点
        const newNode = path.newNode instanceof Element ? render(path.newNode) : document.createTextNode(path.newNode)
        rNode.parentNode.replaceChild(newNode, rNode)
        break;
      case REMOVE:
        // 节点删除  
        rNode.parentNode.removeChild(rNode)
        break;
    }
  })
}



export {
  doPatch
}