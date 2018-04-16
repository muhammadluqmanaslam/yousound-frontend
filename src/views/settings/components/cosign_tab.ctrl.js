import _ from 'lodash'
import UserService from '@/services/user'

export default {
  data () {
    return {
      users: [],
      user_headers: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Twitter Link', value: 'social_user_id', align: 'left' },
        { text: 'Date Joined', value: 'created_at', align: 'left' },
        // { text: 'Verified By', value: 'verified_by', align: 'left' },
        // { text: 'Status', value: 'status', align: 'left' },
      ],
      total_users: 0,
      pagination: {
        sortBy: 'created_at',
        page: 1,
        rowsPerPage: 25,
        descending: true,
        totalItems: 0
      },
      per_page_options: [10, 25, 50],
      isPageRedy: false
    }
  },

  watch: {
    pagination: {
      handler () {
        this.init()
      }
    }
  },

  created () {
    // this.isPageReady = true
    // this.$store.dispatch('error/showLoadingActivity', true)
    this.init()
  },

  methods: {
    init () {
      console.log('co-signed init')
      const params = {
        filter: 'co-sign',
        page: this.pagination.page,
        per_page: this.pagination.rowsPerPage
      }
      UserService.getUsers(params).then(response => {
        this.users = response.body.users
        this.total_users = response.body.pagination.total_count
      })
    },

    coSign (user) {
      console.log('co-signed sumit')
    }
  }
}