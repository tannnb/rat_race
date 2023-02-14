<template>
  <div class="container">
    <Container :options="{ width: 1920, height: 1080 }">
      <div class="header">header</div>
      <div class="center">center</div>
    </Container>
  </div>
</template>

<script>
import Container from '@/components/Container'
export default {
  name: 'HomeView',
  components: {
    Container
  }
}
</script>
<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  #screen-container {
    display: flex;
    flex-direction: column;
    .header {
      height: 167px;
      margin-top: 10px;
    }
    .center {
      flex: 1;
      display: flex;
    }
  }
}
</style>
