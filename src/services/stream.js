import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/streams'

export default {
  getStreams (params) {
    return Vue.http.get(`${API_BASE_URL}`, { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

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

  notifyStream (streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/notify`, { headers: { 'Authorization': $store.state.auth.token } })
  },

  startStream (streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/start`, { headers: { 'Authorization': $store.state.auth.token } })
  },

  stopStream (streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/stop`, { headers: { 'Authorization': $store.state.auth.token } })
  },

  repostStream (streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/repost`, { headers: { 'Authorization': $store.state.auth.token } })
  },

  canViewStream (streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/can_view`, { headers: { 'Authorization': $store.state.auth.token } })
  },

  payViewStream (streamId, params) {
    return Vue.http.post(`${API_BASE_URL}/${streamId}/pay_view`, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  viewStream (streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/view`, { headers: { 'Authorization': $store.state.auth.token } })
  }
}
