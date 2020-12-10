import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { getItem, setItem, removeItem } from '../utils/Storage'
const USER_KEY = 'toutiao-user'
export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY)
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
      setItem(USER_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
