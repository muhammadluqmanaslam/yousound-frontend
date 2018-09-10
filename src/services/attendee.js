import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/attendees'

export default {
  getAttendees (params) {
    return Vue.http.get(API_BASE_URL, { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  createAttendee (params) {
    return Vue.http.post(API_BASE_URL, params)
  },

  findByToken (params) {
    return Vue.http.get(`${API_BASE_URL}/find_by_token`, { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  inviteAttendee (attendeeId) {
    return Vue.http.get(`${API_BASE_URL}/${attendeeId}/invite`, { headers: { 'Authorization': $store.state.auth.token } })
  }
}
