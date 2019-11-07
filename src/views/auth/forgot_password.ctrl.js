import AuthService from '@/services/auth.js'

export default {
  components: {
  },

  data () {
    return {
      email: null,
      username: null
    }
  },

  computed: {
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'register', tab: '' })
  },

  methods: {
    submit () {
      var params = new FormData()
      params.append('email', this.email)
      AuthService.requestResetPassword(params).then(response => {
        // JSON responses are automatically parsed.
        this.$store.dispatch('error/showSuccessToast', ['Email sent with password reset instructions.'])
        this.$router.push({ path: '/login' })
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  }
}
