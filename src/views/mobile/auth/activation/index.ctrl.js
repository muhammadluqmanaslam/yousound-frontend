import { mapActions, mapGetters } from "vuex"
import Stager from "../stager"

export default {
  components: {
    Stager,
  },
  data() {
    return {
      current: 0, // start ftom 0, vuetify uses index of 0
      test: "",
      xUp: null,
      yUp: null,
      xDown: null,
      yDown: null,
      touchstartX: null,
      touchstartY: null,
      touchendX: null
    }
  },
  computed: {
    ...mapGetters({
        stages: "app/activationStages"
    }),
    endLeft() {
      return this.current === 0
    },
    endRight() {
      return this.current === this.stages.length-1
    },
    stageSwipe() {
      return this.$refs.stageSwipe
    }
  },
  watch: {
    current:{
      handler(newVal, oldVal) {
        if (!oldVal || newVal > oldVal) {
          return this.nextStage(newVal+1)
        } else if (oldVal > newVal) {
          return this.prevStage(oldVal)
        }
      },
      immediate: true,
    }
  },
  methods: {
    ...mapActions({
      nextStage: "app/nextActivationStage",
      prevStage: "app/prevActivationStage",
    }),
    touchEnd(evt) {      
      let touchstartX = evt.changedTouches[0].screenY
      let touchendX = this.touchendX

      if (touchendX < touchstartX) {
        console.log('Swiped Left');
        if (this.endRight) {
          evt.stopPropagation()
        }
      }
      
      if (touchendX > touchstartX) {
        console.log('Swiped Right');
        if (this.endLeft) {
          evt.stopPropagation()
        }
      }
  
      // if (touchendY < touchstartY) {
      //     console.log('Swiped Up');
      // }
  
      // if (touchendY > touchstartY) {
      //     console.log('Swiped Down');
      // }
  
      // if (touchendY === touchstartY) {
      //     console.log('Tap');
      // }

      this.touchendX = null
    },
    touchStart(evt) {
      this.touchendX = evt.changedTouches[0].screenY
    },
  },
}