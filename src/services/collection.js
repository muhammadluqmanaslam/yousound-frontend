import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/collections'

export default {
  getCollections() {
    return Vue.http.get(API_BASE_URL + '/',
      { headers: { Authorization: $store.state.auth.token } }
    )
  },

  createCollection(params) {
    return Vue.http.post(API_BASE_URL + '/', params,
      { headers: { Authorization: $store.state.auth.token } }
    )
  },

}
