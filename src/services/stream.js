import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/streams'

export default {
  getStream (streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}`, { headers: { 'Authorization': $store.state.auth.token }, params: {} })
  },

  createStream (params) {
    return Vue.http.post(API_BASE_URL, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  updateStream (streamId, params) {
    return Vue.http.patch(`${API_BASE_URL}/${streamId}`, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  deleteStream (streamId) {
    return Vue.http.delete(`${API_BASE_URL}/${streamId}`, { headers: { 'Authorization': $store.state.auth.token } })
  },

  startStream (streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/start`, { headers: { 'Authorization': $store.state.auth.token } })
  },

  stopStream (streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/stop`, { headers: { 'Authorization': $store.state.auth.token } })
  },

  repostStream (streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/repost`, { headers: { 'Authorization': $store.state.auth.token } })
  }
}
