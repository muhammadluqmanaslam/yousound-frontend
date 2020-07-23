import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/shopping/addresses'

export default {
  getAddresses() {
    return Vue.http.get(API_BASE_URL, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  addAddress(params) {
    return Vue.http.post(API_BASE_URL, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  getAddress(addressId) {
    return Vue.http.get(API_BASE_URL + '/' + addressId, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  deleteAddress(addressId) {
    return Vue.http.delete(API_BASE_URL + '/' + addressId, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  updateAddress(addressId, params) {
    return Vue.http.patch(API_BASE_URL + '/' + addressId, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },
}
