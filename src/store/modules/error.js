
const state = {
  isLoading: false,
  showError: false,
  color: 'error',
  timeout: 3000,
  errors: ['']
}

const getters = {
}

const actions = {
  showLoadingActivity ({ commit }, show) {
    commit('showLoadingActivity', show)
  },

  showErrorToast ({ commit }, errors) {
    commit('showErrorToast', errors)
  },

  showSuccessToast ({ commit }, errors) {
    commit('showSuccessToast', errors)
  },

  hideToast ({ commit }) {
    commit('hideToast')
  },

  setTimeOut ({ commit }, timeout) {
    commit('setTimeOut', timeout)
  },

  removeAll ({ commit }) {
    commit('removeAll')
  }
}

const mutations = {
  showLoadingActivity (state, show) {
    state.isLoading = show
  },

  showErrorToast (state, errors) {
    state.errors = errors
    state.showError = true
    state.color = 'error'
  },

  showSuccessToast (state, errors) {
    state.errors = errors
    state.showError = true
    state.color = 'success'
  },

  hideToast (state) {
    state.showError = false
  },

  setTimeOut (state, timeout) {
    state.timeout = timeout
  },

  removeAll (state) {
    state.errors = ['']
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
