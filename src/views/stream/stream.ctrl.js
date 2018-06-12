import AuthService from '@/services/auth'
import SearchService from '@/services/search'
import trackCard from '@/components/trackcard'
import productCard from '@/components/productcard'
import streamUser from '@/components/streamuser'

export default {
  components: {
    trackCard,
    productCard,
    streamUser
  },

  data () {
    return {
      activeTab: '',
      tabs: [
        { id: 'any', title: 'Everything' },
        { id: 'uploaded', title: 'Albums' },
        { id: 'reposted', title: 'Reposts' },
        { id: 'downloaded', title: 'Downloaded' },
        { id: 'playlist', title: 'Playlists' },
        { id: 'merch', title: 'Merch' },
        { id: 'video', title: 'Live Video' },
      ],
      page_index: 1,
      total_pages: 1,
      items_per_page: 5,
      users: [],
      isPageReady: false
    }
  },

  computed: {
  },

  watch: {
    '$route' (toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      this.setTab(tab)
    }
  },

  created () {
    if (!this.$store.state.auth.user) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    const tab = this.$route.hash.substr(1)
    this.setTab(tab)
  },

  methods: {
    loadFeeds (filter) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        filter: filter,
        page: this.page_index,
        per_page: this.items_per_page
      }
      SearchService.searchStreamV2(params).then(response => {
        this.users = this.users.concat(response.body.users)
        this.page_index = response.body.pagination.current_page
        this.total_pages = response.body.pagination.total_pages

        this.isPageReady = true
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (e.status === 401) {
          AuthService.clearTokenAndUserInfo()
          this.$router.push({ path: '/login' })
        } else {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        }
      })
    },

    loadMore() {
      this.page_index += 1
      this.loadFeeds(this.activeTab)
    },

    onTab (tab) {
      this.$router.push({
        path: this.$route.path,
        hash: tab
      })
    },

    setTab (tab) {
      if (!tab)
        tab = 'any'

      this.isPageReady = false
      this.users = []
      this.page_index = 1
      this.activeTab = tab
      this.$store.dispatch('navigator/goNextState', { page: 'stream', tab: tab })
      this.loadFeeds(tab)
    }
  },

  mounted () {
  }
}
