import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v2/subscription'
const API_BASE_URL2 = process.env.API_BASE_URL + '/v1/users'

export default {
  createSubscription(params) {
    const auth_token = $store.state.auth.token;
    if (auth_token != null) {
      return Vue.http.post(API_BASE_URL, params, {
        headers: { Authorization: $store.state.auth.token },
      })
    } else {
      const id = $store.state.app.onboarding.username;
      return Vue.http.get(`${API_BASE_URL2}/${id}/creator_subscription`, {
        params: params,
      })
    }
  },

  freeAccountCredit(params) {
    return Vue.http.get(`${API_BASE_URL}/free_account_credit`, {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },

  deactivateSubscription() {
    return Vue.http.get(`${API_BASE_URL}/deactivate_subscription`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  subscriptionChange(params) {
    return Vue.http.get(`${API_BASE_URL}/subscription_change`, {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },
}
