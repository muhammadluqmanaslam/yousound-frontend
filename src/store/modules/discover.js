// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'
import SearchService from '@/services/search'
import StreamService from '@/services/stream'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  feeds: [],
  products: [],
  mobileMusicFeed: {
    recommended: [],
    new: [],
    popular: [],
  },
  mobileVideoFeed: {
    recommended: [],
    new: [],
    popular: [],
  },
}

const getters = {}

const actions = {
  async getMobileMusicFeed({ commit }, params) {
    return await SearchService.searchDiscover(params)
    .then((response) => commit('setMobileMusicFeed', { albums: response.body.albums, filter: params.filter }))
  },
  async getMobileVideoFeed({ commit }, params) {
    return await StreamService.getStreams(params)
    .then((response) => commit('setMobileVideoFeed', { videos: response.body.streams, filter: params.filter }))
  },
  setFeeds({ commit }, feeds) {
    commit('setFeeds', feeds)
  },

  setProducts({ commit }, products) {
    commit('setProducts', products)
  },
}

const mutations = {
  setMobileMusicFeed(state, feed) {
    const { filter } = feed
    const { albums } = feed

    state.mobileMusicFeed[filter] = albums
  },
  setMobileVideoFeed(state, feed) {
    const { filter } = feed
    const { videos } = feed

    state.mobileVideoFeed[filter] = videos
  },
  setFeeds(state, feeds) {
    state.feeds = feeds
  },
  setProducts(state, products) {
    state.products = products
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
