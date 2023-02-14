
const serial = ['Red', 'Yellow', 'Greed']
function sleep (duration = 1000) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
class Signal {
  constructor (options) {
    this.sig = options.init
    this.times = options.time
    this.eventMap = new Map()
    this.eventMap.set('change', new Set())
    this.eventMap.set('tick', new Set())
    this.setTime()
    this.exchange()
  }

  on (eventName, handler) {
    this.eventMap.get(eventName).add(handler)
  }

  off (eventName, handler) {
    this.eventMap.get(eventName).add(handler)
  }

  emit (eventName) {
    this.eventMap.get(eventName).forEach(h => h.call(this, this))
  }

  get next () {
    const currentIndex = (serial.indexOf(this.sig) + 1) % serial.length
    return serial[currentIndex]
  }

  get remain () {
    let diff = this.end - Date.now()
    if (diff < 0) {
      diff = 0
    }
    return diff / 1000
  }

  async exchange () {
    await 1
    if (this.remain > 0) {
      this.emit('tick')
      await sleep(1000)
    } else {
      this.sig = this.next
      this.setTime()
      this.emit('change')
    }
    this.exchange()
  }

  setTime () {
    this.start = Date.now()
    const time = this.times[serial.indexOf(this.sig)]
    this.end = this.start + time * 1000
  }
}
const p = new Signal({
  init: 'Red',
  time: [10, 3, 5]
})
p.on('tick', (e) => console.log(e.sig, Math.round(e.remain)))
