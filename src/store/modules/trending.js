// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'
import SearchService from '@/services/search'

const state = {
  albums: [],
  videos: [],
  products: [],
}

const getters = {}

const actions = {
  async getTrendingMusic({ commit }, params) {
    return await SearchService.searchDiscover(params)
    .then((response) => commit('setTrendingMusic', response.body.albums))
  },
}

const mutations = {
  setTrendingMusic(state, feed) {
    console.log('albums: ', feed);
    state.albums = feed
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
