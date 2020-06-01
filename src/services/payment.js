import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/payments'

export default {
  refundMoney (paymentId, params) {
    return Vue.http.post(`${process.env.API_BASE_URL}/v1/payments/${paymentId}/refund`, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  refundOrder (paymentId, params) {
    return Vue.http.post(`${process.env.API_BASE_URL}/v1/payments/${paymentId}/refund_order`, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  makeDeposit (params) {
    return Vue.http.post(API_BASE_URL + '/deposit', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  withdrawMoney (params) {
    return Vue.http.post(API_BASE_URL + '/withdraw', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  getAllPayments (params) {
    return Vue.http.get(API_BASE_URL, { params: params, headers: { 'Authorization': $store.state.auth.token } })
  },

  getSentPayments (params) {
    return Vue.http.get(API_BASE_URL + '/sent', { params: params, headers: { 'Authorization': $store.state.auth.token } })
  },

  getReceivedPayments (params) {
    return Vue.http.get(API_BASE_URL + '/received', { params: params, headers: { 'Authorization': $store.state.auth.token } })
  },

  hasTransactionInPeriod () {
    return Vue.http.get(API_BASE_URL + '/has_transaction_in_period', { headers: { 'Authorization': $store.state.auth.token } })
  }
}
