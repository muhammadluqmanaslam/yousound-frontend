// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueIntercom from 'vue-intercom'
import 'jquery'
import App from './App'
import { createRouter } from './router'
import { createMobileRouter } from './router/mobile'
import BrowserPage from '@/views/home/browser'
import store from './store'
import Vuetify from 'vuetify'
import VueNumeric from 'vue-numeric'
import VueClipboard from 'vue-clipboard2'
import VueHead from 'vue-head'
import VeeValidate from 'vee-validate'
import SocialSharing from 'vue-social-sharing'
import VueLazyload from 'vue-lazyload'

import 'fullpage.js/vendors/scrolloverflow' // Optional. When using scrollOverflow:true
// import 'fullpage.scrollHorizontally.min' // Optional. When using fullpage extensions
import 'fullpage.js/dist/fullpage.css'
import VueFullPage from 'vue-fullpage.js'

import { directive as onClickOutside } from 'vue-on-click-outside'
import { Filter } from './helper'

import SettingService from './services/setting'
// import UserService from '@/services/user'
// import AlbumService from '@/services/album'
// import ProductService from '@/services/product'
// import ProfileService from '@/services/profile'
// import ActivityService from './services/activity'

import '@/../static/styles/app.scss'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(VueIntercom, { appId: process.env.INTERCOM_APP_ID })
Vue.use(Vuetify)
Vue.use(VueNumeric)
Vue.use(VueClipboard)
Vue.use(VueHead)
Vue.use(SocialSharing)
Vue.use(VueLazyload)
Vue.use(VueFullPage)

const dictionary = {
  en: {
    custom: {
      username: {
        regex: 'Username cannot have special char.'
      }
    }
  }
}
VeeValidate.Validator.localize('en', dictionary.en)
Vue.use(VeeValidate)

Vue.directive('on-click-outside', onClickOutside)

// Vue.filter('formatNumber', function (value) {
//   return numeral(value / 100).format('0.00') // displaying other groupings/separators is possible, look at the docs
// })

Vue.filter('formatDate', Filter.formatDate)
Vue.filter('formatDateFromNow', Filter.formatDateFromNow)
Vue.filter('formatNumber', Filter.formatNumber)
Vue.filter('formatNumberWithComma', Filter.formatNumberWithComma)
Vue.filter('formatLargeNumber', Filter.formatLargeNumber)
Vue.filter('formatFullUrl', Filter.formatFullUrl)
Vue.filter('timeInHours', Filter.timeInHours)
Vue.filter('timeInMinutes', Filter.timeInMinutes)
Vue.filter('capitalize', Filter.capitalize)
Vue.filter('truncateInMiddle', Filter.truncateInMiddle)

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
// const isBot =  navigator.userAgent.match(/(googlebot\/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)/i) !== null

navigator.sayswho = (function () {
  let ua = navigator.userAgent
  let tem
  let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || []
    return 'IE ' + (tem[1] || '')
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/)
    if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera')
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1])
  return M.join(' ')
})()

let isOldBrowser = false
const browserInfo = navigator.sayswho.split(' ')
const browserName = browserInfo[0].toLowerCase()
const browserVersion = parseInt(browserInfo[1]) || 0
switch (browserName) {
  case 'chrome':
    if (browserVersion < 64) isOldBrowser = true
    break
  case 'firefox':
    if (browserVersion < 60) isOldBrowser = true
    break
  case 'safari':
    // if (browserVersion < 11) isOldBrowser = true
    if (browserVersion < 10) isOldBrowser = true
    break
  case 'ie':
    if (browserVersion < 11) isOldBrowser = true
    break
  case 'opera':
    if (browserVersion < 50) isOldBrowser = true
    break
  case 'qq':
    if (browserVersion < 6) isOldBrowser = true
    break
}

if (isOldBrowser) {
  const app = new Vue({
    template: '<BrowserPage/>',
    components: { BrowserPage }
  })
  app.$mount('#app')
} else if (isMobileBrowser) {
  console.log('loaded routes for Mobile')
  const router = createMobileRouter()
  router.beforeEach((to, frm, next) => {
    if (/^\/(protect)/.test(to.path) ||
      store.state.auth.secret_code === process.env.SECRET_CODE) {
      next()
    } else {
      next('/protect')
    }
  })
  const app = new Vue({
    router,
    store,
    template: '<v-app id="app"><router-view class="main-content-view"></router-view></v-app>'
    // template: '<App/>',
    // components: { App }
  })
  app.$mount('#app')
} else {
  console.log('loaded routes for Desktop')
  SettingService.getSettings().then(response => {
    const settings = response.body
    const router = createRouter(settings)
    router.beforeEach((to, frm, next) => {
      if (/^\/(protect|_oauth|confirm|reset_password)/.test(to.path) ||
        /^\/register\/attendee\/.+/.test(to.path) ||
        /^\/(playlist)$/.test(to.path) ||
        store.state.auth.secret_code === process.env.SECRET_CODE) {
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
    // UserService.initCache()
    // AlbumService.initCache()
    // ProductService.initCache()
    // ProfileService.initCache()
  })
}
