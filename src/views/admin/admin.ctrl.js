import SearchService from '@/services/search'

import albumTab from './components/albums'
import attendeeTab from './components/attendees'
import genreTab from './components/genres'
import globalstatsTab from './components/global_stats'
import paymentTab from './components/payments'
import settingTab from './components/settings'
import signupTab from './components/signups'
import subscriptionTab from './components/subscriptions'
import streamTab from './components/streams'
import userTab from './components/users'
import contentTopHeader from '@/components/contentTopHeader'


export default {
  components: {
    albumTab,
    attendeeTab,
    genreTab,
    globalstatsTab,
    paymentTab,
    settingTab,
    signupTab,
    subscriptionTab,
    streamTab,
    userTab,
    contentTopHeader
  },

  data() {
    return {
      tabs: [
        { id: 'users', title: 'Users' },
        { id: 'albums', title: 'Albums' },
        { id: 'signups', title: 'Sign Ups' },
        { id: 'subscriptions', title: 'Subscriptions'},
        { id: 'payments', title: 'Payments' },
        { id: 'genres', title: 'Genres' },
        { id: 'settings', title: 'Settings' },
        { id: 'globalstats', title: 'Global Stats' },
        { id: 'attendees', title: 'Seed Invites' },
        { id: 'streams', title: 'Video Stats' },
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
          ['users', 'albums', 'signups', 'attendees', 'subscriptions'].indexOf(tab.id) > -1)
      )
    },

    onTab(tab) {
      this.$store.dispatch('navigator/goNextState', { page: 'admin', tab: tab })
    },
  },

  mounted() {},
}
