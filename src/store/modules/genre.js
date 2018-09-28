// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'
// import GenreService from '@/services/genre'

const state = {
  genres: []
}

const getters = {}

const actions = {
  // getGenres: (state) => {
  //   if (state.genres && state.genres.length > 0) {
  //     return state.genres
  //   } else {
  //     GenreService.getGenres().then(response => {
  //       state.genres = response.body
  //       return state.genres
  //     })
  //     .catch(e => {
  //       console.log(e)
  //       return state.genres
  //     })
  //   }
  // },

  setGenres ({ commit }, genres) {
    commit('setGenres', genres)
  }
}

const mutations = {
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
