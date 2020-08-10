import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = `${process.env.API_BASE_URL}/v1/me`

const MeService = {
  stripeEmail: () =>
    Vue.http.get(`${API_BASE_URL}/stripe_email`, {
      headers: {
        Authorization: $store.state.auth.token,
      },
    }),

  mutualUsers: (params) =>
    Vue.http.post(`${API_BASE_URL}/mutual_users`, params, {
      headers: {
        Authorization: $store.state.auth.token,
      },
    }),
}

export default MeService
