import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/tracks'

export default {
  uploadTrack(params) {
    return Vue.http.post(API_BASE_URL, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  deleteTrack(trackId) {
    return Vue.http.delete(API_BASE_URL + '/' + trackId, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  patchTrack(trackId, params) {
    return Vue.http.patch(API_BASE_URL + '/' + trackId, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  downloadTrack(trackId, params) {
    return Vue.http.get(`${API_BASE_URL}/${trackId}/download`, {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },

  playTrack(trackId) {
    return Vue.http.get(`${API_BASE_URL}/${trackId}/play`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },
}
