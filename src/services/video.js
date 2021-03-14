import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/videos'

export default {
  createVideo(params) {
    return Vue.http.post(API_BASE_URL, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  similarVideos(videoId) {
    return Vue.http.get(`${API_BASE_URL}/${videoId}/similars`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },
}
