import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/admin'

export default {
  getSignupUsers (params) {
    return Vue.http.get(API_BASE_URL + '/signup_users', { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  approveUser (params) {
    return Vue.http.post(API_BASE_URL + '/approve_user', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  denyUser (params) {
    return Vue.http.post(API_BASE_URL + '/deny_user', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  toggleLiveVideo (params) {
    return Vue.http.post(`${API_BASE_URL}/toggle_live_video`, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  toggleLiveVideoFree (params) {
    return Vue.http.post(`${API_BASE_URL}/toggle_live_video_free`, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  getAlbums (params) {
    return Vue.http.get(API_BASE_URL + '/albums', { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  getProducts (params) {
    return Vue.http.get(API_BASE_URL + '/products', { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  getGlobalStats (params) {
    return Vue.http.get(API_BASE_URL + '/global_stats', { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  getAttendees () {
    return Vue.http.get(`${API_BASE_URL}/attendees`, { headers: { 'Authorization': $store.state.auth.token } })
  }
}
