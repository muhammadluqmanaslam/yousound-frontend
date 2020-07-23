import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/settings'

export default {
  getSettings() {
    return Vue.http.get(API_BASE_URL)
  },

  updateSetting(params) {
    return Vue.http.post(API_BASE_URL, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },
}
