import contentTopHeader from '@/components/contentTopHeader'
import Activity from '@/views/activity'
import Messages from '@/views/messages'
import getPaidToShare from '@/views/getPaidToShare'
import SMS from '@/components/SMS/landing'

export default {
  components: {
    contentTopHeader,
    Activity,
    Messages,
    getPaidToShare,
    SMS,
  },
  data() {
    return {
      activeTab: 'sms',
      tabs: [
        { id: 'messages', title: 'Messages'},
        { id: 'sms', title: 'SMS'},
        { id: 'activity', title: 'Activity'},
        // { id: 'paidToShare', title: 'Repost Request'},
      ],
    }
  },
  computed: {
    badge() {
      return this.$store.state.activity.badge
    },
  },
  methods: {
    isActiveTab(tab) {
      // console.log(tab)
      return this.activeTab === tab
    },
    setTab(tab) {
      this.activeTab = tab
    },
  },
  watch: {
    $route(toPath, fromPath) {
      // console.log(toPath)
      // console.log(fromPath)
      const tab = toPath.hash.substr(1) || 'messages'
      this.setTab(tab)
    },
  },

  created() {
    this.$store.dispatch('navigator/goNextState', { page: 'notification', tab: '' })

    const tab = this.$route.hash.substr(1) || 'messages'
    this.setTab(tab)
  },
}
