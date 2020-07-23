import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/presets'

export default {
  getPresets() {
    return Vue.http.get(API_BASE_URL, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  createPreset(params) {
    return Vue.http.post(API_BASE_URL, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  loadPreset(presetId) {
    return Vue.http.get(`${API_BASE_URL}/${presetId}/load`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  deletePreset(presetId) {
    return Vue.http.delete(`${API_BASE_URL}/${presetId}`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },
}
