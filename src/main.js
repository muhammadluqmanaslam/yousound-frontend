// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import 'jquery'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import VueNumeric from 'vue-numeric'
import VeeValidate from 'vee-validate'
import VueClipboard from 'vue-clipboard2'
import SocialSharing from 'vue-social-sharing'
import { Filter } from './helper'

import '@/../static/styles/app.scss'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(Vuetify)
Vue.use(VueNumeric)
Vue.use(VeeValidate)
Vue.use(VueClipboard)
Vue.use(SocialSharing)

// Vue.filter('formatNumber', function (value) {
//   return numeral(value / 100).format('0.00') // displaying other groupings/separators is possible, look at the docs
// })

Vue.filter('formatDate', Filter.formatDate)
Vue.filter('formatNumber', Filter.formatNumber)
Vue.filter('formatFullUrl', Filter.formatFullUrl)
Vue.filter('capitalize', Filter.capitalize)

router.beforeEach((to, frm, next) => {
  // console.log('to', store.state.auth.secret_code, ',', to.path)
  if (/^\/(protect|_oauth|confirm)/.test(to.path) || store.state.auth.secret_code === process.env.SECRET_CODE) {
    next()
  } else {
    next('/protect')
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
