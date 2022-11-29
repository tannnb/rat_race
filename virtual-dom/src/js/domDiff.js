import { ATTR, REPLACE, REMOVE, TEXT } from './patchType'


let patches = {};
let vnIndex = 0
function domDiff (oldVnode, newVnode) {
  // 初始使用的index,顶点
  let index = 0;
  // console.log('oldVnode:', oldVnode)
  // console.log('newVnode:', newVnode)
  vNodeWalk(oldVnode, newVnode, index)
  console.log("patches:", patches)
  return patches
}

function vNodeWalk (oldNode, newNode, index) {
  let vnPatch = []

  // 如果newNode里面是被删除了的节点
  if (!newNode) {
    vnPatch.push({
      type: REMOVE,
      index
    })
  } else if (typeof oldNode === 'string' && typeof newNode === 'string') {
    // 假设oldNode和newNode是字符串类型，并且不想等，那么则进行变更
    if (oldNode !== newNode) {
      vnPatch.push({
        type: TEXT,
        text: newNode
      })
    }
  } else if (oldNode.type === newNode.type) {
    // 如果是一个元素节点(Element),如果标签名想等，就看属性是否相等
    const attrPatch = attrsWalk(oldNode.props, newNode.props)

    if (Object.keys(attrPatch).length > 0) {
      vnPatch.push({
        type: ATTR,
        attrs: attrPatch
      })
    }
    childrenWalk(oldNode ? oldNode.children || [] : [], newNode ? newNode.children || [] : [])
  }else {
    vnPatch.push({
      type: REPLACE,
      newNode
    })
  }

  // 0: [
  //   {
  //     type: "ATTR",
  //     attr: 'list-wrapper'
  //   }
  // ],
  if (vnPatch.length > 0) {
    patches[index] = vnPatch
  }

}

function attrsWalk (oldAttrs, newAttrs) {
  let attrPatch = {};

  // 修改的属性
  for (let key in oldAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      attrPatch[key] = newAttrs[key]
    }
  }

  // 新增的属性
  for (let key in newAttrs) {
    if (!oldAttrs.hasOwnProperty(key)) {
      attrPatch[key] = newAttrs[key]
    }
  }

  return attrPatch
}

function childrenWalk (oldChildren, newChildren) {
  oldChildren.map((child, index) => {
    vNodeWalk(child, newChildren[index], ++vnIndex)
  })
}

export {
  domDiff
}