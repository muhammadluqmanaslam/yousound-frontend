export default {
  components: {
  },

  data() {
    return {
      type: 'stream'
    }
  },

  computed: {
  },

  created() {
    this.$store.dispatch('navigator/goNextState', {page: 'stream', tab: 'new'})
  },

  methods: {
    onTab(tab) {
    }
  },

  mounted() {
  }
}
