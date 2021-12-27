import contentTopHeader from '@/components/contentTopHeader'
import dashboardNav from '@/components/dashboardnav'

export default {
  components: {
    contentTopHeader,
    dashboardNav,
  },
  data() {
    return {
      activeInnerFilter: 'dashboard',
      daysFilter: 7,
      tabs: [
        { id: 'overview', title: 'Overview'},
        { id: 'music', title: 'Music'},
        { id: 'videos', title: 'Videos'},
        { id: 'products', title: 'Products'},
        { id: 'repostRequests', title: 'Repost Requests'},
        { id: 'topCreator', title: 'Top 10 Creators'},
      ],
      tabFilterOptions: [
        {
          title: 'Last 2 Days', value: 2,
        },
        {
          title: 'Last 7 Days', value: 7,
        },
      ],
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
    dashboardTabs() {
      const tabs = [
        { id: 'social', title: 'Social' },
        { id: 'albums', title: 'Albums' },
        { id: 'videos', title: 'Videos' },
        { id: 'products', title: 'Products' },
      ]
      return tabs
    },
  },

  watch: {
    activeInnerFilter(val) {
      this.getInnerMenuTabs(val)
    },
  },

  methods: {
    isActiveTab(tab) {
      return this.activeTab === tab
    },
    isActiveInnerTab(tab) {
      return this.activeInnerTab === tab
    },
    setInnerTab(id) {
      this.activeInnerFilter = tab.id
    },
    getInnerMenuTabs(filter) {
      // const tab = this
      // switch (filter) {
      //   case 'dashboard':
      //     return this.dashboardTabs
      //   case 'sales':
      //     return this.albumsMenuTabs
      //   default:
      //     []
      // }
    },
  },
}
