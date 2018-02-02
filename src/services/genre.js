import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL_V1 = process.env.API_BASE_URL + '/v1/genres'
const API_BASE_URL_V2 = process.env.API_BASE_URL + '/v2/genres'

export default {
  getGenres2 () {
    return Vue.http.get(API_BASE_URL_V2)
  },

  addGenre2 (params) {
    return Vue.http.post(API_BASE_URL_V2, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  deleteGenres2 (genreId) {
    return Vue.http.delete(`${API_BASE_URL_V2}/${genreId}`, { headers: { 'Authorization': $store.state.auth.token } })
  },

  updateGenre2 (genreId, params) {
    return Vue.http.patch(`${API_BASE_URL_V2}/${genreId}`, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  getGenres () {
    return Vue.http.get(API_BASE_URL_V1)
  }
}
