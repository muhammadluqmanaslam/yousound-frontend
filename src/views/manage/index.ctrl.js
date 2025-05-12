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
      replaceTopMenu: [
        { id: 'manage', title: 'Manage', pathName: 'ManageIndex', icon: require('../../../static/images/file-copies.svg') },
      ],
      active_tab: 'content',
      activeInnerFilter: 'albums',
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
        { id: 'published', title: 'Inventory' },
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
    setActiveInnerFilter(filter) {
      this.activeInnerFilter = filter
    },
    isActiveFilter(filter) {
      return this.activeInnerFilter === filter
    },
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
      const getInnerTab = this.getInnerMenuTabs(val).find(tab => tab.id == this.activeInnerTab)
      if (val === 'videos') return

      const fallback = this.getInnerMenuTabs(val)[0].id || ''
      if (!getInnerTab) {
        this.activeInnerTab = fallback
      } else {
        this.activeInnerTab = getInnerTab.id
      }

      this.setInnerTab(this.activeInnerTab)
    },
  },
  created() {    
    if (this.userType === 'listener') {
      this.active_tab = 'payment'
    }
    if (localStorage.getItem("release_product")) {
      this.activeInnerFilter = 'products'
    } else if (localStorage.getItem("release_video")) {
      this.activeInnerFilter = 'videos'
    }
  },
  mounted() {
    const {activeInnerFilter, activeInnerTab} = this.$route.params
    if (activeInnerFilter) {
      this.activeInnerFilter = activeInnerFilter
    }

    if (activeInnerTab) {
      this.activeInnerTab = activeInnerTab
    } else {
      this.activeInnerTab = 'published'
    }

    this.setInnerTab(this.activeInnerTab)
  },
}
