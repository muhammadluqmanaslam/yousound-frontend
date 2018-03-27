const state = {
  stripe: null
}

const getters = {
}

const actions = {
  setStripe ({ commit }, stripe) {
    commit('setStripe', stripe)
  }
}

const mutations = {
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
