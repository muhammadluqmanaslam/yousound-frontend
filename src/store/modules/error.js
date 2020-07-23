const state = {
  progressBar: {
    hasValue: false,
    visibility: false,
    value: -1,
  },
  isLoading: false,
  progressValue: 0,
  showError: false,
  color: 'error',
  timeout: 3000,
  errors: [''],
}

const getters = {
  isLoading: (state) => {
    return state.progressBar.visibility
  },
}

const actions = {
  showLoadingActivity({ commit }, show) {
    commit('setProgressBarVisibility', show)
  },

  setProgressBarValue({ commit }, value) {
    commit('setProgressBarValue', value)
  },

  showErrorToast({ commit }, errors) {
    commit('showErrorToast', errors)
  },

  showSuccessToast({ commit }, errors) {
    commit('showSuccessToast', errors)
  },

  hideToast({ commit }) {
    commit('hideToast')
  },

  setTimeOut({ commit }, timeout) {
    commit('setTimeOut', timeout)
  },

  removeAll({ commit }) {
    commit('removeAll')
  },
}

const mutations = {
  setProgressBarVisibility(state, show) {
    state.progressBar.value = -1
    state.progressBar.visibility = show
  },

  setProgressBarValue(state, value) {
    state.progressBar.value = value
  },

  showErrorToast(state, errors) {
    state.errors = errors
    state.showError = true
    state.color = 'error'
  },

  showSuccessToast(state, errors) {
    state.errors = errors
    state.showError = true
    state.color = 'success'
  },

  hideToast(state) {
    state.showError = false
  },

  setTimeOut(state, timeout) {
    state.timeout = timeout
  },

  removeAll(state) {
    state.errors = ['']
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
