import AuthService from '@/services/auth'
import UserService from '@/services/user'

export default {
  components: {
  },

  data () {
    return {
      user: {},
      main_genres: [],
      isPageReady: false
    }
  },

  computed: {
    enabledForm () {
      return this.user.request_status == 'denied'
    }
  },

  created () {
    this.isPageReady = false
    this.$store.dispatch('error/showLoadingActivity', true)
    Promise.all([
      UserService.getUserInfo(this.$store.state.auth.user.id)
    ]).then(values => {
      this.main_genres = this.$store.state.app.genres
      this.user = values[0].body
      if (!this.user.genre) {
        this.user.genre = {}
      }

      this.isPageReady = true
      this.$store.dispatch('error/showLoadingActivity', false)
    }).catch(reason => {
      console.log('reason', reason)
      this.$store.dispatch('error/showLoadingActivity', false)
    })
  },

  methods: {
    submit () {
      const vm = this
      this.$validator.validateAll().then(response => {
        if (response === true) {
          const params = {
            user: {
              genre_id: vm.user.genre.id,
              release_count: vm.user.release_count,
              soundcloud_url: vm.user.soundcloud_url,
              basecamp_url: vm.user.basecamp_url,
              website_url: vm.user.website_url,
              history: vm.user.history,
              request_resend: true
            }
          }
          UserService.updateUserInfo(vm.user.id, params).then(response => {
            vm.user = response.body
          }).catch(e => {
            vm.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        } else {
          vm.$store.dispatch('error/showErrorToast', [vm.errors.items[0].msg])
        }
      }).catch(e => {
        console.log('error', e)
      })
    }
  }
}
