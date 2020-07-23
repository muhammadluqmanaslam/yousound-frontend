import _ from 'lodash'

function initialState() {
  return {
    genres: [],
  }
}

const state = initialState

const getters = {
  genre: (state) => {
    return _.get(state.genres, '[0]', { id: '', name: '' })
  },
}

const actions = {
  setGenres({ commit }, genres) {
    commit('setGenres', genres)
  },
}

const mutations = {
  setGenres(state, genres) {
    state.genres = genres
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
