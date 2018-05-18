import _ from 'lodash'

function initialState () {
  return {
    user: null,
    play_mode: 'stopped', // 'stopped', 'playing', 'paused'
    frame_mode: 'minimized', // 'full', 'normal', 'minimized'
    status: 'inactive'
  }
}

const state = initialState

const getters = {
  isInitialized: (state) => {
    return state.status !== 'inactive'
  },

  profilePath: (state) => {
    return _.get(state.user, 'slug', '')
  },

  streamUrl: (state) => {
    return _.get(state.user, 'stream.mp_channel_1_ep_1_url', '')
  },

  isPlaying: (state) => {
    return state.play_mode === 'playing'
  },

  hasFrame: (state) => {
    return state.status !== 'inactive' && state.frame_mode !== 'minimized'
  }
}

const actions = {
  setUser ({ commit }, user) {
    commit('setUser', user)
  },

  setPlayMode ({ commit }, playMode) {
    commit('setPlayMode', playMode)
  },

  setFrameMode ({ commit }, frameMode) {
    commit('setFrameMode', frameMode)
  },

  setStatus ({ commit }, status) {
    commit('setStatus', status)
  }
}

const mutations = {
  setUser (state, user) {
    state.user = _.cloneDeep(user)
  },

  setPlayMode (state, playMode) {
    state.play_mode = playMode
  },

  setFrameMode (state, frameMode) {
    console.log('setFrameMode', frameMode)
    state.frame_mode = frameMode
  },

  setStatus (state, status) {
    state.status = status
  },

  reset (state) {
    console.log('reset')
    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
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
