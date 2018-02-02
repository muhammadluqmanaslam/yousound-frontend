import AuthService from '@/services/auth.js'

export default {
  data () {
    return {
      isLoading: false,
      showError: false,
      errorMessage: '',
      timeout: 3000,
      query_string: []
    }
  },

  components: {
  },

  computed: {
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'register', tab: '' })
  },

  methods: {
    submit () {
    }
  },

  mounted () {
    $('#content-view').css('padding-top', '0');
  }
}