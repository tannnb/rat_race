import { ref, createRefs } from './hooks.js'
import { render } from './render.js'
import { bindEvent } from './event.js'

function createApp (el, { refs, methods }) {
  const $el = document.querySelector(el)
  const allNodes = $el.querySelectorAll('*')

  // {
  //   title: {
  //    deps: [h1,h1]
  //    _defaultValue: defaultValue
  //    _value: defaultValue
  //    value: set -> _value = newValue / upodate,
  //           get -> return _value
  //   }
  // 依赖收集
  const refSet = createRefs(refs, allNodes)

  // 根据处理后的数据进行render
  render(refSet)

  // 处理事件绑定
  bindEvent.apply(refSet, [allNodes, methods])
}

export {
  createApp,
  ref
}

