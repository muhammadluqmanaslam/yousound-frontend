import AuthService from '@/services/auth.js'

import appFooter from '@/components/footer'

export default {
  components: {
    appFooter
  },

  data () {
    return {
      token: '',
      email: '',
      user_type: 0,
      message: '',
      isActivated: false,
      isLoading: false,
      isPageReady: false
    }
  },

  computed: {
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'register', tab: '' })
    this.token = this.$route.params.token
    this.email = this.$route.query['email']
    this.user_type = this.$route.query['type'] || 1
    if (this.token == 'being') {
      if (!this.email) {
        this.$router.push('/')
      }
    } else {
      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        confirmation_token: this.token
      }
      AuthService.activeAccount(params).then(response => {
        this.isPageReady = true
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', ['Your account has been activated.'])
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (e.body.status === 500) {
          this.$store.dispatch('error/showErrorToast', ['Failed in seding confirmation email'])
        } else if (e.body.errors[0].detail === 'was already confirmed, please try signing in') {
          this.isPageReady = true
          this.$store.dispatch('error/showSuccessToast', ['Your account was already activated!'])
        } else {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        }
      })
    }
  },

  methods: {
    sendConfirmEmail () {
      const params = {
        email: this.email
      }
      AuthService.sendConfirmEmail(params).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['Resent a confirmation email'])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  },

  mounted () {
    $('#content-view').css('padding-top', '0');
  }
}