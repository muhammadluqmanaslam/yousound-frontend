import _ from 'lodash'

const state = {
  settings: {},
  genres: [],
  product_categories: [],
  public_relations_user: {},
}

const getters = {
  disabledLiveVideo: (state) => {
    return _.get(state.settings, 'disable_live_video', false)
  },

  disabledVerification: (state) => {
    return _.get(state.settings, 'disable_verification', false)
  },

  digitalCategoryIds: (state) => {
    // return _.chain(state.product_categories).find((c) => (c.name === 'Digital Product')).get('id', null).value()
    return _.chain(state.product_categories)
      .filter((c) => c.is_digital)
      .map('id')
      .value()
  },

  reminderTracksCount: (state) => {
    return _.get(state.settings, 'reminder_tracks_count', 5)
  },
}

const actions = {
  setSettings({ commit }, settings) {
    commit('setSettings', settings)
  },

  setGenres({ commit }, genres) {
    commit('setGenres', genres)
  },

  setProductCategories({ commit }, categories) {
    commit('setProductCategories', categories)
  },

  setPublicRelationsUser({ commit }, user) {
    commit('setPublicRelationsUser', user)
  },
}

const mutations = {
  setSettings(state, settings) {
    state.settings = settings
  },

  setGenres(state, genres) {
    state.genres = genres
  },

  setProductCategories(state, categories) {
    state.product_categories = categories
  },

  setPublicRelationsUser(state, user) {
    state.public_relations_user = user
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
