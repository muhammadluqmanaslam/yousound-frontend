// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'

const state = {
  playlists: [],
}

const getters = {}

const actions = {
  setPlaylists({ commit }, playlists) {
    commit('setPlaylists', playlists)
  },
}

const mutations = {
  setPlaylists(state, playlists) {
    state.playlists = playlists
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
