import Vue from 'vue'
import Vuex from 'vuex'
import navigator from './modules/navigator'
import auth from './modules/auth'
import genre from './modules/genre'
import album from './modules/album'
import track from './modules/track'
import stream from './modules/stream'
import discover from './modules/discover'
import error from './modules/error'
import product from './modules/product'
import order from './modules/order'
import player from './modules/player'
import activity from './modules/activity'
import playlist from './modules/playlist'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  actions: {},
  getters: {},
  modules: {
    navigator,
    auth,
    genre,
    album,
    track,
    stream,
    discover,
    error,
    product,
    order,
    player,
    activity,
    playlist,
    user
  },
  plugins: []
})
