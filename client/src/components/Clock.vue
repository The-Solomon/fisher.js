<template>
<button class="startClock" @click="start()">clockme</button>
</template>
<script>
export default {
	name: 'Clock',
	async mounted(){
		
	},
	methods: {
		async start(){
			const audio = new Audio(require('../assets/sounds/piece-move2.mp3'))
			await audio.play() 
		}
	}
}
</script>