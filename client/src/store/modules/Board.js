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
		},
		movesHistory: []
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
		IS_CORRECT_MOVE: async({commit, dispatch, getters}, position) => {
			let colorFrom = await dispatch("GET_PIECE_COLOR", position.from.info.piece),
				colorTo = await dispatch("GET_PIECE_COLOR", position.to.info.piece),
				[player, turn] = [getters.GET_PLAYER_SIDE, getters.GET_MOVE_TURN];

			if(colorFrom !== turn) return false;
			if(colorFrom === colorTo) return false;
		},

		// Checking if the move is valid. Like if the rbishop moves only diagonaly, king moves only 
		// at the distance of one cell etc.
		IS_VALID_MOVE: async({commit, dispatch, getters}, position) => {
			let isValid;
			
			switch(position.from.info.piece){
				case "P":
				case "p":
					isValid = await dispatch("PAWN_MOVE", position);
					break;
				case "K":
				case "k":
					isValid = await dispatch("KING_MOVE", position);
					break;
				case "B":
				case "b":
					isValid = await dispatch("BISHOP_MOVE", position);
					break;
				case "R":
				case "r":
					isValid = await dispatch("ROOK_MOVE", position);
					break;
				case "N":
				case "n":
					isValid = await dispatch("KNIGHT_MOVE", position);
					break;
				case "Q":
				case "q":
					isValid = await dispatch("QUEEN_MOVE", position);

			}
			
			return isValid
		},
		
		GET_PIECE_COLOR: async({commit, dispatch}, piece) => {
			let whitePieces = ['P', 'R', 'B', 'N', 'K', 'Q']
			let blackPieces = ['p', 'r', 'b', 'n', 'k', 'q']

			if(whitePieces.includes(piece)) return 'w'
			if(blackPieces.includes(piece)) return 'b'

			return null
		},
		IS_CHECK: async() =>{

		},
		IS_MATE: async()=>{

		},

		// DOM events
		DRAG_START: async({commit, dispatch, getters}, {e, cellinfo, cellname}) => {
			let $el = e.target
			if(e.buttons !== 1) return false
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
			await commit("UPDATE_ACTIVE_ELEMENT", elem)
		},
		DRAG_STOP: async({commit, dispatch}, {e}) => {

		},
		DRAG: async({commit, dispatch, getters}, {e}) => {
			if(!getters.GET_ACTIVE_ELEMENT) return false;
			let $el = getters.GET_ACTIVE_ELEMENT.selector
			$el.style.position = 'fixed'
			$el.style.left = e.pageX + 'px'
			$el.style.top = e.pageY + 'px'
			$el.style.transform = 'translate(-50%, -50%)'
			$el.style.pointerEvents = 'none'
		},
		DROP: async({commit, dispatch, getters},{e, cellinfo, cellname}) => {
			
			if(!getters.GET_ACTIVE_ELEMENT) return false;
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
			if(moveInfo.from.name === moveInfo.to.name) return false
			let isValidMove = await dispatch("IS_VALID_MOVE", moveInfo),
				isCorrectMove = await dispatch("IS_CORRECT_MOVE", moveInfo);
			console.log(isValidMove)
			if(!isValidMove) return false;
			// if(!isCorrectMove) return false;
			await dispatch("CHANGE_MOVE_TURN")
			await commit("UPDATE_ACTIVE_ELEMENT", null)
			await commit("UPDATE_POSITION", moveInfo)
		},
		
		/**
		 * 
		 * @param {Object} context
		 * @param {Object} position - move`s information, from and to what point the piece was moved
		 * @returns true if move is valid
		 */
		PAWN_MOVE: async({commit, dispatch}, position) => {
			let color = await dispatch("GET_PIECE_COLOR", position.from.info.piece)
			const [fromX, fromY, toX, toY] = [position.from.info.x, position.from.info.y, position.to.info.x, position.to.info.y]

			// Forbid pawn to move backward
			if(color === 'w'){
				if(fromY < toY) return false
			} else if(color === 'b') {
				if(fromY > toY) return false	
			}

			// If the pawn is standing on 1 or 6 line allow to move it 2 cells forward
			if(fromY === 1 || fromY === 6) {
				if(Math.abs(fromY - toY) > 2) return false
			} else {
				if(Math.abs(fromY - toY) > 1) return false
			}

			// Forbid the pawn to move aside
			if(Math.abs(fromX - toX) > 0) return false

			return true
		},
		KING_MOVE: async({commit, dispatch}, position) => {
			const [fromX, fromY, toX, toY] = [position.from.info.x, position.from.info.y, position.to.info.x, position.to.info.y]

			// Forbid king to move more than 1 cell
			if(Math.abs(fromX - toX) > 1) return false
			if(Math.abs(fromY - toY) > 1) return false

			return true
		},
		BISHOP_MOVE: async({commit, dispatch}, position) => {
			const [fromX, fromY, toX, toY] = [position.from.info.x, position.from.info.y, position.to.info.x, position.to.info.y]
			if(Math.abs(toX - fromX) !== Math.abs(toY - fromY)) return false
			return true
		},
		ROOK_MOVE: async({commit}, position) => {
			const [fromX, fromY, toX, toY] = [position.from.info.x, position.from.info.y, position.to.info.x, position.to.info.y]

			// Forbid the rook to move diagonally 
			if(fromY !== toY && fromX !== toX) return false

			return true
		},
		KNIGHT_MOVE: async({commit, dispath}, position) => {
			const [fromX, fromY, toX, toY] = [position.from.info.x, position.from.info.y, position.to.info.x, position.to.info.y]

			// Forbid the knight to move more than 2 cells
			if(Math.abs(fromX - toX) > 2) return false
			if(Math.abs(fromY - toY) > 2) return false

			// If the knight moves 2 cells horizontally, forbid to move it more than 1 cell vertically. And vice versa
			if(Math.abs(fromY - toY) === 2 && Math.abs(fromX - toX) !== 1) return false
			if(Math.abs(fromX - toX) === 2 && Math.abs(fromY - toY) !== 1) return false
			if(Math.abs(fromY - toY) === 1 && Math.abs(fromX - toX) !== 2) return false
			if(Math.abs(fromX - toX) === 1 && Math.abs(fromY - toY) !== 2) return false

			return true
		},
		QUEEN_MOVE: async({commit, dispatch}, position) => {
			const [fromX, fromY, toX, toY] = [position.from.info.x, position.from.info.y, position.to.info.x, position.to.info.y]

			if(fromY !== toY && fromX !== toX && Math.abs(toX - fromX) !== Math.abs(toY - fromY)) return false

			return true
		},

		SHORT_CASTLING: async() => {

		},
		LONG_CASTLING: async() => {

		},
		PAWN_TRANSOFORMATION: async() => {

		},

		// Converters
		CONVERT_FEN_TO_OBJECT: async({commit, getters}, fen) => {
			// let fen = '8/8/8/8/8/8/7B/8 w KQkq - 0 1'
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

			await commit('UPDATE_BOARD', board)
		},
		CONVERT_OBJECT_TO_FEN: async({commit}, object) => {
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