import AuthService from '@/services/auth.js'

export default {
  components: {},

  data() {
    return {
      email: null,
      username: null,
      resetSuccess: false,
    }
  },

  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  created() {
    this.$store.dispatch('navigator/goNextState', { page: 'register', tab: '' })
  },

  methods: {
    toLogin() {
      this.$router.push({ name: 'Login' })
    },
    submit() {
      if (!this.email) return

      var params = new FormData()
      params.append('email', this.email)
      AuthService.requestResetPassword(params)
        .then((response) => {
          // JSON responses are automatically parsed.
          // this.$store.dispatch('error/showSuccessToast', [
          //   'Email sent with password reset instructions.',
          // ])

          this.resetSuccess = true
        })
        .catch((e) => {
          this.$store.dispatch('error/showErrorToast', [
            'Email does not exist or inactivated',
          ])
        })
    },
  },
}
