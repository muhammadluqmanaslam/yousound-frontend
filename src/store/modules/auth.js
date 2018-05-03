// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'
import AuthService from '@/services/auth'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  page: '',
  tab: '',
  secret_code: '',
  register_role: null,
  token: null,
  pendingUser: null,
  user: null,
  firstVisit: false
}

const getters = {
  isAuthenticated: (state) => {
    return AuthService.isAuthenticated()
  },

  hasHeader: (state) => {
    if (['login', 'register', 'register_by_listener', 'landing'].indexOf(state.page) > -1) {
      return false
    } else {
      return true
    }
  },

  isPrimaryTheme: (state) => {
    if (state.page === 'discover') {
      return true
    } else {
      return false
    }
  },

  isGrayTheme: (state) => {
    if (state.page === 'upload' || state.page === 'merch' || (state.page === 'profile' && state.tab === 'merch')) {
      return true
    } else {
      return false
    }
  },

  isNormalTheme: (state) => {
    if (state.page === 'album' || state.page === 'playlist') {
      return true
    } else {
      return false
    }
  },

  isSliderProfileTheme: (state) => {
    if (state.page === 'profile' && state.tab !== 'merch') {
      return true
    } else {
      return false
    }
  }
}

const actions = {
  setPage ({ commit }, page) {
    commit('setPage', page)
  },

  setTab ({ commit }, tab) {
    commit('setTab', tab)
  },

  setToken ({ commit }, token) {
    commit('setToken', token)
  },

  setUser ({ commit }, user) {
    commit('setUser', user)
  },

  setStripeStatus ({ commit }, status) {
    commit('setStripeStatus', status)
  },

  setPendingUser ({ commit }, user) {
    commit('setPendingUser', user)
  },

  setStream ({ commit }, stream) {
    commit('setStream', stream)
  },

  addFavoriteUser ({ commit }, user) {
    commit('addFavoriteUser', user)
  },

  removeFavoriteUser ({ commit }, user) {
    commit('removeFavoriteUser', user)
  },

  setRegisterRole ({ commit }, role) {
    commit('setRegisterRole', role)
  },

  setSecretCode ({ commit }, code) {
    commit('setSecretCode', code)
  },

  setFirstVisit ({ commit }, firstVisit) {
    commit('setFirstVisit', firstVisit)
  }
}

const mutations = {
  setPage (state, page) {
    state.page = page
  },

  setToken (state, token) {
    state.token = token
  },

  setUser (state, user) {
    state.user = user
  },

  setPendingUser (state, user) {
    state.pendingUser = user
  },

  setStream (state, stream) {
    state.user.stream = stream
  },

  setStripeStatus (state, status) {
    state.user.is_stripe_connected = status
  },

  addFavoriteUser (state, user) {
    state.user.favorite_users.push(user)
  },

  removeFavoriteUser (state, user) {
    for (let index in state.user.favorite_users) {
      if (user.id === state.user.favorite_users[index].id) {
        state.user.favorite_users.splice(index, 1)
        break
      }
    }
  },

  setTab (state, tab) {
    state.tab = tab
  },

  setRegisterRole (state, role) {
    state.register_role = role
  },

  setSecretCode (state, code) {
    state.secret_code = code
  },

  setFirstVisit (state, firstVisit) {
    state.firstVisit = firstVisit
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
