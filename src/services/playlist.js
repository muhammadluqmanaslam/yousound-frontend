import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/playlists'

export default {
  getPlaylists () {
    return Vue.http.get(API_BASE_URL, { headers: { 'Authorization': $store.state.auth.token } })
  },

  createPlaylist (params) {
    return Vue.http.post(API_BASE_URL, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  getPlaylist (playlistId) {
    return Vue.http.get(API_BASE_URL + '/' + playlistId, { headers: { 'Authorization': $store.state.auth.token } })
  },

  deletePlaylist (playlistId) {
    return Vue.http.delete(API_BASE_URL + '/' + playlistId, { headers: { 'Authorization': $store.state.auth.token } })
  },

  updatePlaylist (playlistId, params) {
    return Vue.http.patch(API_BASE_URL + '/' + playlistId, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  removeTrack (playlistId, params) {
    return Vue.http.post(API_BASE_URL + '/' + playlistId + '/remove_track', params, { headers: { 'Authorization': $store.state.auth.token } })
  }
}
