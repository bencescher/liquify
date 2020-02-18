import db from '../../firebase/init.js'

const state  = {
  currency: ''
}

const mutations = {
  // load the base currency from the database
  'GET_CURRENCY' (state) {
    db.collection('currency').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          if (doc.id === 'base') {
            state.currency = doc.data().name
          }
        })
      })
      .catch(err => alert(err.message))
  },
  // update the base currency in the database and in the state
  'UPDATE_CURRENCY' (state, newCurrency) {
    db.collection('currency').doc('base').update({ name: newCurrency })
      .then(() => {
         state.currency = newCurrency
       })
       .catch(err => alert(err.message))
  }
}

const actions = {
  initCurrency: ({ commit }) => {
    commit('GET_CURRENCY')
  },
  updateCurrency: ({ commit }, newCurrency) => {
    commit('UPDATE_CURRENCY', newCurrency)
  }
}

const getters = {
  currency: state => {
    return state.currency
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}