import Vue from 'vue'
import Router from 'vue-router'

import EmptyPage from '@/views/home/empty'
import CreateAttendee from '@/views/home/create_attendee'

Vue.use(Router)

export function createMobileRouter () {
  let routes = [
    { path: '/empty', name: 'EmptyPage', component: EmptyPage },
    { path: '/playlist', name: 'Playlist', component: CreateAttendee },
    { path: '*', redirect: '/empty' }
  ]

  return new Router({
    mode: 'history',
    routes: routes
  })
}
