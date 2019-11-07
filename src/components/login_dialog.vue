<template>
  <div class="page auth-page auth-login-page">
    <v-card>
      <v-card-title>
        <div class="text-xs-center">
          <img class="logo" src="/static/images/nav_logo_primary.png">
          <h4>Sign in</h4>
        </div>
        <v-btn class="dialog-close-btn" @click.native="dismiss()"><v-icon>highlight_off</v-icon></v-btn>
      </v-card-title>
      <v-card-text>
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
      </v-card-text>
    </v-card>
  </div>
</template>

<script type="text/javascript">
  import AuthService from '@/services/auth'
  import PlaylistService from '@/services/playlist'

  export default {
    props: {
      dismiss: {
        type: Function,
        required: true
      }
    },

    data () {
      return {
        remember: false,
        user: {
          email: '',
          password: ''
        }
      }
    },

    computed: {
    },

    created () {
      const user = AuthService.loadCredential()
      if (user !== null) {
        this.user = user
      } else {
        this.user = {
          email: '',
          password: ''
        }
      }
    },

    methods: {
      choosePage (path) {
        this.dismiss()
        this.$router.push({ path: '/' + path })
      },

      submit () {
        this.$store.dispatch('error/showLoadingActivity', true)
        AuthService.login(this.user).then(response => {
          this.dismiss()
          this.$store.dispatch('error/showLoadingActivity', false)
          if (this.remember) {
            AuthService.saveCredential(this.user)
          }
          AuthService.setTokenAndUserInfo(response.body)

          if (response.body.sign_in_count <= 1) {
            this.$store.dispatch('auth/setFirstVisit', true)
          }

          PlaylistService.getPlaylists().then(response => {
            this.$store.dispatch('playlist/setPlaylists', response.body)
            this.$router.push({ path: '/discover' })
          })
        }).catch(e => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      }
    }
  }
</script>
