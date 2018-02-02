import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/profile/'

export default {
  getAlbums (userId, params) {
    return Vue.http.post(API_BASE_URL + userId + '/songs', params)
  },

  getMerch (userId, params) {
    return Vue.http.post(API_BASE_URL + userId + '/merch', params)
  },

  getDownloaded (userId, params) {
    return Vue.http.post(API_BASE_URL + userId + '/downloaded', params)
  },

  getReposted (userId, params) {
    return Vue.http.post(API_BASE_URL + userId + '/reposted', params)
  },

  getPlaylists (userId, params) {
    return Vue.http.post(API_BASE_URL + userId + '/playlists', params)
  },

  getFollowings (userId, params) {
    return Vue.http.post(API_BASE_URL + userId + '/followings', params)
  },

  getFollowers (userId, params) {
    return Vue.http.post(API_BASE_URL + userId + '/followers', params)
  },

  getItems (userId, type, params) {
    if ($store.state.auth.user) {
      return Vue.http.post(API_BASE_URL + userId + '/' + type, params, { headers: { 'Authorization': $store.state.auth.token } })
    } else {
      return Vue.http.post(API_BASE_URL + userId + '/' + type, params)
    }
  }
}
