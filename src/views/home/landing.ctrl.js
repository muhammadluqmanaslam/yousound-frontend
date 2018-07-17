import appFooter from '@/components/footer'
import landingCard from './components/landing_card'

export default {
  components: {
    appFooter,
    landingCard
  },

  data () {
    return {
    }
  },

  computed: {
  },

  created () {
    if (this.$store) {
      this.$store.dispatch('navigator/goNextState', { page: 'landing', tab: '' })
    }
  },

  methods: {
  },

  mounted () {
  }
}
