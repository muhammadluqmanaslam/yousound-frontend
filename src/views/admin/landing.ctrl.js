export default {
  components: {
  },

  data () {
    return {
    }
  },

  computed: {
  },

  created () {
    this.$store.dispatch('navigator/goNextState', {page: 'landing', tab: ''})
    console.log(this.$store.state.auth.page)
  },

  methods: {
  },

  mounted () {
  }
}
