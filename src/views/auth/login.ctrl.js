import ActivityService from '@/services/activity.js'
import AuthService from '@/services/auth.js'
import PlaylistService from '@/services/playlist'

import { MyEvents } from '@/helper'

export default {
  components: {
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
    submit () {
      this.$store.dispatch('error/showLoadingActivity', true)
      AuthService.login(this.user).then(response => {
        if (this.remember) {
          AuthService.saveCredential(this.user)
        }
        AuthService.setTokenAndUserInfo(response.body)

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
  }
}
