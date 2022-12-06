function render (refs) {
  for (let key in refs) {
    const ref = refs[key]
    _render(ref)
  }
}
function update ({ deps, value }) {
  _render({ deps, value })
}
function _render ({ deps, value }) {
  // 类似通知机制
  deps.forEach(dep => {
    dep.textContent = value
  })
}

export {
  render,
  update
}