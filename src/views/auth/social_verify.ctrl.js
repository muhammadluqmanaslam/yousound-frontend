import AuthService from '@/services/auth.js'

export default {
  components: {
  },

  data () {
    return {
      isLoading: false,
      showError: false,
      errorMessage: '',
      timeout: 3000,
      query_string: []
    }
  },

  computed: {
  },

  created () {
    this.$store.dispatch('navigator/goNextState', {page: 'register', tab: ''})
  },

  methods: {
    submit () {      
    }
  }
}
