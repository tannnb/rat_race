import { observe } from './observe'

function observeArr (data) {
  for (var i = 0; i < data.length; i++) {
    observe(data[i])
  }
}

export {
  observeArr
}