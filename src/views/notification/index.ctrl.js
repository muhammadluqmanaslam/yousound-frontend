import contentTopHeader from '@/components/contentTopHeader'
import Activity from '@/views/activity'
import Messages from '@/views/messages'
import getPaidToShare from '@/views/getPaidToShare'

export default {
  components: {
    contentTopHeader,
    Activity,
    Messages,
    getPaidToShare,
  },
  data() {
    return {
      currentTab: 'activity',
      tabs: [
        // { id: 'activity', title: 'Notifications' },
        { id: 'messages', title: 'Messages', icon: require('../../../static/images/messages.svg') },
        { id: 'paidToShare', title: 'Repost Request', icon: require('../../../static/images/currency-exchange.svg') },
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
      return this.currentTab === tab
    },
    setTab(tab) {
      this.currentTab = tab
      this.$router.push({
        path: this.$route.path,
        hash: tab,
      })
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
    const tab = this.$route.hash.substr(1) || 'messages'
    this.setTab(tab)
  },
}
