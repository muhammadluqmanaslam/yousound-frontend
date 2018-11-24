import ActivityService from '@/services/activity.js'
import AuthService from '@/services/auth.js'
import PlaylistService from '@/services/playlist'

import { MyEvents } from '@/helper'

import genreDialog from '@/components/genre_dialog'

export default {
  components: {
    genreDialog
  },

  data () {
    return {
      show_genre_selector_dialog: false,
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
    console.log('login created')
    if (AuthService.isAuthenticated()) {
      this.$router.push({ path: '/discover' })
      return
    }

    const user = AuthService.loadCredential()
    if (user !== null) {
      this.user.email = user.email
      this.user.password = user.password
    }
    this.$store.dispatch('navigator/goNextState', { page: 'login', tab: '' })

    this.$nextTick(() => {
      console.log('after video-player beforeDestroy ???')
      this.$root.$emit(MyEvents.AUTH_SIGNOUT)
    })
  },

  methods: {
    openGenreSelectorDialog () {
      this.show_genre_selector_dialog = true
    },

    closeGenreSelectorDialog () {
      this.show_genre_selector_dialog = false
    },

    submit () {
      this.$store.dispatch('error/showLoadingActivity', true)
      AuthService.login(this.user).then(response => {
        if (this.remember) {
          AuthService.saveCredential(this.user)
        }
        AuthService.setTokenAndUserInfo(response.body.token, response.body)

        if (response.body.sign_in_count <= 1) {
          this.$store.dispatch('auth/setFirstVisit', true)
        }

        this.$root.$emit(MyEvents.AUTH_SIGNIN)

        this.$store.dispatch('error/showLoadingActivity', false)
        this.$router.push({ path: '/discover' })
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  },

  mounted () {
    $('#content-view').css('padding-top', '0');
  }
}