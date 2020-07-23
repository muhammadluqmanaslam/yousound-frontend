// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  albums: [],
}

const getters = {}

const actions = {
  setAlbums({ commit }, albums) {
    commit('setAlbums', albums)
  },
}

const mutations = {
  setAlbums(state, albums) {
    state.albums = albums
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
