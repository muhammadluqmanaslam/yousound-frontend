import _ from 'lodash'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  current: {
    page: '',
    tab: '',
    action: '',
    params: {}
  },
  history: []
}

const getters = {
  last: (state) => {
    const lastState = state.history[state.history.length - 1]
    if (_.isEmpty(lastState)) {
      return {page: '', tab: '', action: ''}
    }
    return lastState
  },

  hasHeader: (state) => {
    return ['login', 'register', 'register_by_listener', 'landing', 'terms'].indexOf(state.current.page) === -1
  },

  hasFooter: (state) => {
    return ['landing'].indexOf(state.current.page) === -1
  },

  isPrimaryTheme: (state) => {
    return ['discover', 'profile-slider'].indexOf(state.current.page) > -1
  },

  isGrayTheme: (state) => {
    return ['upload', 'merch', 'profile', 'merch'].indexOf(state.current.page) > -1
  },

  isNormalTheme: (state) => {
    return ['album', 'playlist'].indexOf(state.current.page) > -1
  },

  isSliderProfileTheme: (state) => {
    return ['profile', 'merch'].indexOf(state.current.page) > -1
  }
}

const actions = {
  setCurrentState ({commit}, current) {
    commit('setCurrentState', current)
  },

  setParams ({commit}, params) {
    commit('setParams', params)
  },

  goNextState ({commit}, next) {
    if (_.isEqual(state.current, next) === false) {
      commit('pushToHistory')
      commit('setCurrentState', next)
    }
  }
}

const mutations = {
  setCurrentState (state, current) {
    state.current = _.assignIn({page: '', tab: '', action: ''}, current)
  },

  setParams (state, params) {
    state.current.params = params
  },

  pushToHistory (state) {
    if (state.current.page !== '') {
      state.history.push(state.current)
      if (state.history.length > 100) {
        state.history = state.history.slice(1)
      }
    }
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
