import SearchService from '@/services/search'

import albumTab from './components/albums'
import attendeeTab from './components/attendees'
import genreTab from './components/genres'
import globalstatsTab from './components/global_stats'
import paymentTab from './components/payments'
import settingTab from './components/settings'
import signupTab from './components/signups'
import userTab from './components/users'

export default {
  components: {
    albumTab,
    attendeeTab,
    genreTab,
    globalstatsTab,
    paymentTab,
    settingTab,
    signupTab,
    userTab,
  },

  data() {
    return {
      tabs: [
        { id: 'users', title: 'USERS' },
        { id: 'albums', title: 'ALBUMS' },
        { id: 'signups', title: 'SIGN UPS' },
        { id: 'payments', title: 'PAYMENTS' },
        { id: 'genres', title: 'GENRES' },
        { id: 'settings', title: 'SETTINGS' },
        { id: 'globalstats', title: 'GLOBAL STATS' },
        { id: 'attendees', title: 'SEED INVITES' },
      ],
      item: null,
      page_index: 0,
      total_pages: 1,
      items_per_page: 5 * 10,
      feeds: [],
      max25chars: (v) => v.length <= 25 || 'Input too long!',
      tmp: '',
      signups_search: '',
      pagination: {},
      genre_headers: [{ text: 'Subgenre', value: 'name', align: 'left' }],
      settings: {
        signups: false,
        login: false,
        uploads: false,
        merch_uploads: false,
        maintenance: false,
        message: 'Test',
      },
      isPageReady: false,
    }
  },

  computed: {},

  created() {
    this.$store.dispatch('navigator/goNextState', {
      page: 'admin',
      tab: 'users',
    })
  },

  methods: {
    loadFeeds(filter) {
      // this.$store.dispatch('error/showLoadingActivity', true)
      // const params = new FormData()
      // params.append('filter', filter)
      // params.append('page', this.page_index + 1)
      // params.append('per_page', this.items_per_page)
      // // var params = {
      // //   filter: filter
      // // }
      // SearchService.searchStream(params).then(response=> {
      //   this.$store.dispatch('error/showLoadingActivity', false)
      //   this.feeds = this.feeds.concat(response.body.feeds)
      //   this.page_index = response.body.pagination.current_page
      //   this.total_pages = response.body.pagination.total_pages
      // }).catch(e => {
      //   this.$store.dispatch('error/showLoadingActivity', false)
      //   this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      // })
    },

    availableTab(tab) {
      return (
        this.$store.state.auth.user.user_type === 'admin' ||
        (this.$store.state.auth.user.user_type === 'moderator' &&
          ['users', 'albums', 'signups', 'attendees'].indexOf(tab.id) > -1)
      )
    },

    onTab(tab) {
      this.$store.dispatch('navigator/goNextState', { page: 'admin', tab: tab })
    },
  },

  mounted() {},
}
