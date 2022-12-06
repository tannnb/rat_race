import { createApp, ref } from './Mine/index.js'

createApp('#app', {
  refs: {
    title: ref('标题'),
    content: ref('内容区域')
  },
  methods: {
    setTitle () {
      this.title.value = '修改后的标题'
    },
    setContent () {
      this.content.value = '修改后的内容'
    },
    reset() {
      this.title.$reset()
      this.content.$reset()
    }
  }
})