import contentTopHeader from '@/components/contentTopHeader'
import dashboardNav from '@/components/dashboardnav'

export default {
  components: {
    contentTopHeader,
    dashboardNav,
  },
  data() {
    return {
      activeTab: 'overview',
      activeInnerTab: 'earnings',
      daysFilter: 7,
      tabs: [
        { id: 'overview', title: 'Overview'},
        { id: 'music', title: 'Music'},
        { id: 'videos', title: 'Videos'},
        { id: 'products', title: 'Products'},
        { id: 'repostRequests', title: 'Repost Requests'},
        { id: 'topCreator', title: 'Top 10 Creators'},
      ],
      innerTabs: [
        {
          parent: 'overview',
          tabs: [
            { id: 'earnings', title: 'Earnings', value: 1000, size: 'custom' },
            { id: 'followers', title: 'Followers', value: 2000, size: 'custom' },
            { id: 'shares', title: 'Shares', value: 3000, size: 'custom' },
            { id: 'comments', title: 'Comments', value: 4000, size: 'custom' },
            { id: 'reposts', title: 'Reposts', value: 5000, size: 'custom' },
            { id: 'subscriptionRevenue', title: 'Subscription Revenue', value: 6000, size: 4 },
            { id: 'subscribersList', title: 'Subscribers List', value: 7000, size: 4 },
            { id: 'adRevenue', title: 'Ad Revenue', value: 8000, size: 4 },
          ],
        },
        {
          parent: 'music',
          tabs: [
            { id: 'social', title: 'Social' },
            { id: 'albums', title: 'Albums' },
            { id: 'videos', title: 'Videos' },
            { id: 'products', title: 'Products' }
          ],
        },
      ],
      tabFilterOptions: [
        {
          title: 'All Time', value: 0,
        },
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
  },

  methods: {
    isActiveTab(tab) {
      return this.activeTab === tab
    },
    isActiveInnerTab(tab) {
      // this.activeInnerTab = tab
      // const innerTab = this.setInnerTab()

      // console.log(this.activeInnerTab === innerTab.id);

      return this.activeInnerTab === tab
    },
    setInnerTab() {
      const inner = this.innerTabs.find((inner) => inner.parent === this.activeTab)
      return inner.tabs
    },
    setInnerMenuTabs(filter) {
      const selected = this.tabs.find((f) => f.id === filter)
      this.activeTab = selected.id

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
