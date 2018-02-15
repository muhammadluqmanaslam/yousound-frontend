import AuthService from '@/services/auth.js'

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
        this.$router.push({ path: '/discover' })
      })
      .catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (e.body.errors) {
          this.$store.dispatch('error/showErrorToast', e.body.errors)
        } else {
          this.$store.dispatch('error/showErrorToast', [e.body])
        }
      })
    }
  },

  mounted () {
    $('#content-view').css('padding-top', '0');
  }
}