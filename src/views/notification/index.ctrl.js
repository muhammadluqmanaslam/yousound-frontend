import contentTopHeader from '@/components/contentTopHeader'
import Activity from '@/views/activity'
import Messages from '@/views/messages'

export default {
  components: {
    contentTopHeader,
    Activity,
    Messages,
  },
  data() {
    return {
      currentTab: 'activity',
      tabs: [
        { id: 'activity', title: 'Activity' },
        { id: 'messages', title: 'Messages' },
      ],
    }
  },
  computed: {},
  methods: {
    isActiveTab(tab) {
      console.log(tab)
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
      console.log(this.active_tab)

      console.log(toPath)
      console.log(fromPath)
      const tab = toPath.hash.substr(1)
      this.setTab(tab)
    },
  },

  created() {
    const tab = this.$route.hash.substr(1) || 'activity'
    this.setTab(tab)
  },
}
