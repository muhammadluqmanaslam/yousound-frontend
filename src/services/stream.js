import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/streams'

export default {
  getStreams(params) {
    return Vue.http.get(`${API_BASE_URL}`, {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },

  getStreamsPublicUsers(params) {
    return Vue.http.get(`${API_BASE_URL}/public_user_streams`, {
      params: params,
    })
  },

  getStream(streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}`, {
      headers: { Authorization: $store.state.auth.token },
      params: {},
    })
  },

  getSpotlightStream(userId) {
    return Vue.http.get(`${API_BASE_URL}/spotlight_video`, {
      params: {user_id: userId},
    })
  },

  getSimilarStreams(streamId, params) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/similars`, {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },

  createStream(params) {
    return Vue.http.post(API_BASE_URL, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  updateStream(streamId, params) {
    return Vue.http.patch(`${API_BASE_URL}/${streamId}`, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  deleteStream(streamId) {
    return Vue.http.delete(`${API_BASE_URL}/${streamId}`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  archiveStream(streamId) {
    return Vue.http.post(
      `${API_BASE_URL}/${streamId}/archive`,
      {},
      {
        headers: { Authorization: $store.state.auth.token },
      }
    )
  },

  notifyStream(streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/notify`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  startStream(streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/start`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  stopStream(streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/stop`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  repostStream(streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/repost`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  canViewStream(streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/can_view`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  payViewStream(streamId, params) {
    return Vue.http.post(`${API_BASE_URL}/${streamId}/pay_view`, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  payAttachment(streamId, params) {
    return Vue.http.post(`${API_BASE_URL}/${streamId}/pay_attachment`, params, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  viewStream(streamId) {
    return Vue.http.get(`${API_BASE_URL}/${streamId}/view`, {
      headers: { Authorization: $store.state.auth.token },
    })
  },

  watchingStream: (streamId) =>
    Vue.http.get(`${API_BASE_URL}/${streamId}/watching`, {
      headers: { Authorization: $store.state.auth.token },
    }),
}
