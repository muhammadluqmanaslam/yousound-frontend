import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/shopping/products'

export default {
  getProducts (params) {
    return Vue.http.get(API_BASE_URL, { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  getProduct (productId) {
    return Vue.http.get(API_BASE_URL + '/' + productId, { headers: { 'Authorization': $store.state.auth.token } })
  },

  addProduct (params) {
    return Vue.http.post(API_BASE_URL, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  deleteProduct (productId) {
    return Vue.http.delete(API_BASE_URL + '/' + productId, { headers: { 'Authorization': $store.state.auth.token } })
  },

  updateProduct (productId, params) {
    return Vue.http.patch(API_BASE_URL + '/' + productId, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  releaseProduct (productId) {
    return Vue.http.get(API_BASE_URL + '/' + productId + '/release', { headers: { 'Authorization': $store.state.auth.token } })
  },

  repostProduct (productId) {
    return Vue.http.get(API_BASE_URL + '/' + productId + '/repost', { headers: { 'Authorization': $store.state.auth.token } })
  },

  searchProduct (params) {
    return Vue.http.post(API_BASE_URL + '/search', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  acceptCollaboration (productId) {
    return Vue.http.get(API_BASE_URL + '/' + productId + '/accept_collaboration', { headers: { 'Authorization': $store.state.auth.token } })
  },

  denyCollaboration (productId) {
    return Vue.http.get(API_BASE_URL + '/' + productId + '/deny_collaboration', { headers: { 'Authorization': $store.state.auth.token } })
  }
}
