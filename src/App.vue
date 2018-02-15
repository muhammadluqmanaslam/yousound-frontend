<template>
  <v-app id="app" standalone v-bind:class="{'primary': $store.getters['auth/isPrimaryTheme'], 'gray': $store.getters['auth/isGrayTheme'], 'normal': $store.getters['auth/isNormalTheme'], 'sliderprofile': !$store.state.player.gridShow && $store.getters['auth/isSliderProfileTheme']}">

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
        <div class="page auth-page auth-login-header">
          <v-flex xs12 text-xs-center>
            <img class="logo" src="/static/images/nav_logo_primary.png">
          </v-flex>
          <v-flex xs12 text-xs-center>
            <h4>Sign in</h4>
          </v-flex>
        </div>
        <v-btn class="dialog-close-btn" @click.native="dialog=false"><v-icon>highlight_off</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <div class="page auth-page auth-login-page">
            <form v-on:submit.prevent="submit()">
              <v-flex xs12 text-xs-center>
                <div class="form-group" :class="{'has-error': errors.has('email') }" >
                  <input class="email"  v-model="user.email" v-validate="'required|email'" :class="{'input': true, 'text-danger': errors.has('email') }" name="email" type="email" placeholder="Email">
                  <p class="text-danger text-xs-left" v-if="errors.has('email')">{{ errors.first('email') }}</p>
                </div>
              </v-flex>
                <v-flex xs12 text-xs-center>
                <input class="password" type="password" v-model="user.password" placeholder="Password">
              </v-flex>
              <v-flex xs12>
                <v-flex xs12>
                  <v-flex xs12>
                    <v-layout row wrap>
                      <v-flex sm6 xs12>
                        <p class="regular-checkbox">
                          <input id="remember" type="checkbox" v-model="remember"/>
                          <label for="remember">Remember me</label>
                        </p>
                      </v-flex>
                      <v-flex sm6 xs12 text-xs-right text-sm-right>
                        <a class="forgot-password" @click="choosePage('forgot')">Forgot password?</a>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-flex>
              </v-flex>
              <v-flex xs12 text-xs-center>
                <v-btn block round dark type="submit" class="login-button">Sign in</v-btn>  
              </v-flex>
            </form>
            <v-flex xs12 text-xs-center>
              <v-layout row class="or-divider">
                <v-flex xs5><hr class="divider"></v-flex><v-flex xs2><p class="or">OR</p></v-flex><v-flex xs5><hr class="divider"></v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 text-xs-center>
              <a class="create-account mb-4" @click="choosePage('register')">Create an account</a>
            </v-flex>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <efm-header v-if="$store.getters['auth/hasHeader']"></efm-header>

    <v-snackbar
      :timeout="$store.state.error.timeout" multi-line top
      :color="$store.state.error.color"
      v-model="showError">      
      <label>{{ $store.state.error.errors[0] }}</label>
      <v-btn dark flat @click.native="$store.dispatch('error/hideToast')"><v-icon>clear</v-icon></v-btn>
    </v-snackbar>

    <v-flex xs12 text-xs-center loading-section v-if="$store.state.error.isLoading">
      <v-progress-circular indeterminate v-bind:size="50" class="loading-activity" v-bind:class="{'primary--text': !$store.getters['auth/isPrimaryTheme'], 'white-activity': $store.getters['auth/isPrimaryTheme']}"></v-progress-circular>
    </v-flex>

    <router-view id="content-view"></router-view>

    <player ref="player"></player>

  </v-app>
</template>

<script>
/* global $:true */

import efmHeader from '@/components/header'
import Player from '@/components/player'
import AuthService from '@/services/auth'
import UserService from '@/services/user'
import ActivityService from '@/services/activity'
import PlaylistService from '@/services/playlist'

export default {
  name: 'app',
  components: {
    efmHeader,
    Player
  },

  data () {
    return {
      direction: 'none',
      dialog: false,
      remember: false,
      user: {
        email: '',
        password: ''
      }
    }
  },

  computed: {
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
              this.$store.dispatch('activity/setCount', response.body)
            }).catch(e => {
              console.log(e)
            })
          }).catch(e => {
            console.log(e)
          })
        } else {
          ActivityService.getUnread().then(response => {
            this.$store.dispatch('activity/setCount', response.body)
          }).catch(e => {
            console.log(e)
          })
        }
      }
    }
  },

  created () {
    if (AuthService.isAuthenticated()) {
      this.getUserInfo()
    }

    // if (this.$store.state.auth.page !== 'forgot' && this.$store.state.auth.page !== 'register') {
    //   if (!AuthService.isAuthenticated()) {
    //     this.$router.push({ path: '/login' })
    //   }
    // }

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
  },

  methods: {
    choosePage (path) {
      this.dialog = false
      this.$router.push({ path: '/' + path })
    },

    submit () {
      this.$store.dispatch('error/showLoadingActivity', true)
      AuthService.login(this.user).then(response => {
        this.dialog = false
        this.$store.dispatch('error/showLoadingActivity', false)
        if (this.remember) {
          AuthService.saveCredential(this.user)
        }
        AuthService.setTokenAndUserInfo(response.body.token, response.body)

        PlaylistService.getPlaylists().then(response => {
          this.$store.dispatch('playlist/setPlaylists', response.body)
          this.$router.push({ path: '/discover' })
        })
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    getUserInfo () {
      const userId = this.$store.state.auth.user.id
      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([
        UserService.getUserInfo(userId),
        ActivityService.getUnread(),
        PlaylistService.getPlaylists()
      ]).then(values => {
        AuthService.setUser(values[0].body)
        this.$store.dispatch('activity/setCount', values[1].body)
        this.$store.dispatch('playlist/setPlaylists', values[2].body)
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(reason => {
        console.log(reason)
        this.$store.dispatch('error/showLoadingActivity', false)
      })
    },

    showLoginDialog () {
      const user = AuthService.loadCredential()
      if (user !== null) {
        this.user = user
      } else {
        this.user = {
          email: '',
          password: ''
        }
      }
      this.dialog = true
    },

    hideLoginDialog () {
      this.dialog = false
    },

    play () {
      this.$refs.player.play()
    },

    pause () {
      this.$refs.player.pause()
    }
  },

  mounted () {
    var _top = $(window).scrollTop()
    const vm = this
    var _direction = 'none'
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
        $('.bottom-player').animate({ bottom: 0 }, 600)
      } else if (vm.direction === 'down' && _direction === 'down') {
        $('.bottom-player').animate({ bottom: -150 }, 600)
      }
    })

    this.$root.$on('showLoginModal', this.showLoginDialog)
    this.$root.$on('hideLoginModal', this.hideLoginDialog)
    // $(document).on('keypress', function (e) {
    //   if (e.which === 32) {
    //     if (['album', 'messages'].indexOf(vm.$store.state.auth.page) === -1) {
    //       if (vm.$store.state.player.isPlaying) {
    //         if (vm.$store.state.player.isPaused) {
    //           vm.play()
    //         } else {
    //           vm.pause()
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
