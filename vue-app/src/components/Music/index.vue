<template>
  <div class="audioContainer">
    <button @click="handlePlay">手动播放</button>
    <audio ref="audioRef" class="audio" controls src="/public/music.mp3" @timeupdate="handleUpdate"></audio>
    <div class="lyrContainer">
      <ul ref="scrollRef">
        <li
        :data-index="index"
          :class="{ active: index === source.currentIndex }"
          v-for="(item, index) in source.lrySource"
          :key="item.time"
        >
          {{ item.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, reactive, nextTick, onMounted, defineComponent } from 'vue'
import { lryData } from '../data'

const LI_HEIGHT = 30
export default defineComponent({
  setup() {
    const scrollRef = ref(null)
    const audioRef = ref(null)
    const source = reactive({
      containerHeight: null,
      maxOffset: null,
      lrySource: [],
      currentIndex: -1,
    })
    onMounted(() => {
      source.lrySource = parseLyric(lryData)
      const lyrContainer = document.querySelector('.lyrContainer')
      const clientHeight = lyrContainer.clientHeight
      source.containerHeight = clientHeight
      nextTick(() => {
        source.maxOffset = document.querySelector('.lyrContainer ul').clientHeight - clientHeight
      })
    })

    const parseLyric = (text) => {
      //先按行分割
      const lyric = text.split('\n')
      //新建一个数组存放最后结果
      const lrc = []

      for (let i = 0; i < lyric.length; i++) {
        //正则匹配播放时间返回一个数组
        const sj = lyric[i].match(/\[\d{2}:\d{2}((\.|\:)\d{2})\]/g)
        //获得该行歌词正文
        const _lrc = lyric[i].replace(/\[\d{2}:\d{2}((\.|\:)\d{2})\]/g, '')
        //过滤掉空行等非歌词正文部分
        if (sj != null) {
          //可能有多个时间标签对应一句歌词的情况，用一个循环解决
          for (let j = 0; j < sj.length; j++) {
            const _s = sj[j]
            const min = Number(String(_s.match(/\[\d{2}/i)).slice(1))
            const sec = parseFloat(String(_s.match(/\d{2}\.\d{2}/i)))
            //换算时间，保留两位小数
            const _t = Math.round((min * 60 + sec) * 100) / 100
            //把时间和对应的歌词保存到数组[_t, _lrc]
            lrc.push({
              time: _t,
              text: _lrc,
            })
          }
        }
      }
      //重新按时间排序
      lrc.sort((a, b) => a.time - b.time)
      return lrc
    }

    const getCurrentIndex = (currentTime, target) => {
      for (let i = 0; i < target.length; i++) {
        if (currentTime < target[i].time) {
          return i - 1
        }
      }
      return target.length - 1
    }

    const handleUpdate = (time) => {
      const currentTime = time.target.currentTime
      const index = getCurrentIndex(currentTime, source.lrySource)
      source.currentIndex = index
      if (index < 5) return

      let offset = LI_HEIGHT * index + LI_HEIGHT - source.containerHeight / 2
      if (offset > source.maxOffset) {
        offset = source.maxOffset
      }
      scrollRef.value.style.transform = `translateY(-${offset}px)`
    }

    const handlePlay = () => {
      audioRef.value.play()
    }

    return {
      handleUpdate,
      scrollRef,
      audioRef,
      source,
      handlePlay
    }
  },
})
</script>

<style scoped>
.audioContainer {
  display: flex;
  align-content: center;
  flex-direction: column;
  justify-content: center;
}
.audio {
  width: 500px;
}
.lyrContainer {
  overflow: hidden;
  height: 420px;
  border: 1px solid red;
  text-align: center;
}
ul {
  margin: 0;
  padding: 0;
  transition: 0.6s;
}
li {
  height: 30px;
  line-height: 30px;
  list-style-type: none;
  transition: 0.6s;
  font-size: 14px;
  color: #bab8b8;
}
li.active {
  color: #27d13f;
  transform: scale(1.3);
}
</style>
