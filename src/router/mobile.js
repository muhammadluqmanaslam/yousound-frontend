import Vue from 'vue'
import Router from 'vue-router'

import ProtectPage from '@/views/auth/protect_page'
// import AddAttendee from '@/views/home/add_attendee'
import CreateAttendee from '@/views/home/create_attendee'
import AlbumShow from '@/views/mobile/album/show'
import LandingPage from '@/views/mobile/dashboard/landing'

Vue.use(Router)

export function createMobileRouter () {
  let routes = [
    { path: '/', name: 'LandingPage', component: LandingPage },
    { path: '/protect', name: 'ProtectPage', component: ProtectPage },
    // { path: '/x', name: 'AddAttendee', component: AddAttendee },
    { path: '/playlist', name: 'Playlist', component: CreateAttendee },
    { path: '/album/:slug', name: 'AlbumShow', component: AlbumShow },
    { path: '*', redirect: '/' }
  ]

  return new Router({
    mode: 'history',
    routes: routes
  })
}
