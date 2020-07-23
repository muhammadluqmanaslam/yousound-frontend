const state = {
  stripe: null,
  cartItems: [],
}

const getters = {}

const actions = {
  setStripe({ commit }, stripe) {
    commit('setStripe', stripe)
  },

  setCartItems({ commit }, cartItems) {
    commit('setCartItems', cartItems)
  },
}

const mutations = {
  setStripe(state, stripe) {
    state.stripe = stripe
  },

  setCartItems(state, cartItems) {
    state.cartItems = cartItems
  },
}

export default {
  namespaced: true,
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  actions,
  mutations,
}
