import Vue from 'vue'
import Vuex from 'vuex'
import assets from './modules/assets'
import currency from './modules/currency'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    assets,
    currency
  }
})
