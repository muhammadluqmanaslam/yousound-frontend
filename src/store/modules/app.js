import _ from 'lodash'

const state = {
  settings: {},
  genres: []
}

const getters = {
  disabledLiveVideo: (state) => {
    return _.get(state.settings, 'disable_live_video', false)
  }
}

const actions = {
  setSettings ({ commit }, settings) {
    commit('setSettings', settings)
  },

  setGenres ({ commit }, genres) {
    commit('setGenres', genres)
  }
}

const mutations = {
  setSettings (state, settings) {
    state.settings = settings
  },

  setGenres (state, genres) {
    state.genres = genres
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
