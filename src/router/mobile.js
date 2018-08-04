import Vue from 'vue'
import Router from 'vue-router'

import EmptyPage from '@/views/home/empty'
import Playlist from '@/views/home/playlist'

Vue.use(Router)

export function createMobileRouter () {
  let routes = [
    { path: '/empty', name: 'EmptyPage', component: EmptyPage },
    { path: '/playlist', name: 'Playlist', component: Playlist },
    { path: '*', redirect: '/empty' }
  ]

  return new Router({
    mode: 'history',
    routes: routes
  })
}
