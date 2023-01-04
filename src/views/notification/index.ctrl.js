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
        { id: 'messages', title: 'Messages', badge: 0},
        { id: 'sms', title: 'SMS', badge: 0,},
        // { id: 'activity', title: 'Activity', badge: 0},
        // { id: 'paidToShare', title: 'Repost Request'},
      ],
    }
  },
  computed: {
    badge() {
      return this.$store.state.activity.badge
    },
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  methods: {
    isActiveTab(tab) {
      return this.activeTab === tab
    },
    setTab(tab) {
      this.activeTab = tab
    },
    processNotifications() {
      this.tabs = this.tabs.map((tab)=> {
        const {id} = tab
        switch (id) {
          case "activity":
            return {...tab, ...{ badge: this.badge.activity}}
            break;
          case "messages":
            return {...tab, ...{ badge: this.badge.message}}
            break;
          default:
            break;
        }
        return tab
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
    this.$store.dispatch('navigator/goNextState', { page: 'notification', tab: '' })

    const tab = this.$route.hash.substr(1) || 'messages'
    this.setTab(tab)
    if (!this.onMobile) {
      this.tabs = this.tabs.filter(tab => tab.id !== 'sms')
    }
    this.processNotifications()
  },
}
