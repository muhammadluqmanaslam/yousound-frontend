/* global $:true */

export default {
  components: {},

  data() {
    return {
      windowWidth: 0,
      activeSlide: 1,
      playTimer: null,
    }
  },

  computed: {
    transform() {
      return `translate3d(-${
        this.windowWidth * (this.activeSlide - 1)
      }px, 0px, 0px)`
    },
  },

  created() {
    window.addEventListener('resize', this.handleResize)
    this.windowWidth = window.innerWidth
    // console.log('main_landing created', this.windowWidth)

    if (this.$store) {
      if (this.$store.state.auth.user) {
        this.$router.push({ path: '/album' })
      } else {
        this.$store.dispatch('navigator/goNextState', {
          page: 'main_landing',
          tab: '',
        })
      }
    }
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    adjustDots() {
      const slideHeight = $(`.slide.slide-${this.activeSlide}`).height()
      // console.log('main_landing adjustDots', this.activeSlide, slideHeight)
      $('ul.dots').css({ top: 170 + slideHeight + 'px' })
    },

    setActiveSlide(slideIndex) {
      this.activeSlide = slideIndex
      this.adjustDots()
    },

    handleResize() {
      this.windowWidth = window.innerWidth
      // console.log('main_landing handleResize', this.windowWidth)
      this.$nextTick(() => {
        this.adjustDots()
      })
    },
  },

  mounted() {
    const vm = this
    $('.slide.slide-1 img').on('load', function () {
      // console.log("slide-1 image loaded correctly")
      vm.adjustDots()
      if (!vm.playTimer) {
        vm.playTimer = setInterval(() => {
          if (vm.activeSlide == 4) {
            clearInterval(vm.playTimer)
            vm.playTimer = null
          } else {
            vm.setActiveSlide(vm.activeSlide + 1)
          }
        }, 3000)
      }
    })
  },
}
