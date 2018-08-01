import SearchService from '@/services/search'

import approveModal from '@/components/approvemodal'
import denyModal from '@/components/denymodal'

import albumTab from './components/albums'
import genreTab from './components/genres'
import settingTab from './components/settings'
import userTab from './components/users'
import signupTab from './components/signups'
import globalstatsTab from './components/global_stats'

export default {
  components: {
    approveModal,
    denyModal,
    userTab,
    albumTab,
    signupTab,
    genreTab,
    settingTab,
    globalstatsTab
  },

  data () {
    return {
      tabs: [
        { id: 'users', title: 'USERS' },
        { id: 'albums', title: 'ALBUMS' },
        { id: 'signups', title: 'SIGN UPS' },
        { id: 'genres', title: 'GENRES' },
        { id: 'settings', title: 'SETTINGS' },
        { id: 'globalstats', title: 'GLOBAL STATS' }
      ],
      item: null,
      page_index: 0,
      total_pages: 1,
      items_per_page: 7 * 5,
      feeds: [],
      max25chars: (v) => v.length <= 25 || 'Input too long!',
      tmp: '',
      signups_search: '',
      pagination: {},
      genre_headers: [
        { text: 'Subgenre', value: 'name', align: 'left' }
      ],
      settings: {
        signups: false,
        login: false,
        uploads: false,
        merch_uploads: false,
        maintenance: false,
        message: 'Test'
      },
      isPageReady: false
    }
  },

  computed: {
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'admin', tab: 'users' })
  },

  methods: {
    loadFeeds (filter) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = new FormData()
      params.append('filter', filter)
      params.append('page', this.page_index + 1)
      params.append('per_page', this.items_per_page)
      // var params = {
      //   filter: filter
      // }
      SearchService.searchStream(params).then(response=> {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.feeds = this.feeds.concat(response.body.feeds)
        this.page_index = response.body.pagination.current_page
        this.total_pages = response.body.pagination.total_pages
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    availableTab (tab) {
      return this.$store.state.auth.user.user_type === 'admin' ||
        (this.$store.state.auth.user.user_type=='moderator' && ['users', 'albums', 'signups'].indexOf(tab.id) > -1)
    },

    onTab(tab) {
      this.$store.dispatch('navigator/goNextState', { page: 'admin', tab: tab })
    }
  },

  mounted () {
  }
}
