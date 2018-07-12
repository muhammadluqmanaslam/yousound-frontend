import AuthService from '@/services/auth.js'

export default {
  components: {
  },

  data () {
    return {
      password: '',
      confirm_password: ''
    }
  },

  computed: {
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'register', tab: '' })
  },

  methods: {
    submit () {
      const vm = this
      this.$validator.validateAll().then(function(response) {
        if (response === true) {
          const params = {
            'reset_token': vm.$route.params.token,
            'password': vm.password
          }
          AuthService.resetPassword(params).then(response => {
            vm.$store.dispatch('error/showSuccessToast', ['Email has been set successfully.'])
            vm.$router.push({ path: '/login' })
          }).catch(e => {
            vm.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        }
      }).catch(function(e) {
        console.log('error', e)
      })
    }
  },

  mounted () {
    $('#content-view').css('padding-top', '0');
  }
}
