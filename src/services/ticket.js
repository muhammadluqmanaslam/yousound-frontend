import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/tickets'

export default {
  createTicket (params) {
    return Vue.http.post(API_BASE_URL, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  updateTicket (ticketId, params) {
    return Vue.http.patch(`${API_BASE_URL}/${ticketId}`, params, { headers: { 'Authorization': $store.state.auth.token } })
  }
}
