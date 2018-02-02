import UserService from '@/services/user'

export default {
  components: {
  },

  data () {
    return {
      settings: {},
    }
  },

  computed: {
  },

  created () {
    // this.$store.dispatch('auth/setTab', 'users')
    this.loadSettings()
  },

  methods: {
    loadSettings () {
    //   this.$store.dispatch('error/showLoadingActivity', true)
    //   const params = {
    //     page: this.pagination.current_page,
    //     per_page: this.pagination.per_page
    //   }
    //   UserService.searchUsers(params).then(response => {
    //     this.$store.dispatch('error/showLoadingActivity', false)
    //     this.isPageReady = true
    //     this.users = response.body.users
    //     this.pagination = response.body.pagination
    //   }).catch(e => {
    //     this.$store.dispatch('error/showLoadingActivity', false)
    //     this.isPageReady = true
    //     if (e.body.errors) {
    //       this.$store.dispatch('error/showErrorToast', e.body.errors)
    //     } else {
    //       this.$store.dispatch('error/showErrorToast', [e.body])
    //     }
    //   })
    }
  },

  mounted () {
  }
}
