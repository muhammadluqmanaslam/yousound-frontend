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
  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
    isOnLive() {
      return this.currentUser.enabled_live_video
    },
  },
  methods: {},
  watch: {},
  created() {},
}
