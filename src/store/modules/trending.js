import SearchService from '@/services/search'
import StreamService from '@/services/stream'

const state = {
  albums: [],
  videos: [],
  products: [],
}

const getters = {}

const actions = {
  async getTrendingMusic({ commit }, params) {
    return await SearchService.searchDiscoverPublicUser(params)
    .then((response) => commit('setTrendingMusic', response.body.albums))
  },
  async getTrendingVideos({ commit }, params) {
    return await StreamService.getStreams(params)
    .then((response) => commit('setTrendingVideos', response.body.streams))
  },
  async getTrendingProducts({ commit }, params) {
    return await SearchService.searchDiscoverPublicUser(params)
    .then((response) => commit('setTrendingProducts', response.body.products))
  },
}

const mutations = {
  setTrendingMusic(state, feed) {
    state.albums = feed
  },
  setTrendingVideos(state, feed) {
    state.videos = feed
  },
  setTrendingProducts(state, feed) {
    state.products = feed
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
