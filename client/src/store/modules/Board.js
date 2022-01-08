export default {
	state: {
		activeElement: null,
		pieceIcons: {
			p: 'blackPawn.svg',
			n: 'blackKnight.svg',
			b: 'blackBishop.svg',
			r: 'blackRook.svg',
			q: 'blackQueen.svg',
			k: 'blackKing.svg',
			P: 'whitePawn.svg',
			N: 'whiteKnight.svg',
			B: 'whiteBishop.svg',
			R: 'whiteRook.svg',
			Q: 'whiteQueen.svg',
			K: 'whiteKing.svg',
		},
		size: {
			width: '860px',
			height: '860px'
		}
	},
	mutations: {
		UPDATE_BOARD(state, board){
			state.board = board
		},
		UPDATE_ACTIVE_ELEMENT(state, elem){
			state.activeElement = elem
		},
		UPDATE_POSITION(state, {from, to}){

			state.board[to.name].piece = from.info.piece
			state.board[from.name].piece = null
		}
	},
	actions: {
		onDragStart({commit, dispatch, gettes}, {e, cellinfo, cellname}){
			let $el = e.target
			$el.style.position = 'fixed'
			$el.style.left = e.pageX + 'px'
			$el.style.top = e.pageY + 'px'
			$el.style.transform = 'translate(-50%, -50%)'
			$el.style.pointerEvents = 'none'
			
			const elem = {
				selector: $el,
				cellinfo: cellinfo,
				cellname: cellname
			}

			commit("UPDATE_ACTIVE_ELEMENT", elem)
		},
		onDrag({commit, dispatch, getters}, {e}){
			if(!getters.GET_ACTIVE_ELEMENT) return false;
			let $el = getters.GET_ACTIVE_ELEMENT.selector
			$el.style.position = 'fixed'
			$el.style.left = e.pageX + 'px'
			$el.style.top = e.pageY + 'px'
			$el.style.transform = 'translate(-50%, -50%)'
			$el.style.pointerEvents = 'none'
		},
		onDrop({commit, dispatch, getters},{e, cellinfo, cellname}){
			if(!getters.GET_ACTIVE_ELEMENT) return false;
			let $el = getters.GET_ACTIVE_ELEMENT.selector
			$el.style.position = null
			$el.style.left =  null
			$el.style.top = null
			$el.style.transform = null
			$el.style.pointerEvents = null
			
			let moveInfo = {
				from: {
					info: getters.GET_ACTIVE_ELEMENT.cellinfo,
					name: getters.GET_ACTIVE_ELEMENT.cellname
				}, 
				to: {
					info: cellinfo,
					name: cellname
				}
			}
			commit("UPDATE_ACTIVE_ELEMENT", null)
			if(moveInfo.from.name === moveInfo.to.name) return false
			commit("UPDATE_POSITION", moveInfo)
			
		},
		

		
		CONVERT_FEN_TO_OBJECT({commit, getters}){
			let fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
			let cols = 'abcdefgh',
				rows = '87654321';

			fen = fen.replace(/ .+$/, '')
			const expandEmptyCells = (digit) => {
				return digit.replace(/8/g, '11111111')
							.replace(/7/g, '1111111')
							.replace(/6/g, '111111')
							.replace(/5/g, '11111')
							.replace(/4/g, '1111')
							.replace(/3/g, '111')
							.replace(/2/g, '11')
							.replace(/\//gi, '')
			}
			fen = expandEmptyCells(fen)

			let items = fen.replace('/', ''),
				i = 0,
				board = {};

			for(let r = 0; r < rows.length; r++){
				for(let c = 0; c < cols.length; c++){
					let positionName = cols[c] + rows[r]
					board[positionName] = {
						id: i,
						y: r,
						x: c,
						piece: items[i] !== '1' ? items[i] : null
					}
					i++
				}
			}
			commit('UPDATE_BOARD', board)
		},
		CONVERT_OBJECT_TO_FEN({commit}, object){

		}
	},
	getters: {
		GET_BOARD_POSITION: (state) => {
			return state.board
		},
		GET_BOARD_SIZE: (state) => {
			return state.size
		},
		GET_ICON_BY_PIECE_NAME: (state) => (name) => {
			return state.pieceIcons[name]
		},
		GET_ACTIVE_ELEMENT: (state) => {
			return state.activeElement
		}
	}
}