<template>
  <div class="about">
    <h1 style="--color:red;fontSize:30px">This is an about page</h1>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    return {

    }
  }
})
</script>
<style>
  h1 {
    background: var(--color);
  }
</style>
