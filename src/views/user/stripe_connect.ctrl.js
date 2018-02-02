import UserService from '@/services/user'
export default {
  components: {
  },

  data () {
    return {
    }
  },

  computed: {
  },

  created () {
    for (let key in this.$route.query) {
      if (key === 'code') {
        this.connectStripe(this.$route.query[key])
        break
      }
    }
  },

  methods: {
    connectStripe(code) {
      const params = new FormData()
      params.append('code', code)
      UserService.connectStripe(this.$store.state.auth.user.id, params).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['Stripe Conected!'])
        this.$router.push({ path : '/settings#bank-details' })
      })
      .catch(e => {
        if (e.body.errors) {
          this.$store.dispatch('error/showErrorToast', e.body.errors)
        } else {
          this.$store.dispatch('error/showErrorToast', [e.body])
        }
      })
    }
  },

  mounted () {
  }
}
