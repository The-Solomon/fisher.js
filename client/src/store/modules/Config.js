export default {
	state: {
		playerSide: 'w',
		moveTurn: 'w',
		boardNotation: {
			
			totalMoves: 0,
			movesWithoutTaking: 0,
		},
		castling: {
			whiteLong: true,
			whiteShort: true,
			blackLong: true,
			blackShort: true
		},
		settings: {
			coordinates: false,
			rotation: 'w',
		}
		
	},
	mutations: {
		UPDATE_CASTLING: (state, castling) => {
			state.castling = castling
		},
		UPDATE_BOARD_NOTATION: (state, notation) => {
			state.boardNotation = notation
		},
		UPDATE_COORDINATES: (state, coord) => {
			state.settings.coordinates = coord
		},
		UPDATE_MOVE_TURN: (state, data) => {
			state.moveTurn = data.turn
		}
	},
	actions: {
		SET_CASTLING: async ({commit, dispatch}, castling) => {
			commit("UPDATE_CASTLING", castling)
		},
		SET_BOARD_NOTATION: async({commit, dispatch}, notation) => {
			commit("UPDATE_BOARD_NOTATION", notation)
		},
		CHANGE_MOVE_TURN: async({commit, dispatch, getters}) => {
			const data = {
				turn: getters.GET_MOVE_TURN === 'w' ? 'b' : 'w',
			}
			commit("UPDATE_MOVE_TURN", data)
		}
	},
	getters: {
		GET_BOARD_NOTATION: (state) => {
			return state.boardNotation
		},
		GET_CASTLING: (state) => {
			return state.castling
		},
		GET_PLAYER_SIDE: (state) => {
			return state.playerSide
		},
		GET_MOVE_TURN: (state) => {
			return state.moveTurn
		}
 	}
}