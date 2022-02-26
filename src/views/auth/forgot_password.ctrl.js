import AuthService from '@/services/auth.js'

export default {
  components: {},

  data() {
    return {
      email: null,
      username: null,
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
    submit() {
      if (!this.email) return

      var params = new FormData()
      params.append('email', this.email)
      AuthService.requestResetPassword(params)
        .then((response) => {
          // JSON responses are automatically parsed.
          this.$store.dispatch('error/showSuccessToast', [
            'Email sent with password reset instructions.',
          ])
          this.$router.push({ path: '/login' })
        })
        .catch((e) => {
          this.$store.dispatch('error/showErrorToast', [
            'Email does not exist or inactivated',
          ])
        })
    },
  },
}
