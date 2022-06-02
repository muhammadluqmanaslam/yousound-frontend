import { mapActions, mapGetters } from "vuex"
import Stager from "../stager"

export default {
  components: {
    Stager,
  },
  data() {
    return {
      current: 0, // start ftom 0, vuetify uses index of 0
    }
  },
  computed: {
    ...mapGetters({
        stages: "app/activationStages"
    })
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
  },
}