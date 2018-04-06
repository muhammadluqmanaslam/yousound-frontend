import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/users'

export default {
  getUsers (params) {
    return Vue.http.get(API_BASE_URL, { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  searchUsers (params) {
    return Vue.http.get(API_BASE_URL + '/search', { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  getUserInfo (userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/info', { headers: { 'Authorization': $store.state.auth.token } })
  },

  updateUserInfo (userId, params) {
    return Vue.http.patch(API_BASE_URL + '/' + userId, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  deleteUser (userId) {
    return Vue.http.delete(API_BASE_URL + '/' + userId, { headers: { 'Authorization': $store.state.auth.token } })
  },

  setRepostPrice (userId, params) {
    return Vue.http.post(API_BASE_URL + '/' + userId + '/set_repost_price', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  changePassword (userId, params) {
    return Vue.http.post(API_BASE_URL + '/' + userId + '/change_password', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  connectStripe (userId, params) {
    return Vue.http.post(API_BASE_URL + '/' + userId + '/connect_stripe', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  disconnectStripe (userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/disconnect_stripe', { headers: { 'Authorization': $store.state.auth.token } })
  },

  donateMoney (userId, params) {
    return Vue.http.post(API_BASE_URL + '/' + userId + '/donate', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  followUser (userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/follow', { headers: { 'Authorization': $store.state.auth.token } })
  },

  unfollowUser (userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/unfollow', { headers: { 'Authorization': $store.state.auth.token } })
  },

  blockUser (userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/block', { headers: { 'Authorization': $store.state.auth.token } })
  },

  unblockUser (userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/unblock', { headers: { 'Authorization': $store.state.auth.token } })
  },

  favoriteUser (userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/favorite', { headers: { 'Authorization': $store.state.auth.token } })
  },

  unfavoriteUser (userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/unfavorite', { headers: { 'Authorization': $store.state.auth.token } })
  },

  hiddenUserGenres (userId, params) {
    return Vue.http.post(API_BASE_URL + '/' + userId + '/hidden_genres', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  sendLabelRequest (userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/send_label_request', { headers: { 'Authorization': $store.state.auth.token } })
  },

  removeLabel (userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/remove_label', { headers: { 'Authorization': $store.state.auth.token } })
  },

  acceptLabelRequest (userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/accept_label_request', { headers: { 'Authorization': $store.state.auth.token } })
  },

  denyLabelRequest (userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/deny_label_request', { headers: { 'Authorization': $store.state.auth.token } })
  },

  updateUserStatus (userId, params) {
    // status : inactive, active, pending, suspended, verified
    return Vue.http.post(API_BASE_URL + '/' + userId + '/update_status', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  updateUserRole (userId, params) {
    // role: admin, moderator, artist, listener
    return Vue.http.post(API_BASE_URL + '/' + userId + '/update_role', params, { headers: { 'Authorization': $store.state.auth.token } })
  }
}
