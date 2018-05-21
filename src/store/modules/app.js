import _ from 'lodash'

const state = {
  settings: {}
}

const getters = {
  disabledLiveVideo: (state) => {
    return _.get(state.settings, 'disable_live_video', false)
  }
}

const actions = {
  setSettings ({ commit }, settings) {
    commit('setSettings', settings)
  }
}

const mutations = {
  setSettings (state, settings) {
    state.settings = settings
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
