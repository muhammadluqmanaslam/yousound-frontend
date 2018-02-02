// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  products: []
}

const getters = {
}

const actions = {
  setProducts ({ commit }, products) {
    commit('setProducts', products)
  },

  removeProduct ({ commit }, index) {
    commit('removeProduct', index)
  },

  removeAllProducts ({ commit }) {
    commit('removeAllProducts')
  }
}

const mutations = {
  setProducts (state, products) {
    state.products = products
  },

  removeProduct (state, index) {
    state.products.splice(index, 1)
  },

  removeAllProducts (state) {
    state.products = []
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
