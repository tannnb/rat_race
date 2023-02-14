<!--  -->
<template>
  <div class="MessageBox-container">
    {{ title }}
    <button @click="handleClose">点击关闭</button>
  </div>
</template>

<script>
export default {
  name: 'MessageBox',
  props: {
    title: {
      type: String,
      default:'默认值'
    },
  },
  methods: {
    handleClose() {
      this.$messageBox.hide()
    }
  },
}
</script>

<style scoped>
.MessageBox-container {
  width: 100%;
}
</style>
