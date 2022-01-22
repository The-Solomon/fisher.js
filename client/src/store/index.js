import { createStore } from 'vuex'
import Board from './modules/Board.js'
import Config from './modules/Config.js'
export default createStore({
  modules: {
	Config, Board
  }
})
