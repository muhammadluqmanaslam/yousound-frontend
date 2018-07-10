import AuthService from '@/services/auth.js'

import appFooter from '@/components/footer'

export default {
  components: {
    appFooter
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
  },

  mounted () {
    $('#content-view').css('padding-top', '0');
  }
}