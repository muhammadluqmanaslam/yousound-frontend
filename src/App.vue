<template>
  <v-app id="app" standalone :class="{
    'primary': $store.getters['navigator/isPrimaryTheme'],
    'gray': $store.getters['navigator/isGrayTheme'],
    'normal': $store.getters['navigator/isNormalTheme'],
    'app-audio': $store.state.player.isPlaying,
    'app-video': $store.getters['videoPlayer/hasFrame']
  }">

    <app-header
      v-if="currentUser || $store.state.navigator.current.page == 'main_landing'"
      v-show="$store.getters['navigator/hasHeader']"
    />

    <router-view id="content-view"></router-view>

    <app-footer v-if="$store.getters['navigator/hasFooter']"></app-footer>

    <video-player v-if="currentUser"></video-player>

    <player ref="player"></player>

    <earn-money-sticker v-if="$store.state.auth.firstVisit"/>

    <v-flex xs12 text-xs-center loading-section v-if="$store.state.error.isLoading">
      <v-progress-circular
        indeterminate
        v-bind:size="50"
        class="loading-activity"
        v-bind:class="{
          'primary--text': !$store.getters['navigator/isPrimaryTheme'],
          'white-activity': $store.getters['navigator/isPrimaryTheme']
        }"
      ></v-progress-circular>
    </v-flex>

    <v-snackbar
      v-model="showError"
      multi-line top
      :timeout="$store.state.error.timeout"
      :color="$store.state.error.color"
    >
      <label>{{ $store.state.error.errors[0] }}</label>
      <v-btn dark flat @click.native="$store.dispatch('error/hideToast')"><v-icon>clear</v-icon></v-btn>
    </v-snackbar>

    <v-dialog v-model="show_login_dialog" max-width="500px">
      <login-dialog :dismiss="closeLoginDialog"></login-dialog>
    </v-dialog>
  </v-app>
</template>

<script>
/* global $:true */

import _ from 'lodash'
import debounce from 'lodash/debounce'
import Vue from 'vue'

import ActivityService from '@/services/activity'
import AuthService from '@/services/auth'
import CategoryService from '@/services/category'
import GenreService from '@/services/genre'
import PlaylistService from '@/services/playlist'
import SettingService from '@/services/setting'
import UserService from '@/services/user'

import appHeader from '@/components/header'
import appFooter from '@/components/footer'
import earnMoneySticker from '@/components/earn_money'
import Player from '@/components/player'
import videoPlayer from '@/components/video_player'
import loginDialog from '@/components/login_dialog'

import { MyEvents } from '@/helper'

const ActionCable = require('actioncable')

export default {
  name: 'app',
  components: {
    appHeader,
    appFooter,
    earnMoneySticker,
    loginDialog,
    Player,
    videoPlayer
  },

  data () {
    return {
      direction: 'none',
      cable: null,
      notification_subscription: null,
      show_login_dialog: false
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },

    showError: {
      get: function () {
        return this.$store.state.error.showError
      },

      set: function (newValue) {
        this.$store.dispatch('error/hideToast')
      }
    }
  },

  watch: {
    '$route' (to, from) {
      const toPath = to.path.split('/')
      var type = toPath[1]
      if (this.$store.state.auth.token) {
        if (type === 'activity' || type === 'feed') {
          ActivityService.makeRead(type === 'feed' ? 'stream' : type).then(response => {
            ActivityService.getUnread().then(response => {
              this.$store.dispatch('activity/setBadge', response.body)
            })
          })
        } else {
          ActivityService.getUnread().then(response => {
            this.$store.dispatch('activity/setBadge', response.body)
          })
        }
      }
    }
  },

  created () {
    // console.log('App created')
    Vue.http.interceptors.push((req, next) => {
      next((res) => {
        if (res.url.startsWith(process.env.API_BASE_URL) && res.status === 401) {
          // console.log('App interceptors', res)
          AuthService.clearTokenAndUserInfo()
          this.$router.push({ path: '/login' })
        }
      })
    })

    // this.$root.$on('showLoginModal', this.showLoginDialog)
    // this.$root.$on('hideLoginModal', this.hideLoginDialog)
    this.$root.$on(MyEvents.AUTH_SIGNIN, this.doAfterSignIn)
    this.$root.$on(MyEvents.AUTH_SIGNOUT, this.doAfterSignOut)

    Promise.all([
      SettingService.getSettings(),
      GenreService.getGenres2(),
      CategoryService.getCategories()
    ]).then(values => {
      this.$store.dispatch('app/setSettings', values[0].body)
      this.$store.dispatch('app/setGenres', values[1].body)
      this.$store.dispatch('app/setProductCategories', values[2].body)

      if (AuthService.isAuthenticated()) {
        AuthService.checkTokenValidation().then(response => {
          if (response.body !== false) {
            // console.log('App created', response.body)
            AuthService.setUser(response.body)
            this.$root.$emit(MyEvents.AUTH_SIGNIN)
          } else {
            AuthService.clearTokenAndUserInfo()
            this.$router.push({ path: '/login' })
          }
        })
      }
    }).catch(reason => {
      console.log('app created error', reason)
    })

    // (function (d, s, id) {
    //   var js = d.getElementsByTagName(s)[0]
    //   var fjs = d.getElementsByTagName(s)[0]
    //   if (d.getElementById(id)) {
    //     return
    //   }
    //   js = d.createElement(s)
    //   js.id = id
    //   js.src = '//connect.facebook.net/en_US/sdk.js'
    //   fjs.parentNode.insertBefore(js, fjs)
    // }(document, 'script', 'facebook-jssdk'))

    // ### if we move this code to mounted, load event is not caught
    const vm = this
    window.flowplayer(function (api, root) {
      $('.fp-ui', root).click(function (e) {
        if ($(e.target).hasClass('fp-ui')) {
          e.stopPropagation()
        }
      })

      // const fsbutton = root.querySelector('.fp-fullscreen')
      // append fullscreen button after HD menu is added on ready
      api.on('ready', function () {
        console.log('flowplayer ready')
        vm.$store.dispatch('videoPlayer/setStatus', 'active')
        api.mute(false)
        api.volume(1.0)
      //   // root.querySelector('.fp-controls').appendChild(fsbutton)
      //   // api.play()
      //   // if (api.isFullscreen) api.play()
      // }).on('load', function (e, api) {
      //   console.log('flowplayer load')
      //   // api.fullscreen()
      }).on('unload', function (e, api) {
        console.log('flowplayer unload')
      }).on('shutdown', function (e, api) {
        console.log('flowplayer shutdown')
        vm.$root.$emit(MyEvents.VIDEO_PLAYER_EXIT, _.get(vm.$store.state.videoPlayer.stream, 'user.username', ''))
        vm.$store.commit('videoPlayer/reset')
      }).on('fullscreen', function (e, api) {
        console.log('flowplayer fullscreen')
        vm.$store.dispatch('videoPlayer/setFrameMode', 'full')
        vm.$root.$emit(MyEvents.VIDEO_PLAYER_FULLSCREEN_ENTER)
        api.mute(false)
        api.volume(1.0)
      }).on('fullscreen-exit', function (e, api) {
        console.log('flowplayer fullscreen-exit')
        vm.$store.dispatch('videoPlayer/setFrameMode', 'normal')
        if (vm.$store.state.player.isPlaying && !vm.$store.state.player.isPaused) {
          api.mute(true)
        }
      })
    })
  },

  beforeDestroy () {
    this.$root.$off(MyEvents.AUTH_SIGNIN, this.doAfterSignIn)
    this.$root.$off(MyEvents.AUTH_SIGNOUT, this.doAfterSignOut)
  },

  methods: {
    doAfterSignIn () {
      const vm = this
      this.cable = ActionCable.createConsumer(`${process.env.SOCKET_BASE_URL}?token=${this.$store.state.auth.token}`)
      this.notification_subscription = this.cable.subscriptions.create(
        {
          channel: 'NotificationsChannel'
        },
        {
          connected: () => {
            console.log('connected to NotificationsChannel')
          },
          received: (data) => {
            console.log('notification_subscription')
            console.log(data)
            vm.$store.dispatch('activity/addBadge', data)
            UserService.cartItems(vm.currentUser.id).then(response => {
              vm.$store.dispatch('user/setCartItems', response.body)
            })
          },
          disconnected: () => {
            console.log('disconnected to NotificationsChannel :(')
          }
        }
      )

      this.$intercom.boot({
        user_id: this.currentUser.id,
        name: this.currentUser.display_name,
        email: this.currentUser.email,
        avatar: {
          type: 'avatar',
          image_url: this.currentUser.avatar.url
        },
        user_hash: this.$store.state.auth.hmac,
        hide_default_launcher: true
      })

      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([
        UserService.getUserInfo(this.currentUser.id),
        ActivityService.getUnread(),
        PlaylistService.getPlaylists(),
        UserService.cartItems(this.currentUser.id)
      ]).then(values => {
        // console.log('App getUserInfo', values[0].body)
        AuthService.setUser(values[0].body)
        this.$store.dispatch('activity/setBadge', values[1].body)
        this.$store.dispatch('playlist/setPlaylists', values[2].body)
        this.$store.dispatch('user/setCartItems', values[3].body)
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(reason => {
        // console.log(reason)
        this.$store.dispatch('error/showLoadingActivity', false)
      })
    },

    doAfterSignOut () {
      if (this.notification_subscription) {
        this.notification_subscription.unsubscribe()
        this.notification_subscription = null
      }

      this.$intercom.shutdown()
    },

    openLoginDialog () {
      this.show_login_dialog = true
    },

    closeLoginDialog () {
      this.show_login_dialog = false
    }
  },

  mounted () {
    const vm = this
    var _direction = 'none'
    var _top = $(window).scrollTop()

    var toggleBottomPlayer = debounce(function (show) {
      if (show) {
        $('.bottom-player').animate({ bottom: 0 }, 500)
      } else {
        $('.bottom-player').animate({ bottom: -150 }, 500)
      }
    }, 250)

    $(window).scroll(function (event) {
      var _curTop = $(window).scrollTop()
      if (_top < _curTop) {
        if (vm.direction === 'down') {
          _direction = 'none'
        } else {
          _direction = 'down'
          vm.direction = 'down'
        }
      } else {
        if (vm.direction === 'up') {
          _direction = 'none'
        } else {
          _direction = 'up'
          vm.direction = 'up'
        }
      }
      _top = _curTop

      if (vm.direction === 'up' && _direction === 'up') {
        toggleBottomPlayer(true)
      } else if (vm.direction === 'down' && _direction === 'down') {
        toggleBottomPlayer(false)
      }
    })

    // $(document).on('keypress', function (e) {
    //   if (e.which === 32) {
    //     if (['album', 'messages'].indexOf(vm.$store.state.navigator.current.page) === -1) {
    //       if (vm.$store.state.player.isPlaying) {
    //         if (vm.$store.state.player.isPaused) {
    //           vm.$root.$emit(MyEvents.AUDIO_PLAYER_PLAY)
    //         } else {
    //           vm.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
    //         }
    //         return false
    //       }
    //     }
    //     return true
    //   }
    // })
  }
}
</script>
