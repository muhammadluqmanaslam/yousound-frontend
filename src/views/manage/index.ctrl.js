import _ from 'lodash'
// import { mapGetters } from 'vuex'
import activityItem from '@/components/activityitem'
import manageProduct from '@/views/product/components/manageProduct'
import manageAlbum from '@/views/album/components/manageAlbum'
import contentTopHeader from '@/components/contentTopHeader'

export default {
  components: {
    activityItem,
    contentTopHeader,
    manageProduct,
    manageAlbum,
  },

  data() {
    return {
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
      ],
      tabs: [
        { id: 'content', title: 'Content' },
        { id: 'payment', title: 'Payments' },
        { id: 'setting', title: 'Settings' },
      ],
      page_index: 1,
      total_pages: 1,
      items_per_page: 8 * 1,
      activities: [],
      isPageReady: false,
    }
  },

  computed: {
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
        { id: 'private', title: 'Private' },
        { id: 'exclusives', title: 'Video Exclusives' },
        { id: 'video_only', title: 'Video Attachments' },
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
    setTab(id) {
      this.active_tab = id
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
    $route(toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      this.setTab(tab)
    },
    activeInnerFilter(val) {
      const id = this.getInnerMenuTabs(val)[0].id || ''
      console.log(id);
      this.activeInnerTab = id
    },
  },
  created() {
    // const tab = this.$route.hash.substr(1)
    // this.setTab(tab)
  },
  mounted() {
    this.setInnerTab(this.activeInnerTab)
  },
}
