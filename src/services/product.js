import Vue from 'vue'
import $store from '@/store'
import VueCache from '@/services/cache'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/shopping/products'

let cache = new VueCache('products', {expiration: 150})

export default {
  initCache () {
    Vue.http.interceptors.push((req) => {
      if (req.fresh) cache.del(req.url)
      if (req.url.startsWith(API_BASE_URL) && req.method === 'GET') {
        var valid = cache.get(req.url)
        if (valid) {
          return req.respondWith(valid, {
            status: 200,
            statusText: 'OK'
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

  hideProduct (productId) {
    return Vue.http.get(`${API_BASE_URL}/${productId}/hide`, { headers: { 'Authorization': $store.state.auth.token } })
  },

  searchProduct (params) {
    return Vue.http.post(API_BASE_URL + '/search', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  acceptCollaboration (productId) {
    return Vue.http.get(API_BASE_URL + '/' + productId + '/accept_collaboration', { headers: { 'Authorization': $store.state.auth.token } })
  },

  denyCollaboration (productId) {
    return Vue.http.get(API_BASE_URL + '/' + productId + '/deny_collaboration', { headers: { 'Authorization': $store.state.auth.token } })
  },

  orderedItems (productId, params) {
    return Vue.http.get(`${API_BASE_URL}/${productId}/ordered_items`, { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  tickets (productId, params) {
    return Vue.http.get(`${API_BASE_URL}/${productId}/tickets`, { headers: { 'Authorization': $store.state.auth.token }, params: params })
  }
}
