export default {
  components: {
  },

  data() {
    return {
    }
  },

  created() {
    this.$store.dispatch('navigator/goNextState', { page: '', tab: '' })
  }
}
