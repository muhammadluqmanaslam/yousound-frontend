import StreamService from '@/services/stream'

export default {
  components: {},

  data() {
    return {
      deletingInterval: null,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
  },

  created() {
    const vm = this
    this.$store.dispatch('navigator/goNextState', {
      page: 'broadcast',
      tab: '',
    })
    this.deletingInterval = setInterval(function () {
      vm.getStream()
    }, 10000)
  },

  beforeDestroy() {
    if (this.deletingInterval) {
      clearInterval(this.deletingInterval)
    }
  },

  methods: {
    getStream() {
      StreamService.getStream(this.currentUser.stream.id)
        .then((response) => {
          if (response.body.status === 'deleted') {
            this.resetStream()
          }
        })
        .catch((e) => {
          if (e.status === 404) {
            this.resetStream()
          } else {
            console.log('getStream', e)
          }
        })
    },

    resetStream() {
      if (this.deletingInterval) {
        clearInterval(this.deletingInterval)
        this.$store.dispatch('auth/setStream', null)
        this.$router.push({ path: `/user/${this.currentUser.slug}/video` })
      }
    },
  },
}
