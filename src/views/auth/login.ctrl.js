import ActivityService from '@/services/activity.js'
import AuthService from '@/services/auth.js'
import { mapGetters } from 'vuex'
import PlaylistService from '@/services/playlist'

import { MyEvents } from '@/helper'

export default {
  components: {},

  data() {
    return {
      remember: false,
      user: {
        email: '',
        password: '',
      },
    }
  },

  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    onMediumScreen() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
    }),
  },

  created() {
    let myAlert = null
    try {
      myAlert = JSON.parse(atob(this.$route.query['alert']))
    } catch (e) {
      myAlert = null
    }
    // console.log('login created', myAlert)

    if (this.isAuthenticated) {
      this.$router.push({ name: 'DiscoverIndex' })
      return
    }

    const user = AuthService.loadCredential()
    if (user !== null) {
      this.user.email = user.email
      this.user.password = user.password
    }
    this.$store.dispatch('navigator/goNextState', { page: 'login', tab: '' })

    if (myAlert) {
      switch (myAlert.type) {
        case 'success':
          this.$store.dispatch('error/showSuccessToast', myAlert.messages)
          break
        case 'error':
          this.$store.dispatch('error/showErrorToast', myAlert.messages)
          break
      }
    }

    this.$nextTick(() => {
      // console.log('after stream-player beforeDestroy ???')
      this.$root.$emit(MyEvents.AUTH_SIGNOUT)
    })
  },

  methods: {
    submit() {
      this.$store.dispatch('error/showLoadingActivity', true)
      AuthService.login(this.user)
        .then((response) => {
          if (this.remember) {
            AuthService.saveCredential(this.user)
          }
          AuthService.setTokenAndUserInfo(response.body)

          if (response.body.sign_in_count <= 1) {
            this.$store.dispatch('auth/setFirstVisit', true)
          }

          this.$root.$emit(MyEvents.AUTH_SIGNIN)

          this.$store.dispatch('error/showLoadingActivity', false)
          this.$router.push({ name: 'DiscoverIndex' })
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },
}
