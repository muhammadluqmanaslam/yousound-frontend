import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/auth'
const ACCESS_TOKEN_KEY = 'access_token'
const USER_INFO = 'user_info'
const USER_CREDENTIAL = 'user_credential'

export default {
  login (params) {
    return Vue.http.post(API_BASE_URL + '/sign_in', params)
  },

  registerAsListener (params) {
    return Vue.http.post(API_BASE_URL + '/sign_up_as_listener', params)
  },

  registerAsArtist (params) {
    return Vue.http.post(API_BASE_URL + '/sign_up_as_artist', params)
  },

  sendConfirmEmail (params) {
    return Vue.http.post(API_BASE_URL + '/send_confirm_email', params)
  },

  activeAccount (params) {
    return Vue.http.post(API_BASE_URL + '/confirm', params)
  },

  signinUrlForTwitter (params) {
    return Vue.http.post(API_BASE_URL + '/signin_url_for_twitter', params)
  },

  signinWithSocial (params) {
    return Vue.http.post(API_BASE_URL + '/signin_with_social', params)
  },

  checkTokenValidation (params) {
    return Vue.http.post(API_BASE_URL + '/token_validity', params)
  },

  requestResetPassword (params) {
    return Vue.http.post(API_BASE_URL + '/reset_password', params)
  },

  resetPassword (params) {
    return Vue.http.post(API_BASE_URL + '/set_password', params)
  },

  logout () {
    Vue.http.post(API_BASE_URL + '/sign_out', null, { headers: { 'Authorization': $store.state.auth.token } })
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(USER_INFO)
    $store.dispatch('auth/setToken', null)
    $store.dispatch('auth/setUser', null)
    $store.dispatch('auth/setFirstVisit', false)
    // this.$router.push({ path: '/login' })
  },

  isAuthenticated () {
    let token = this.getToken()
    if (token) {
      return true
    } else {
      return false
    }
  },

  setTokenAndUserInfo (token, user) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
    $store.dispatch('auth/setToken', token)
    this.setUser(user)
  },

  setUser (user) {
    localStorage.setItem(USER_INFO, JSON.stringify(user))
    $store.dispatch('auth/setUser', user)
  },

  getToken () {
    let token = localStorage.getItem(ACCESS_TOKEN_KEY)
    let user = JSON.parse(localStorage.getItem(USER_INFO))
    $store.dispatch('auth/setToken', token)
    $store.dispatch('auth/setUser', user)
    return token
  },

  saveCredential (credential) {
    localStorage.setItem(USER_CREDENTIAL, JSON.stringify(credential))
  },

  loadCredential () {
    let val = localStorage.getItem(USER_CREDENTIAL)
    if (val !== null) val = JSON.parse(val)
    return val
  }
}
