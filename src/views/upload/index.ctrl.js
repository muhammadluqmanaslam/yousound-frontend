import topbarNotification from '@/components/topbarNotification'
import getPaid from '@/views/getPaidToShare'
import UserService from '@/services/user'
import DownloadApp from "@/components/downloadApp.vue";

export default {
  components: {
    topbarNotification,
    getPaid,
    DownloadApp,
  },

  data() {
    return {
      topBarContent: 'Connect your Stripe account to start accepting payments',
      user: {},
      initAppDownload: false,
      isAppDownloadClicked: false,
    }
  },
  computed: {
    isStripeConnected() {
      return this.currentUser.stripe_connected;
    },
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentUser() {
      return this.$store.state.auth.user
    },
    isStreaming() {
      return (
        _.get(this.user.stream, 'status', '') === 'running' &&
        _.get(this.user.stream, 'notified', false) &&
        (_.get(this.$store.state.streamPlayer.stream, 'user.slug', '') !==
          this.user.slug ||
          !this.$store.getters['streamPlayer/hasFrame'])
      )
    },
    broadcastLink() {
      if (this.isStreaming) {
        return 'VideoManage'
      } else {
        return 'CreateLive'
      }
    },
  },
  methods: {
    getUser() {
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.getUserInfo(this.currentUser.username)
        .then((response) => {
          if (response.body.status !== 'active') {
            this.$store.dispatch('error/showErrorToast', [
              'User does not exist',
            ])
            this.$router.push({ path: '/' })
            return
          }

          // console.log('profile init')
          this.user = response.body
          this.$store.dispatch('error/showLoadingActivity', false)
        }).catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', ['Error fetching user'])
        })
    },
  },
  watch: {
    initAppDownload(val) {
      if (val === false) {
        this.isAppDownloadClicked = true;
      }
    }
  },
  async created() {
    await this.getUser()
  },
}
