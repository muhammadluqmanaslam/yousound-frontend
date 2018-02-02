import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL_V1 = process.env.API_BASE_URL + '/v1/search'
const API_BASE_URL_V2 = process.env.API_BASE_URL + '/v2/search'

export default {
  searchStream (params) {
    return Vue.http.post(API_BASE_URL_V1 + '/search_stream', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  // searchStreamV2 (params) {
  //   return Vue.http.post(API_BASE_URL_V1 + '/search_stream_v2', params, { headers: { 'Authorization': $store.state.auth.token } })
  // },

  searchStreamV2 (params) {
    return Vue.http.post(API_BASE_URL_V2 + '/search_stream', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  searchDiscover (params) {
    return Vue.http.post(API_BASE_URL_V1 + '/search_discover', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  searchGlobal (params) {
    return Vue.http.post(API_BASE_URL_V1 + '/search_global', params, { headers: { 'Authorization': $store.state.auth.token } })
  }
}
