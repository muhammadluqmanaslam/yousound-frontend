import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/label'

export default {
  getLabelUsers(params) {
    return Vue.http.get(API_BASE_URL + '/label_users', {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },

  getLabelAlbums(params) {
    return Vue.http.get(API_BASE_URL + '/label_albums', {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },
}
