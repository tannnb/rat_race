function bindEvent (nodes, methods) {
  nodes.forEach(node => {
    const handleName = node.getAttribute('@click')
    if (handleName) {
      node.addEventListener('click', methods[handleName].bind(this), false)
    }
  })
}

export {
  bindEvent
}