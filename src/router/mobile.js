import Vue from 'vue'
import Router from 'vue-router'

import ProtectPage from '@/views/auth/protect_page'
import AddAttendee from '@/views/home/add_attendee'
import CreateAttendee from '@/views/home/create_attendee'

Vue.use(Router)

export function createMobileRouter () {
  let routes = [
    { path: '/protect', name: 'ProtectPage', component: ProtectPage },
    { path: '/x', name: 'AddAttendee', component: AddAttendee },
    { path: '/playlist', name: 'Playlist', component: CreateAttendee },
    { path: '*', redirect: '/protect' }
  ]

  return new Router({
    mode: 'history',
    routes: routes
  })
}
