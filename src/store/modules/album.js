// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  stats: null,
  albums: [],
  created_album: null
}

const getters = {
}

const actions = {
  setAlbums ({ commit }, albums) {
    commit('setAlbums', albums)
  },

  setCreatedAlbum ({ commit }, album) {
    commit('setCreatedAlbum', album)
  },

  setAlbumStats ({ commit }, stats) {
    commit('setAlbumStats', stats)
  }
}

const mutations = {
  setAlbums (state, albums) {
    state.albums = albums
  },

  setCreatedAlbum (state, album) {
    state.created_album = album
  },

  setAlbumStats (state, stats) {
    state.stats = stats
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
