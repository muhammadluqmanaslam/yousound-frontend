import AuthService from '@/services/auth'
import SearchService from '@/services/search'
import UserService from '@/services/user'

import trackCard from '@/components/trackcard'
import productCard from '@/components/productcard'
import streamUser from '@/components/streamuser'

export default {
  components: {
    trackCard,
    productCard,
    streamUser,
  },

  data() {
    return {
      activeTab: '',
      tabs: [
        { id: 'any', title: 'Everything' },
        { id: 'uploaded', title: 'Albums' },
        { id: 'merch', title: 'Products' },
        { id: 'video', title: 'Live Video' },
        // { id: 'reposted', title: 'Reposts' },
        // { id: 'playlist', title: 'Playlists' },
      ],
      show_help_dialog: false,
      page_index: 1,
      total_pages: 1,
      items_per_page: 5,
      users: [],
      isPageReady: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
  },

  watch: {
    $route(toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      this.setTab(tab)
    },
  },

  created() {
    if (!this.currentUser) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    // if (this.currentUser.data['stream_page_visited'] !== 1) {
    //   this.openHelpDialog()
    // }

    const tab = this.$route.hash.substr(1)
    this.setTab(tab)
  },

  methods: {
    isActiveTab(tab) {
      return this.activeTab === tab
    },

    loadFeeds(filter) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        filter: filter,
        page: this.page_index,
        per_page: this.items_per_page,
      }
      SearchService.searchStreamV2(params)
        .then((response) => {
          this.users = this.users.concat(response.body.users)
          this.page_index = response.body.pagination.current_page
          this.total_pages = response.body.pagination.total_pages

          this.isPageReady = true
          this.$store.dispatch('error/showLoadingActivity', false)
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    loadMore() {
      this.page_index += 1
      this.loadFeeds(this.activeTab)
    },

    openHelpDialog() {
      this.show_help_dialog = true
    },

    closeHelpDialog() {
      this.show_help_dialog = false
      const params = {
        user: {
          stream_page_visited: 1,
        },
      }
      UserService.updateUserInfo(this.currentUser.id, params).then(
        (response) => {
          AuthService.setUser(response.body)
          this.$store.dispatch('auth/setUser', response.body)
        }
      )
    },

    onTab(tab) {
      this.$router.push({
        path: this.$route.path,
        hash: tab,
      })
    },

    setTab(tab) {
      if (!tab) {
        tab = 'any'
      }

      this.isPageReady = false
      this.users = []
      this.page_index = 1
      this.activeTab = tab
      this.$store.dispatch('navigator/goNextState', { page: 'feed', tab: tab })
      this.loadFeeds(tab)
    },
  },

  mounted() {},
}
