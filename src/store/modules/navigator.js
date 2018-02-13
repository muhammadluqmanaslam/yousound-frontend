import _ from 'lodash'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  current: {
    page: '',
    tab: '',
    params: {}
  },
  history: []
}

const getters = {
  last: (state) => {
    const lastState = state.history[state.history.length - 1]
    if (_.isEmpty(lastState)) {
      return {page: '', tab: ''}
    }
    return lastState
  }
}

const actions = {
  setCurrentState ({commit}, current) {
    commit('setCurrentState', current)
    commit('auth/setPage', current.page, {root: true})
    commit('auth/setTab', current.tab, {root: true})
  },

  setParams ({commit}, params) {
    commit('setParams', params)
  },

  goNextState ({commit}, next) {
    if (_.isEqual(state.current, next) === false) {
      commit('pushToHistory')
      commit('setCurrentState', next)
      commit('auth/setPage', next.page, {root: true})
      commit('auth/setTab', next.tab, {root: true})
    }
  }
}

const mutations = {
  setCurrentState (state, current) {
    state.current = current
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
