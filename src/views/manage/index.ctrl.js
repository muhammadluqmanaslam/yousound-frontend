import _ from 'lodash'
// import { mapGetters } from 'vuex'
import activityItem from '@/components/activityitem'
import contentTopHeader from '@/components/contentTopHeader'
import manageProduct from '@/views/product/components/manageProduct'
import manageAlbum from '@/views/album/components/manageAlbum'
import manageVideo from '@/views/video/components/manageVideo'
import payments from '@/views/payments'
import settings from '@/views/settings'
import dashboardNav from '@/components/dashboardnav'

export default {
  components: {
    activityItem,
    contentTopHeader,
    manageProduct,
    manageAlbum,
    manageVideo,
    payments,
    settings,
    dashboardNav,
  },

  data() {
    return {
      active_tab: 'content',
      activeInnerFilter: 'videos',
      activeInnerTab: 'published',
      tabFilterOptions: [
        {
          title: 'Albums', value: 'albums',
        },
        {
          title: 'Products', value: 'products',
        },
        {
          title: 'Videos', value: 'videos',
        },
      ],
      page_index: 1,
      total_pages: 1,
      items_per_page: 8 * 1,
      activities: [],
      isPageReady: false,
    }
  },

  computed: {
    userType() {
      return this.$store.getters['auth/userType']
    },
    videosMenuTabs() {
      const tabs = []
      return tabs
    },
    productMenuTabs() {
      const tabs = [
        { id: 'inventory', title: 'Inventory' },
        { id: 'collaborated', title: 'Collaborations' },
        { id: 'pending', title: 'Pending collaborations' },
      ]
      return tabs
    },
    albumsMenuTabs() {
      const tabs = [
        { id: 'published', title: 'Published' },
        { id: 'privated', title: 'Private' },
        { id: 'exclusives', title: 'Video Exclusives' },
        // { id: 'video_only', title: 'Video Attachments' },
        { id: 'collaborated', title: 'Collaborations' },
        { id: 'pending', title: 'Pending Collaborations' },
      ]
      return tabs
    },
    currentUser() {
      return this.$store.state.auth.user
    },
  },
  methods: {
    setInnerTab(id) {
      this.activeInnerTab = id

      switch (this.activeInnerFilter) {
        case 'products':
          this.$refs.manageProduct.setProductFilter(id)
          break

        case 'albums':
          this.$refs.manageAlbum.setAlbumFilter(id)
          break

        case 'videos':
          this.$refs.manageVideo.setVideoFilter(id)
          break

        default:
          return
      }
    },
    getInnerMenuTabs(filter) {
      switch (filter) {
        case 'products':
          return this.productMenuTabs
        case 'albums':
          return this.albumsMenuTabs
        case 'videos':
          return this.videosMenuTabs
        default:
          []
      }
    },
    isActiveTab(tab) {
      return this.active_tab == tab
    },
    isActiveInnerTab(tab) {
      return this.activeInnerTab == tab
    },
  },
  watch: {
    activeInnerFilter(val) {
      const id = this.getInnerMenuTabs(val)[0].id || ''
      // console.log(id);
      this.activeInnerTab = id
    },
  },
  created() {
    // const tab = this.$route.hash.substr(1)

    // this.tabs = this.tabs.filter((tab) => {
    //   return !(tab.allowedUser && !tab.allowedUser.includes(this.userType))
    // })

    if (this.userType === 'listener') {
      this.active_tab = 'payment'
    }
  },
  mounted() {
    this.setInnerTab(this.activeInnerTab)
  },
}
