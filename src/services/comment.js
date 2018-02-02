import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/comments'

export default {
  getComments (commentableType, commentableId) {
    return Vue.http.get(API_BASE_URL + '?commentable_type=' + commentableType + '&commentable_id=' + commentableId, { headers: { 'Authorization': $store.state.auth.token } })
  },

  sendComment (params) {
    return Vue.http.post(API_BASE_URL, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  makePublicComment (commentId) {
    return Vue.http.get(API_BASE_URL + '/' + commentId + '/make_public', { headers: { 'Authorization': $store.state.auth.token } })
  },

  deleteComment (commentId) {
    return Vue.http.delete(API_BASE_URL + '/' + commentId, { headers: { 'Authorization': $store.state.auth.token } })
  },

  editMessage (commentId, params) {
    return Vue.http.patch(API_BASE_URL + '/' + commentId, params, { headers: { 'Authorization': $store.state.auth.token } })
  }
}
