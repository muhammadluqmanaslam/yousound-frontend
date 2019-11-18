import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/shopping/orders'

export default {
  getOrders (params) {
    return Vue.http.get(API_BASE_URL, { params: params, headers: { 'Authorization': $store.state.auth.token } })
  },

  getSentOrders (params) {
    return Vue.http.get(API_BASE_URL + '/sent', { params: params, headers: { 'Authorization': $store.state.auth.token } })
  },

  getReceivedOrders (params) {
    return Vue.http.get(API_BASE_URL + '/received', { params: params, headers: { 'Authorization': $store.state.auth.token } })
  },

  receivedExport (params) {
    return Vue.http.get(`${API_BASE_URL}/received_export`, { params: params, headers: { 'Authorization': $store.state.auth.token } })
  },

  getOrder (orderId) {
    return Vue.http.get(API_BASE_URL + '/' + orderId, { headers: { 'Authorization': $store.state.auth.token } })
  },

  hideMyAddress (orderId) {
    return Vue.http.get(`${process.env.API_BASE_URL}/v1/shopping/orders/${orderId}/hide_customer_address`, { headers: { 'Authorization': $store.state.auth.token } })
  }
}
