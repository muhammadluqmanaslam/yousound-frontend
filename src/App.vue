<template>
  <v-app id="app" standalone :class="{
    'primary': $store.getters['navigator/isPrimaryTheme'],
    'gray': $store.getters['navigator/isGrayTheme'],
    'normal': $store.getters['navigator/isNormalTheme'],
    'app-audio': $store.state.player.isPlaying,
    'app-video': $store.getters['videoPlayer/hasFrame']
  }">

    <app-header v-if="currentUser" v-show="$store.getters['navigator/hasHeader']"></app-header>

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

import debounce from 'lodash/debounce'

import ActivityService from '@/services/activity'
import AuthService from '@/services/auth'
// import GenreService from '@/services/genre'
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
      if (type === 'notifications') {
        type = 'activity'
      }
      if (this.$store.state.auth.token) {
        if (type === 'activity' || type === 'stream') {
          ActivityService.makeRead(type).then(response => {
            ActivityService.getUnread().then(response => {
              this.$store.dispatch('activity/setBadge', response.body)
            })
          })
        } else {
          ActivityService.getUnread().then(response => {
            this.$store.dispatch('activity/setBadge', response.body)
          }).catch(e => {
            AuthService.clearTokenAndUserInfo()
            this.$router.push({ path: '/login' })
          })
        }
      }
    }
  },

  created () {
    if (AuthService.isAuthenticated()) {
      AuthService.checkTokenValidation().then(response => {
        console.log('checkTokenValidation', response.body)
        if (response.body !== false) {
          // this.getUserInfo()
          AuthService.setUser(response.body)
        } else {
          AuthService.clearTokenAndUserInfo()
          this.$router.push({ path: '/login' })
        }
      })
    }

    SettingService.getSettings().then(response => {
      this.$store.dispatch('app/setSettings', response.body)
    })

    // GenreService.getGenres2().then(response => {
    //   this.$store.dispatch('app/setGenres', response.body)
    // })

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

  methods: {
    getUserInfo () {
      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([
        UserService.getUserInfo(this.currentUser.id),
        ActivityService.getUnread(),
        PlaylistService.getPlaylists()
      ]).then(values => {
        AuthService.setUser(values[0].body)
        this.$store.dispatch('activity/setBadge', values[1].body)
        this.$store.dispatch('playlist/setPlaylists', values[2].body)
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(reason => {
        // console.log(reason)
        this.$store.dispatch('error/showLoadingActivity', false)
      })
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

    this.$root.$on('showLoginModal', this.showLoginDialog)
    this.$root.$on('hideLoginModal', this.hideLoginDialog)

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
