import Slick from 'vue-slick';

import '@/../node_modules/slick-carousel/slick/slick.css';
import '@/../node_modules/slick-carousel/slick/slick-theme.css';

export default {
  components: {
    Slick
  },

  data () {
    return {
      slickOptions: {
        slidesToShow: 1,
        arrows: false,
        dots: true,
        autoplay: true,
        autoplaySpeed: 3000,
      }
    }
  },

  computed: {
  },

  created () {
    if (this.$store) {
      if (this.$store.state.auth.user) {
        this.$router.push({ path: '/discover' })
      } else {
        this.$store.dispatch('navigator/goNextState', { page: 'main_landing', tab: '' })
      }
    }
  },

  methods: {
    next() {
      console.log('next')
      this.$refs.slick.next()
    },
    prev() {
      console.log('prev')
      this.$refs.slick.prev()
    },
    reInit() {
      console.log('reInit')
      // Helpful if you have to deal with v-for to update dynamic lists
      this.$nextTick(() => {
        this.$refs.slick.reSlick();
      });
    },
    handleAfterChange(event, slick, currentSlide) {
      // console.log('handleAfterChange', slick, currentSlide, this.$refs.slick)
      // console.log('handleAfterChange', currentSlide, this.$refs.slick.getOption('autoplay'))
      if (currentSlide === 3) {
        // console.log('autoplay pause')
        this.slickOptions.autoplay = false
        this.$refs.slick.setOption('autoplay', false, true)
      }
    },
    // handleBeforeChange(event, slick, currentSlide, nextSlide) {
    //     console.log('handleBeforeChange', event, slick, currentSlide, nextSlide);
    // },
    // handleBreakpoint(event, slick, breakpoint) {
    //     console.log('handleBreakpoint', event, slick, breakpoint);
    // },
    // handleDestroy(event, slick) {
    //     console.log('handleDestroy', event, slick);
    // },
    // handleEdge(event, slick, direction) {
    //     console.log('handleEdge', event, slick, direction);
    // },
    // handleInit(event, slick) {
    //     console.log('handleInit', event, slick);
    // },
    // handleReInit(event, slick) {
    //     console.log('handleReInit', event, slick);
    // },
    // handleSetPosition(event, slick) {
    //     console.log('handleSetPosition', event, slick);
    // },
    // handleSwipe(event, slick, direction) {
    //     console.log('handleSwipe', event, slick, direction);
    // },
    // handleLazyLoaded(event, slick, image, imageSource) {
    //     console.log('handleLazyLoaded', event, slick, image, imageSource);
    // },
    // handleLazeLoadError(event, slick, image, imageSource) {
    //     console.log('handleLazeLoadError', event, slick, image, imageSource);
    // },
  }
}
