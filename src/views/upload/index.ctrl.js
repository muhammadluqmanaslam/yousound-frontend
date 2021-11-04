import topbarNotification from '@/components/topbarNotification'
import getPaid from '@/views/getPaidToShare'
export default {
  components: {
    topbarNotification,
    getPaid,
  },

  data() {
    return {
      topBarContent: 'Connect your Stripe account to start accepting payments',
    }
  },
  computed: {},
  methods: {},
  watch: {},
  created() {},
}
