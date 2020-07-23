import UserService from '@/services/user'

export default {
  data() {
    return {}
  },

  computed: {},

  created() {
    console.log('stripe_connect created', this.$store.state.auth.user)
    this.$store.dispatch('auth/setSecretCode', this.$route.query['state'])
    for (let key in this.$route.query) {
      if (key === 'code') {
        this.connectStripe(this.$route.query[key])
        break
      }
    }
  },

  methods: {
    connectStripe(code) {
      const params = {
        code: code,
      }
      UserService.connectStripe(this.$store.state.auth.user.id, params)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', ['Stripe Conected!'])
          this.$router.push({ path: '/settings#bank-details' })
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },
}
