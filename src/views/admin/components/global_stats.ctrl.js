import _ from 'lodash'
import moment from 'moment'
import { Filter } from '@/helper'
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
        { name: 'Uploads', value: 0 },
        { name: 'Downloads', value: 0 },
        { name: 'Plays', value: 0 },
        { name: 'Merch Uploads', value: 0 },
        { name: 'Merch Sales', value: 0 },
        { name: 'Reposted Albums', value: 0 },
        { name: 'Reposted Merch', value: 0 },
        { name: '# of Donations', value: 0 },
        { name: 'Revenue made from Donations', value: '0.00' },
        { name: 'Playlists Created', value: 0 },
        { name: 'Top 5 downloaded genres', value: '' },
        { name: 'Top 5 listened genres', value: '' },
        { name: 'Cancelled Accounts', value: 0 }
      ],
      per_page_options: [100, { text: "All", value: -1 }],
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
          { name: 'Uploads', value: stats.uploaded_albums },
          { name: 'Downloads', value: stats.downloaded_albums },
          { name: 'Plays', value: stats.played_albums },
          { name: 'Merch Uploads', value: stats.uploaded_products },
          { name: 'Merch Sales', value: stats.sold_products },
          { name: 'Reposted Albums', value: stats.reposted_albums },
          { name: 'Reposted Merch', value: stats.reposted_products },
          { name: '# of Donations', value: stats.donations_count },
          { name: 'Revenue made from Donations', value: Filter.formatNumber(stats.donations_revenue) },
          { name: 'Playlists Created', value: stats.created_playlists },
          { name: 'Top 5 downloaded genres', value: _.map(stats.top_5_downloaded_genres, 'name').join(', ') },
          { name: 'Top 5 listened genres', value:  _.map(stats.top_5_played_genres, 'name').join(', ') },
          { name: 'Cancelled Accounts', value: stats.cancelled_accounts }
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
