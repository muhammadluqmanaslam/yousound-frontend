import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/trackings'

export default {
  createPlayRecord(params) {
    return Vue.http.post(API_BASE_URL, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  getDashboardStats() {
    return Vue.http.get(API_BASE_URL + '/dashboard_stats', {
      headers: { Authorization: $store.state.auth.token },
    })
  },
}
