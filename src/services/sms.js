import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = `${process.env.API_BASE_URL}/v2/sms`

const smsService = {
  sendSMS: (params) =>
    Vue.http.post(`${API_BASE_URL}/sms_send`, params, {
      headers: { Authorization: $store.state.auth.token },
    }),

  getSMS: (smsId) =>
    Vue.http.get(API_BASE_URL + '/' + smsId, {
      headers: { Authorization: $store.state.auth.token },
    }),

  deleteSMS: (smsId) =>
    Vue.http.delete(API_BASE_URL + '/' + smsId, {
      headers: { Authorization: $store.state.auth.token },
    }),

  updateSMS: (smsId) =>
    Vue.http.patch(API_BASE_URL + '/' + smsId, {
      headers: { Authorization: $store.state.auth.token },
    }),
}

export default smsService
