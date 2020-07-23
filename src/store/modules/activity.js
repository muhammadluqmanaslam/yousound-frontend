// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'

function initialState() {
  return {
    badge: {
      activity: 0,
      stream: 0,
      message: 0,
      cart: 0,
      sell: 0,
    },
  }
}

const state = initialState

const getters = {}

const actions = {
  setBadge({ commit }, badge) {
    commit('setBadge', badge)
  },

  addBadge({ commit }, badge) {
    commit('addBadge', badge)
  },
}

const mutations = {
  setBadge(state, badge) {
    state.badge = badge
  },

  addBadge(state, badge) {
    Object.keys(badge).forEach((key) => {
      state.badge[key] += badge[key]
    })
  },

  reset(state) {
    const s = initialState()
    Object.keys(s).forEach((key) => {
      state[key] = s[key]
    })
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
