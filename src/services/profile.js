import Vue from 'vue'
import $store from '@/store'
import VueCache from '@/services/cache'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/profile'

let cache = new VueCache('profile', { expiration: 60 })

export default {
  initCache() {
    Vue.http.interceptors.push((req) => {
      if (req.fresh) cache.del(req.url)
      if (req.url.startsWith(API_BASE_URL)) {
        var valid = cache.get(req.url)
        if (valid) {
          return req.respondWith(valid, {
            status: 200,
            statusText: 'OK',
          })
        } // if nothing is returned, continue
      }

      return (res) => {
        if (res && res.status === 200 && res.url.startsWith(API_BASE_URL)) {
          cache.set(res.url, res.body)
        }
        return res
      }
    })
  },

  getAlbums(userId, params) {
    return Vue.http.post(API_BASE_URL + '/' + userId + '/songs', params)
  },

  getMerch(userId, params) {
    return Vue.http.post(API_BASE_URL + '/' + userId + '/merch', params)
  },

  getDownloaded(userId, params) {
    return Vue.http.post(API_BASE_URL + '/' + userId + '/downloaded', params)
  },

  getReposted(userId, params) {
    return Vue.http.post(API_BASE_URL + '/' + userId + '/reposted', params)
  },

  getPlaylists(userId, params) {
    return Vue.http.post(API_BASE_URL + '/' + userId + '/playlists', params)
  },

  getSampleFollowings(userId, params) {
    return Vue.http.post(`${API_BASE_URL}/${userId}/sample_followings`, params)
  },

  getFollowings(userId, params) {
    return Vue.http.post(API_BASE_URL + '/' + userId + '/followings', params)
  },

  getFollowers(userId, params) {
    return Vue.http.post(API_BASE_URL + '/' + userId + '/followers', params)
  },

  getItems(userId, type, params) {
    if ($store.state.auth.user) {
      return Vue.http.post(API_BASE_URL + '/' + userId + '/' + type, params, {
        headers: { Authorization: $store.state.auth.token },
      })
    } else {
      return Vue.http.post(API_BASE_URL + '/' + userId + '/' + type, params)
    }
  },
}
