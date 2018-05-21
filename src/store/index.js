import Vue from 'vue'
import Vuex from 'vuex'
import activity from './modules/activity'
import album from './modules/album'
import app from './modules/app'
import auth from './modules/auth'
import discover from './modules/discover'
import error from './modules/error'
import genre from './modules/genre'
import navigator from './modules/navigator'
import order from './modules/order'
import player from './modules/player'
import playlist from './modules/playlist'
import product from './modules/product'
import stream from './modules/stream'
import track from './modules/track'
import user from './modules/user'
import videoPlayer from './modules/video_player'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  actions: {},
  getters: {},
  modules: {
    activity,
    album,
    app,
    auth,
    discover,
    genre,
    error,
    navigator,
    order,
    player,
    playlist,
    product,
    stream,
    track,
    user,
    videoPlayer
  },
  plugins: []
})
