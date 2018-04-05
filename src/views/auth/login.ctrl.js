import ActivityService from '@/services/activity.js'
import AuthService from '@/services/auth.js'
import PlaylistService from '@/services/playlist'

export default {
  components: {
  },

  data () {
    return {
      eye: false,
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
    if (AuthService.isAuthenticated()) {
      this.$router.push({ path: '/discover' })
    } else {
      const user = AuthService.loadCredential()                                                     
      if (user !== null) {
        this.user.email = user.email
        this.user.password = user.password
      }
      this.$store.dispatch('navigator/goNextState', {page: 'login', tab: ''})
    }
  },

  methods: {
    submit () {
      this.$store.dispatch('error/showLoadingActivity', true)
      AuthService.login(this.user).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (this.remember) {
          AuthService.saveCredential(this.user)
        }
        AuthService.setTokenAndUserInfo(response.body.token, response.body)

        const params = {
          action_types: 'signin',
          include_own: true
        }
        ActivityService.getActivities(params).then(response => {
          if (response.body.pagination.total_count <= 1) {
            this.$store.dispatch('auth/setFirstVisit', true)
          }
        })

        PlaylistService.getPlaylists().then(response => {
          this.$store.dispatch('playlist/setPlaylists', response.body)
          this.$router.push({ path: '/discover' })
        })
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