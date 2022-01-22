<template>
<div class="board unselectable" @mousemove="DRAG({e: $event})" @contextmenu.prevent="MARK({e: $event})">
	<div class="board__cell cell"  
		 v-for="(cell, index) of GET_BOARD_POSITION"
		 
		 @mouseup="DROP({e: $event, cellinfo: cell, cellname: index})"
		 >

		<div class="cell__hint"></div>
		<div class="cell__notation">
			<span class="cell__r"></span>
			<span class="cell__c"></span>
		</div>
		
		<div class="board__piece" style="text-align: center; line-height: 95px" 
			v-if="cell.piece !== null"
			@mousedown="DRAG_START({e: $event, cellinfo: cell, cellname: index})"
			>
			<img  class="board__piece-icon" 
			v-if="cell.piece !== null"
			:src="require(`../assets/img/icons/pieces/${GET_ICON_BY_PIECE_NAME(cell.piece)}`)">
		</div>
		<div class="cell__mark"></div>
	</div>

</div>
</template>

<script>
import	{mapGetters, mapActions} from 'vuex'
export default {
	name: 'Board',
	computed: {
		...mapGetters([
			"GET_ICON_BY_PIECE_NAME","GET_BOARD_POSITION",
		])
	},
	methods: {
		...mapActions([
			"CONVERT_FEN_TO_OBJECT", "DROP", "DRAG_START", "DRAG",
			"MARK",
		]),
	},
	async mounted(){
		await this.CONVERT_FEN_TO_OBJECT('4r3/1K1p4/2P3P1/p7/bp2Nq2/3n1r1R/3P2P1/4k3 w - - 0 1')
	}
}
</script>
