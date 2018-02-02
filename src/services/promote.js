import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/promote'

export default {
  searchUsers (params) {
    return Vue.http.post(API_BASE_URL + '/search_users', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  calculateSuggestedReposters (params) {
    return Vue.http.post(API_BASE_URL + '/calculate_on_suggested_reposters', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  calculateCurrentReposters (params) {
    return Vue.http.post(API_BASE_URL + '/calculate_on_current_reposters', params, { headers: { 'Authorization': $store.state.auth.token } })
  }
}
