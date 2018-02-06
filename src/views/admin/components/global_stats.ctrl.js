import moment from 'moment'
import AdminService from '@/services/admin'

export default {
  components: {},

  data () {
    return {
      globalstats_categories: [
        'YESTERDAY',
        'LAST MONTH',
        'TOTAL'
      ],
      globalstats_category: 'TOTAL',
      globalstats: [
        { name: 'Total Users', value: 0 },
        { name: 'Logins', value: 0 },
        { name: 'Listener Signups', value: 0 },
        { name: 'Artist Signups', value: 0 },
        { name: 'Brand Signups', value: 0 },
        { name: 'Label Signups', value: 0 },
        { name: 'Listeners', value: 0 },
        { name: 'Uploads', value: 0 },
        { name: 'Downloads', value: 0 },
        { name: 'Plays', value: 0 },
        { name: 'Merch Uploads', value: 0 },
        { name: 'Merch Sales', value: 0 },
        { name: 'Repost Requests', value: 0 },
        { name: '# of Donations', value: 0 },
        { name: 'Revenue made from Donations', value: 0 },
        { name: 'Playlists Created', value: 0 },
        { name: 'Top 10 popular genres', value: 0 },
        { name: 'Blocked Users (view users', value: 0 },
        { name: 'Cancelled Accounts', value: 0 }
      ],
      per_page_options: [10, { text: "All", value: -1 }],
      isPageReady: false
    }
  },

  created () {
    this.loadData()
  },

  methods: {
    loadData () {
      // this.isPageReady = false
      // this.$store.dispatch('error/showLoadingActivity', true)
      const now = moment()
      let params = {}
      switch (this.globalstats_category) {
        case 'YESTERDAY':
          params = {
            start_date: now.clone().subtract(1, 'days').startOf('day').format(),
            end_date: now.clone().subtract(1, 'days').endOf('day').format()
          }
          break
        case 'LAST MONTH':
          params = {
            start_date: now.clone().subtract(1, 'months').startOf('month').format(),
            end_date: now.clone().subtract(1, 'months').endOf('month').format()
          }
          break
      }
      AdminService.getGlobalStats(params).then(response => {
        const stats = response.body
        this.globalstats = [
          { name: 'Total Users', value: stats.total_users },
          { name: 'Logins', value: stats.login_users },
          { name: 'Listener Signups', value: stats.signup_listener_users },
          { name: 'Artist Signups', value: stats.signup_artist_users },
          { name: 'Brand Signups', value: stats.signup_brand_users },
          { name: 'Label Signups', value: stats.signup_label_users },
          { name: 'Listeners', value: 0 },
          { name: 'Uploads', value: stats.uploaded_albums },
          { name: 'Downloads', value: stats.downloaded_albums },
          { name: 'Plays', value: stats.played_albums },
          { name: 'Merch Uploads', value: stats.uploaded_products },
          { name: 'Merch Sales', value: stats.sold_products },
          { name: 'Repost Requests', value: 0 },
          { name: '# of Donations', value: 0 },
          { name: 'Revenue made from Donations', value: 0 },
          { name: 'Playlists Created', value: stats.created_playlists },
          { name: 'Top 10 popular genres', value: 0 },
          { name: 'Blocked Users (view users)', value: 0 },
          { name: 'Cancelled Accounts', value: 0 }
        ]
      }).catch(e => {
        console.log(e)
      })
    }
  },

  watch: {
    globalstats_category: {
      handler () {
        this.loadData()
      }
    }
  }
}
