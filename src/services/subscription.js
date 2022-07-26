import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v2/subscription'

export default {
  createSubscription(params) {
    return Vue.http.post(API_BASE_URL, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

}
