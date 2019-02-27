export default {
  components: {},

  data () {
    return {
      windowWidth: 0,
      activeSlide: 1,
    }
  },

  computed: {
    transform () {
      return `translate3d(-${this.windowWidth * (this.activeSlide - 1)}px, 0px, 0px)`;
    }
  },

  created () {
    window.addEventListener('resize', this.handleResize)
    this.windowWidth = window.innerWidth
    console.log('main_landing created', this.windowWidth)

    if (this.$store) {
      if (this.$store.state.auth.user) {
        this.$router.push({ path: '/discover' })
      } else {
        this.$store.dispatch('navigator/goNextState', { page: 'main_landing', tab: '' })
      }
    }
  },

  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {

    handleResize () {
      this.windowWidth = window.innerWidth
      console.log('main_landing handleResize', this.windowWidth)
    }
  }
}
