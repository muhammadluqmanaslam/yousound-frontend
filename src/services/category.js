import Vue from 'vue'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/shopping/categories'

export default {
  getCategories() {
    return Vue.http.get(API_BASE_URL)
  },
}
