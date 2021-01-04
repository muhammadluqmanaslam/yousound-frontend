import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = `${process.env.API_BASE_URL}/v1/invitations`

const InvitationService = {
  createInvitation() {
    return Vue.http.post(API_BASE_URL, null, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  findByToken(params) {
    return Vue.http.get(`${API_BASE_URL}/find_by_token`, {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },
}

export default InvitationService
