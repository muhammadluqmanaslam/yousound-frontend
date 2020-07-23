// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  tracks: [],
  isUploadingTracks: false,
}

const getters = {}

const actions = {
  setUploadingStatus({ commit }, status) {
    commit('setUploadingStatus', status)
  },

  pushTrack({ commit }, track) {
    commit('pushTrack', track)
  },

  popTrack({ commit }, index) {
    commit('popTrack', index)
  },

  clearTracks({ commit }) {
    commit('clearTracks')
  },
}

const mutations = {
  setUploadingStatus(state, status) {
    state.isUploadingTracks = status
  },

  pushTrack(state, track) {
    state.tracks.push(track)
  },

  clearTracks(state) {
    state.tracks = []
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
