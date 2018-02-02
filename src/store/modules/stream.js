// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  items: []
}

const getters = {
}

const actions = {
  setItems ({ commit }, items) {
    commit('setItems', items)
  }
}

const mutations = {
  setItems (state, items) {
    state.items = items
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
