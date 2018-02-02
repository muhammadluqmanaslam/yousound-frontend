// import { Utils } from '@/helper'
// import * as types from '@/store/mutation-types'
// import AuthService from '@/services/auth'

const state = {
  // user: Utils.parseJSON(Storage.get('user')),
  isPlaying: false,
  list: [],
  tracks: [],
  listIndex: -1,
  trackIndex: -1,
  gridShow: false,
  isPaused: false,
  page: '',
  tab: '',
  user: null
}

const getters = {
  isPlaying: (state) => {
    return state.isPlaying
  }
}

const actions = {
  setPlayingStatus ({ commit }, isPlaying) {
    commit('setPlayingStatus', isPlaying)
  },

  setPauseStatus ({ commit }, isPaused) {
    commit('setPauseStatus', isPaused)
  },

  setPlaylist ({ commit }, list) {
    commit('setPlaylist', list)
  },

  setTracks ({ commit }, tracks) {
    commit('setTracks', tracks)
  },

  setListIndex ({ commit }, listIndex) {
    commit('setListIndex', listIndex)
  },

  updateFollowingStatus ({ commit }, status) {
    commit('updateFollowingStatus', status)
  },

  setTrackIndex ({ commit }, trackIndex) {
    // console.log('player action setTrackIndex', trackIndex)
    commit('setTrackIndex', trackIndex)
  },

  setPage ({ commit }, page) {
    commit('setPage', page)
  },

  setGridShow ({ commit }, gridShow) {
    commit('setGridShow', gridShow)
  },

  setTab ({ commit }, tab) {
    commit('setTab', tab)
  },

  setUpdatedUser ({ commit }, user) {
    commit('setUpdatedUser', user)
  }
}

const mutations = {
  setPlayingStatus (state, isPlaying) {
    state.isPlaying = isPlaying
  },

  setPauseStatus (state, isPaused) {
    state.isPaused = isPaused
  },

  setPlaylist (state, list) {
    state.list = list
  },

  setTracks (state, tracks) {
    state.tracks = tracks
  },

  setListIndex (state, listIndex) {
    state.listIndex = listIndex
    // if (listIndex >= state.list.length) {
    //   state.listIndex = 0
    // } else {
    //   state.listIndex = listIndex
    // }
  },

  updateFollowingStatus (state, status) {
    if (state.list[state.listIndex].assoc_type) {
      state.list[state.listIndex].assoc.publisher.is_following = status
    } else {
      state.list[state.listIndex].user.is_following = status
    }
  },

  setTrackIndex (state, trackIndex) {
    state.trackIndex = trackIndex
    // if (trackIndex >= state.tracks.length) {
    //   state.trackIndex = 0
    // } else {
    //   state.trackIndex = trackIndex
    // }
  },

  setGridShow (state, gridShow) {
    state.gridShow = gridShow
  },

  setPage (state, page) {
    state.page = page
  },

  setTab (state, tab) {
    state.tab = tab
  },

  setUpdatedUser (state, user) {
    state.user = user
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
