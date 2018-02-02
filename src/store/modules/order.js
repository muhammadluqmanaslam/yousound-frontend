// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  orders: [],
  tab: null
}

const getters = {
}

const actions = {
  setOrders ({ commit }, orders) {
    commit('setOrders', orders)
  },
  removeOrder ({ commit }, index) {
    commit('removeOrder', index)
  },
  removeAllOrders ({ commit }) {
    commit('removeAllOrders')
  },
  setTab ({ commit }, tab) {
    commit('setTab', tab)
  }
}

const mutations = {
  setOrders (state, orders) {
    state.orders = orders
  },
  removeOrder (state, index) {
    state.orders.splice(index, 1)
  },
  removeAllOrders (state) {
    state.orders = []
  },
  setTab (state, tab) {
    state.tab = tab
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
