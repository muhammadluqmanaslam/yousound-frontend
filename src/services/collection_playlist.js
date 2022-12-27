import Vue from 'vue'
import $store from '@/store'

const API_BASE_URL = process.env.API_BASE_URL + '/v1/collection_playlists'

export default {
  getCollectionPlaylists() {
    return Vue.http.get(API_BASE_URL + '/',
      { headers: { Authorization: $store.state.auth.token } }
    )
  },

  createCollectionPlaylist(params) {
    return Vue.http.post(API_BASE_URL + '/', params,
      { headers: { Authorization: $store.state.auth.token } }
    )
  },

  getPlaylistDetails(params) {
    return Vue.http.get(API_BASE_URL + '/fetch_playlist_details', {
      headers: { Authorization: $store.state.auth.token },
      params: params,
    })
  },

}
