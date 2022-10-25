import Vue from 'vue'
import $store from '@/store'
import VueCache from '@/services/cache'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/users'

let cache = new VueCache('users', { expiration: 150 })

export default {
  initCache() {
    Vue.http.interceptors.push((req) => {
      if (req.fresh) cache.del(req.url)
      if (req.url.startsWith(API_BASE_URL) && req.method === 'GET') {
        var valid = cache.get(req.url)
        if (valid) {
          return req.respondWith(valid, {
            status: 200,
            statusText: 'OK',
          })
        } // if nothing is returned, continue
      }

      return (res) => {
        if (res && res.status === 200 && res.url.startsWith(API_BASE_URL)) {
          cache.set(res.url, res.body)
        }
        return res
      }
    })
  },

  getUsers(params) {
    return Vue.http.get(API_BASE_URL, {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },

  searchUsers(params) {
    return Vue.http.get(API_BASE_URL + '/search', {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },

  getUserInfo(userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/info', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  creatorReRequest(userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/creator_re_request', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  uploadStreamLimit(userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/stream_uploaded_limit_available', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  updateUserInfo(userId, params) {
    return Vue.http.patch(API_BASE_URL + '/' + userId, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  changeCreatorRoleIntoListener(params) {
    return Vue.http.get(API_BASE_URL + '/change_creator_role_into_listener', {
      params: params,
    })
  },

  deleteUser(userId) {
    return Vue.http.delete(API_BASE_URL + '/' + userId, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  getSubscriptionDetail(userId) {
    return Vue.http.get(`${API_BASE_URL}/${userId}/fetch_subscription_details`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  getRepostPriceProration(userId, params) {
    return Vue.http.get(`${API_BASE_URL}/${userId}/repost_price_proration`, {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },

  setRepostPrice(userId, params) {
    return Vue.http.post(
      API_BASE_URL + '/' + userId + '/set_repost_price',
      params,
      { headers: { Authorization: $store.state.auth.token } }
    )
  },

  changePassword(userId, params) {
    return Vue.http.post(
      API_BASE_URL + '/' + userId + '/change_password',
      params,
      { headers: { Authorization: $store.state.auth.token } }
    )
  },

  checkStripeConnection(userId) {
    return Vue.http.get(`${API_BASE_URL}/${userId}/check_stripe_connection`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  donateMoney(userId, params) {
    return Vue.http.post(API_BASE_URL + '/' + userId + '/donate', params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  addVideoCredit(userId, params) {
    return Vue.http.post(`${API_BASE_URL}/${userId}/video_credit`, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  inviteUser(userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/invite', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  repostedFeeds(userId) {
    return Vue.http.get(`${API_BASE_URL}/${userId}/reposted_feeds`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  cartItems(userId) {
    return Vue.http.get(`${API_BASE_URL}/${userId}/cart_items`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  followUser(userId, params) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/follow', {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },

  unfollowUser(userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/unfollow', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  blockUser(userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/block', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  unblockUser(userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/unblock', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  favoriteUser(userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/favorite', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  unfavoriteUser(userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/unfavorite', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  hiddenUserGenres(userId, params) {
    return Vue.http.post(
      API_BASE_URL + '/' + userId + '/hidden_genres',
      params,
      { headers: { Authorization: $store.state.auth.token } }
    )
  },

  sendLabelRequest(userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/send_label_request', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  removeLabel(userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/remove_label', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  acceptLabelRequest(userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/accept_label_request', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  denyLabelRequest(userId) {
    return Vue.http.get(API_BASE_URL + '/' + userId + '/deny_label_request', {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  updateUserStatus(userId, params) {
    // status : inactive, active, pending, suspended, verified
    return Vue.http.post(
      API_BASE_URL + '/' + userId + '/update_status',
      params,
      { headers: { Authorization: $store.state.auth.token } }
    )
  },

  updateUserRole(userId, params) {
    // role: admin, moderator, artist, listener
    return Vue.http.post(API_BASE_URL + '/' + userId + '/update_role', params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },
}
