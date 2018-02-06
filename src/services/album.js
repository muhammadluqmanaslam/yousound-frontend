import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/albums'

export default {
  getAlbums (params) {
    return Vue.http.get(API_BASE_URL, { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  getAlbum (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId, { headers: { 'Authorization': $store.state.auth.token } })
  },

  createAlbum (params) {
    return Vue.http.post(API_BASE_URL, params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  releaseAlbum (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/release', { headers: { 'Authorization': $store.state.auth.token } })
  },

  myRole (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/my_role', { headers: { 'Authorization': $store.state.auth.token } })
  },

  repostAlbum (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/repost', { headers: { 'Authorization': $store.state.auth.token } })
  },

  acceptCollaboration (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/accept_collaboration', { headers: { 'Authorization': $store.state.auth.token } })
  },

  denyCollaboration (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/deny_collaboration', { headers: { 'Authorization': $store.state.auth.token } })
  },

  sendLabelRequest (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/send_label_request', { headers: { 'Authorization': $store.state.auth.token } })
  },

  removeLabel (albumId, params) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/remove_label', { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  acceptLabelRequest (albumId, params) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/accept_label_request', { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  denyLabelRequest (albumId, params) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/deny_label_request', { headers: { 'Authorization': $store.state.auth.token }, params: params })
  },

  makePublicAlbum (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/make_public', { headers: { 'Authorization': $store.state.auth.token } })
  },

  makePrivateAlbum (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/make_private', { headers: { 'Authorization': $store.state.auth.token } })
  },

  recommendAlbum (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/recommend', { headers: { 'Authorization': $store.state.auth.token } })
  },

  unrecommendAlbum (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/unrecommend', { headers: { 'Authorization': $store.state.auth.token } })
  },

  hideAlbum (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/hide', { headers: { 'Authorization': $store.state.auth.token } })
  },

  downloadAlbum (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/download', { headers: { 'Authorization': $store.state.auth.token } })
  },

  playAlbum (albumId) {
    return Vue.http.get(API_BASE_URL + '/' + albumId + '/play', { headers: { 'Authorization': $store.state.auth.token } })
  },

  rearrangeTracks (albumId, params) {
    return Vue.http.post(API_BASE_URL + '/' + albumId + '/rearrange', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  addTracks (albumId, params) {
    return Vue.http.post(API_BASE_URL + '/' + albumId + '/add_tracks', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  removeTracks (albumId, params) {
    return Vue.http.post(API_BASE_URL + '/' + albumId + '/remove_tracks', params, { headers: { 'Authorization': $store.state.auth.token } })
  },

  deleteAlbum (albumId) {
    return Vue.http.delete(API_BASE_URL + '/' + albumId, { headers: { 'Authorization': $store.state.auth.token } })
  },

  updateAlbum (albumId, params) {
    return Vue.http.patch(API_BASE_URL + '/' + albumId, params, { headers: { 'Authorization': $store.state.auth.token } })
  }
}
