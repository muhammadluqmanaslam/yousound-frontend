import contentTopHeader from '@/components/contentTopHeader'
import dashboardNav from '@/components/dashboardNav'

export default {
  props: {
    isComp: Boolean,
    listLimit: Number,
  },
  components: {
    contentTopHeader,
    dashboardNav,
  },
  data() {
    return {
      daysFilter: 7,
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

  methods: {
    isActiveInnerTab(tab) {
      return this.activeInnerTab === tab
    },
    getInnerMenuTabs(filter) {
      switch (filter) {
        case 'dashboard':
          return this.dashboardTabs
        case 'sales':
          return this.albumsMenuTabs
        default:
          []
      }
    },
  },
}
