
const state = {
  tab: null,
  stripe: null
}

const getters = {
}

const actions = {
  setTab ({ commit }, tab) {
    commit('setTab', tab)
  },

  setStripe ({ commit }, stripe) {
    commit('setStripe', stripe)
  }
}

const mutations = {
  setTab (state, tab) {
    state.tab = tab
  },

  setStripe (state, stripe) {
    state.stripe = stripe
  }
}

export default {
  namespaced: true,
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  actions,
  mutations
}
