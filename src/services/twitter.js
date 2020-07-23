import Vue from 'vue'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/twitter'

export default {
  getRequestToken(params) {
    return Vue.http.post(API_BASE_URL + '/request_token', params)
  },

  getAccessToken(params) {
    return Vue.http.post(API_BASE_URL + '/access_token', params)
  },

  getUserInfo(params) {
    return Vue.http.post(API_BASE_URL + '/user_info', params)
  },
}
