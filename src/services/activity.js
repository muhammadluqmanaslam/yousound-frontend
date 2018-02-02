import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/activities'

export default {
  getActivities (page, perPage) {
    return Vue.http.get(API_BASE_URL + '?page=' + page + '&per_page=' + perPage, { headers: { 'Authorization': $store.state.auth.token } })
  },

  getUnread () {
    return Vue.http.get(API_BASE_URL + '/unread', { headers: { 'Authorization': $store.state.auth.token } })
  },

  makeRead (type) {
    return Vue.http.get(API_BASE_URL + '/read?module_type=' + type, { headers: { 'Authorization': $store.state.auth.token } })
  }
}
