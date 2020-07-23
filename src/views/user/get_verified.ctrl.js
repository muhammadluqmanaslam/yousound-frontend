import AuthService from '@/services/auth.js'

export default {
  components: {},

  data() {
    return {
      verifying_request: {
        main_genre: null,
        releases: null,
        soundcloud_url: null,
        bandcamp_url: null,
        website_url: null,
        description: null,
      },
    }
  },

  computed: {},

  created() {
    this.$store.dispatch('navigator/goNextState', { page: 'register', tab: '' })
  },

  methods: {
    submit() {},
  },
}
