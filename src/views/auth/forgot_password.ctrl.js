import AuthService from '@/services/auth.js'
import forgotPasswordInput from '@/views/auth/forgotPasswordInput/'

export default {
  components: { forgotPasswordInput },

  data() {
    return {
      email: null,
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
  },
}
