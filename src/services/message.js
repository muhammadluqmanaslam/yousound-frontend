import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/messages'

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

  hasPendingRepost(params) {
    return Vue.http.post(API_BASE_URL + '/has_pending_repost', params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  removeRepost(id) {
    return Vue.http.get(`${API_BASE_URL}/${id}/remove_repost_request`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  acceptRepost(id) {
    return Vue.http.get(API_BASE_URL + '/' + id + '/accept_repost', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  denyRepost(id) {
    return Vue.http.get(API_BASE_URL + '/' + id + '/deny_repost', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  acceptRepostOnFree(id) {
    return Vue.http.get(API_BASE_URL + '/' + id + '/accept_repost_on_free', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  getMessages(params) {
    return Vue.http.get(API_BASE_URL, {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },

  addMessage(params) {
    return Vue.http.post(API_BASE_URL, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  deleteMessage(messageId) {
    return Vue.http.delete(API_BASE_URL + '/' + messageId, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  getMessage(messageId) {
    return Vue.http.get(API_BASE_URL + '/' + messageId, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  editMessage(messageId, params) {
    return Vue.http.patch(API_BASE_URL + '/' + messageId, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },
}
