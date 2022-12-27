import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/auth'
const ACCESS_TOKEN_KEY = 'access_token'
const USER_INFO = 'user_info'
const USER_CREDENTIAL = 'user_credential'
const USER_HMAC = 'user_hmac'

export default {
  login(params) {
    return Vue.http.post(API_BASE_URL + '/sign_in', params)
  },

  registerAsListener(params) {
    localStorage.setItem("user_email", params.get("user[email]"))
    localStorage.setItem("user_pass", params.get("user[password]"))
    return Vue.http.post(API_BASE_URL + '/sign_up_as_listener', params)
  },

  registerAsArtist(params) {
    return Vue.http.post(API_BASE_URL + '/sign_up_as_artist', params)
  },

  sendConfirmEmail(params) {
    return Vue.http.post(API_BASE_URL + '/send_confirm_email', params)
  },

  activeAccount(params) {
    return Vue.http.post(API_BASE_URL + '/confirm', params)
  },

  signinUrlForTwitter(params) {
    return Vue.http.post(API_BASE_URL + '/signin_url_for_twitter', params)
  },

  signinWithSocial(params) {
    return Vue.http.post(API_BASE_URL + '/signin_with_social', params)
  },

  isUsernameAvailable(params) {
    return Vue.http.post(API_BASE_URL + '/is_username_available', params)
  },

  isEmailAvailable(params) {
    return Vue.http.post(API_BASE_URL + '/is_email_available', params)
  },

  checkTokenValidation() {
    const params = {
      auth_token: localStorage.getItem(ACCESS_TOKEN_KEY),
    }
    return Vue.http.post(API_BASE_URL + '/token_validity', params)
  },

  requestResetPassword(params) {
    return Vue.http.post(API_BASE_URL + '/reset_password', params)
  },

  resetPassword(params) {
    return Vue.http.post(API_BASE_URL + '/set_password', params)
  },

  signout() {
    Vue.http.post(API_BASE_URL + '/sign_out', null, {
      headers: { Authorization: $store.state.auth.token },
    })
    this.clearTokenAndUserInfo()
  },

  clearTokenAndUserInfo() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(USER_HMAC)
    localStorage.removeItem(USER_INFO)
    $store.dispatch('auth/setToken', null)
    $store.dispatch('auth/setHMAC', null)
    $store.dispatch('auth/setUser', null)
    $store.dispatch('auth/setFirstVisit', false)
  },

  isAuthenticated() {
    let token = this.getToken() || null

    if (token) {
      return true
    } else {
      return false
    }
  },

  setTokenAndUserInfo(user) {
    localStorage.setItem(ACCESS_TOKEN_KEY, user.token)
    $store.dispatch('auth/setToken', user.token)
    // localStorage.setItem(USER_HMAC, user.hmac)
    // $store.dispatch('auth/setHMAC', user.hmac)
    this.setUser(user)
  },

  setUser(user) {
    localStorage.setItem(USER_INFO, JSON.stringify(user))
    $store.dispatch('auth/setUser', user)

    if (user.hmac) {
      localStorage.setItem(USER_HMAC, user.hmac)
      $store.dispatch('auth/setHMAC', user.hmac)
    }
  },

  getToken() {
    let token = localStorage.getItem(ACCESS_TOKEN_KEY)
    let user = JSON.parse(localStorage.getItem(USER_INFO))
    $store.dispatch('auth/setToken', token)
    $store.dispatch('auth/setUser', user)
    return token || null
  },

  saveCredential(credential) {
    localStorage.setItem(USER_CREDENTIAL, JSON.stringify(credential))
  },

  loadCredential() {
    let val = localStorage.getItem(USER_CREDENTIAL)
    if (val !== null) val = JSON.parse(val)
    return val
  },
}
