import _ from 'lodash'

function initialState () {
  return {
    stream: null,
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

  isPlaying: (state) => {
    return state.play_mode === 'playing'
  },

  hasFrame: (state) => {
    // return state.status !== 'inactive' && state.frame_mode !== 'minimized'
    return state.frame_mode !== 'minimized'
  }
}

const actions = {
  // setUser ({ commit }, user) {
  //   commit('setUser', user)
  // },

  updateFollowingStatus ({ commit }, status) {
    commit('updateFollowingStatus', status)
  },

  setStream ({ commit }, stream) {
    commit('setStream', stream)
  },

  updateStreamAssoc ({ commit }, info) {
    commit('updateStreamAssoc', info)
  },

  setStats ({ commit }, stats) {
    console.log('setStats', stats)
    commit('setStats', stats)
  },

  addStats ({ commit }, stats) {
    commit('addStats', stats)
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
  // setUser (state, user) {
  //   state.user = _.cloneDeep(user)
  // },

  updateFollowingStatus (state, status) {
    if (state.stream.user) {
      state.stream.user.is_following = status
    }
  },

  setStream (state, stream) {
    // state.stream = _.cloneDeep(stream)
    state.stream = _.assignIn({
      stats: {
        views_size: 0,
        downloads_size: 0,
        carts_size: 0,
        followed_size: 0
      }
    }, stream)
  },

  repostStream (state) {
    state.stream.is_reposted = true
  },

  updateStreamAssoc (state, info) {
    state.stream.assoc_type = info.assoc_type
    state.stream.assoc = info.assoc
  },

  setStats (state, stats) {
    state.stream.stats = stats
  },

  addStats (state, stats) {
    Object.keys(stats).forEach(key => {
      state.stream.stats[key] += stats[key]
    })
  },

  setPlayMode (state, playMode) {
    state.play_mode = playMode
  },

  setFrameMode (state, frameMode) {
    // console.log('setFrameMode', frameMode)
    state.frame_mode = frameMode
  },

  setStatus (state, status) {
    state.status = status
  },

  reset (state) {
    console.log('video_player reset state')
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
