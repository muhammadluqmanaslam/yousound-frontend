import _ from 'lodash'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  current: {
    page: '',
    tab: '',
    action: '',
    params: {},
  },
  history: [],
}

const getters = {
  last: (state) => {
    const lastState = state.history[state.history.length - 1]
    if (_.isEmpty(lastState)) {
      return { page: '', tab: '', action: '' }
    }
    return lastState
  },

  hasHeader: (state) => {
    return (
      [
        'login',
        'register',
        'register_by_listener',
        'landing',
        'terms',
        '',
      ].indexOf(state.current.page) === -1
    )
  },

  hasNoSidebar: (state) => {
    // pass route name
    return ['Home', 'Creators', 'AdFree', 'Login', 'Register', 'ForgotPassword', 'Confirmation']
  },
  hasFooter: (state) => {
    return ['landing'].indexOf(state.current.page) === -1
  },
  // New implementation
  hasNoFooter: (state) => {
    // pass route name
    return ['NotificationIndex', 'Register', 'Login', 'Confirmation', 'ForgotPassword']
  },

  hasAudioPlayer: (state) => {
    return ['settings', ''].indexOf(state.current.page) === -1
  },

  isHeaderFixed: (state) => {
    // return ['main_landing'].indexOf(state.current.page) > -1
    return true
  },

  isPrimaryTheme: (state) => {
    return ['music', 'profile-slider'].indexOf(state.current.page) > -1
  },

  isGrayTheme: (state) => {
    return ['upload', 'product', 'profile'].indexOf(state.current.page) > -1
  },

  isNormalTheme: (state) => {
    return ['album/show', 'playlist'].indexOf(state.current.page) > -1
  },
}

const actions = {
  setCurrentState({ commit }, current) {
    commit('setCurrentState', current)
  },

  setParams({ commit }, params) {
    commit('setParams', params)
  },

  goNextState({ commit }, next) {
    if (_.isEqual(state.current, next) === false) {
      commit('pushToHistory')
      commit('setCurrentState', next)
    }
  },
}

const mutations = {
  setCurrentState(state, current) {
    state.current = _.assignIn({ page: '', tab: '', action: '' }, current)
  },

  setParams(state, params) {
    state.current.params = params
  },

  pushToHistory(state) {
    if (state.current.page !== '') {
      state.history.push(state.current)
      if (state.history.length > 100) {
        state.history = state.history.slice(1)
      }
    }
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
