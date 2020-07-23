import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/conversations'

export default {
  getConversations(params) {
    return Vue.http.get(API_BASE_URL + '/conversations', {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },

  deleteConversation(params) {
    return Vue.http.post(API_BASE_URL + '/delete_conversation', params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },
}
