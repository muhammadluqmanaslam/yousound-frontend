// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  count: {
    activity: 0,
    stream: 0,
    message: 0,
    cart: 0,
    sell: 0
  }
}

const getters = {
}

const actions = {
  setCount ({ commit }, count) {
    commit('setCount', count)
  },

  setCartCount ({ commit }, count) {
    commit('setCartCount', count)
  }
}

const mutations = {
  setCount (state, count) {
    state.count = count
  },

  setCartCount (state, count) {
    state.count.cart = count
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
