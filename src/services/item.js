import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/shopping/items'

export default {
  orderItems (params) {
    return Vue.http.post(API_BASE_URL + '/buy', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  getShoppingCartItems () {
    return Vue.http.get(API_BASE_URL, { headers: { 'Authorization': $store.state.auth.token } })
  },

  addToCart (params) {
    return Vue.http.post(API_BASE_URL, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  getCartItem (itemId) {
    return Vue.http.get(API_BASE_URL + '/' + itemId, { headers: { 'Authorization': $store.state.auth.token } })
  },

  deleteCartItem (itemId) {
    return Vue.http.delete(API_BASE_URL + '/' + itemId, { headers: { 'Authorization': $store.state.auth.token } })
  },

  updateCartItem (itemId, params) {
    return Vue.http.patch(API_BASE_URL + '/' + itemId, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  markShipped (itemId) {
    return Vue.http.get(API_BASE_URL + '/' + itemId + '/mark_as_shipped', { headers: { 'Authorization': $store.state.auth.token } })
  },

  markUnshipped (itemId) {
    return Vue.http.get(API_BASE_URL + '/' + itemId + '/mark_as_unshipped', { headers: { 'Authorization': $store.state.auth.token } })
  },

  calculateCost (params) {
    return Vue.http.get(API_BASE_URL + '/calculate_cost', { headers: { 'Authorization': $store.state.auth.token }, params: params })
  }
}
