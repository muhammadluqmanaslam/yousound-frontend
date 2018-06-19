// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import 'jquery'
import App from './App'
import { createRouter } from './router'
// import { createMobileRouter } from './router/mobile'
import EmptyPage from '@/views/home/empty'
import store from './store'
import Vuetify from 'vuetify'
import VueNumeric from 'vue-numeric'
import VeeValidate from 'vee-validate'
import VueClipboard from 'vue-clipboard2'
import SocialSharing from 'vue-social-sharing'
import { directive as onClickOutside } from 'vue-on-click-outside'
import { Filter } from './helper'

import SettingService from './services/setting'
// import ActivityService from './services/activity'

import '@/../static/styles/app.scss'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(Vuetify)
Vue.use(VueNumeric)
Vue.use(VeeValidate)
Vue.use(VueClipboard)
Vue.use(SocialSharing)

Vue.directive('on-click-outside', onClickOutside)

// Vue.filter('formatNumber', function (value) {
//   return numeral(value / 100).format('0.00') // displaying other groupings/separators is possible, look at the docs
// })

Vue.filter('formatDate', Filter.formatDate)
Vue.filter('formatNumber', Filter.formatNumber)
Vue.filter('formatFullUrl', Filter.formatFullUrl)
Vue.filter('timeInHours', Filter.timeInHours)
Vue.filter('capitalize', Filter.capitalize)

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   store,
//   template: '<App/>',
//   components: { App }
// })

// function createApp () {
//   const router = createRouter()
//   router.beforeEach((to, frm, next) => {
//     // console.log('to', store.state.auth.secret_code, ',', to.path)
//     if (/^\/(protect|_oauth|confirm|reset_password)/.test(to.path) || store.state.auth.secret_code === process.env.SECRET_CODE) {
//       next()
//     } else {
//       next('/protect')
//     }
//   })
//   const app = new Vue({
//     // el: '#app',
//     router,
//     store,
//     template: '<App/>',
//     components: { App }
//   })
//   return { app, router }
// }

const isMobileBrowser = navigator.userAgent.match(/android|blackberry|iphone|ipad|ipod|iemobile|mobile|webos/i) !== null

if (isMobileBrowser) {
  const app = new Vue({
    template: '<EmptyPage/>',
    components: { EmptyPage }
  })
  app.$mount('#app')
} else {
  SettingService.getSettings().then(response => {
    const settings = response.body
    const router = createRouter(settings)
    router.beforeEach((to, frm, next) => {
      if (/^\/(protect|_oauth|confirm|reset_password)/.test(to.path) || store.state.auth.secret_code === process.env.SECRET_CODE) {
        next()
      } else {
        next('/protect')
      }
    })
    const app = new Vue({
      router,
      store,
      template: '<App/>',
      components: { App }
    })
    app.$mount('#app')
  })
}
