
export function path (oldVnode, vnode) {
  console.log('old', oldVnode, vnode);
  if (oldVnode.nodeType === 1) {
    // 初始化渲染

    // 根据虚拟节点创造真实节点，将节点插入到页面中再将老节点删除
    const element = createElement(vnode)
    const parentElement = oldVnode.parentNode;
    parentElement.insertBefore(element, oldVnode.nextSibling)
    parentElement.removeChild(oldVnode)
    return element
  }

}

function createElement (vnode) {
  const { tag, props, children, text } = vnode
  if (typeof tag === 'string') {
    // 吧创建的真实dom和虚拟dom映射在一起方便后续更新复用
    vnode.el = document.createElement(tag)
    children.forEach(child => {
      vnode.el.appendChild(createElement(child))
    })
  }else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}