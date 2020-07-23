// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  feeds: [],
  products: [],
}

const getters = {}

const actions = {
  setFeeds({ commit }, feeds) {
    commit('setFeeds', feeds)
  },

  setProducts({ commit }, products) {
    commit('setProducts', products)
  },
}

const mutations = {
  setFeeds(state, feeds) {
    state.feeds = feeds
  },

  setProducts(state, products) {
    state.products = products
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
