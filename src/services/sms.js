import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v2/sms'

export default {
  sendSMS(params) {
    return Vue.http.post(API_BASE_URL + '/sms_send', params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

}
