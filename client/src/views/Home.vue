<template>
  <div class="home">
   <Board></Board>
   <Clock></Clock>
  </div>
</template>

<script>
import Clock from '@/components/Clock.vue'
import Board from '@/components/Board.vue'
export default {
  name: 'Home',
  components: {
	  Board, Clock
  },
  mounted(){
	  document.title = 'Fisher.js - Chess engine/Game'
  }
}
</script>
<style scoped lang="css">
html, body {
	overflow: hidden
}
</style>