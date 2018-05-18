import AdminService from '@/services/admin'
import UserService from '@/services/user'
import approveModal from '@/components/approvemodal'
import denyModal from '@/components/denymodal'

export default {
  components: {
    approveModal,
    denyModal
  },

  data () {
    return {
      users_tabs: [
        { id: 'all', title: 'All Users' },
        { id: 'artists', title: 'Artists' },
        { id: 'listeners', title: 'Listeners' },
        { id: 'moderators', title: 'Moderators' },
        { id: 'suspended', title: 'Suspended' }
      ],
      user_tab:'all',
      user_headers: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'Streaming', value: 'enabled_live_video', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Twitter Link', value: 'social_user_id', align: 'left' },
        { text: 'Date Joined', value: 'created_at', align: 'left' },
        { text: 'Verified By', value: 'verified_by', align: 'left' },
        { text: 'Status', value: 'status', align: 'left' },
      ],
      user_search: '',
      users: [],
      user: {},
      // pagination: {
      //   per_page: 25,
      //   current_page: 1,
      //   total_pages: 1,
      //   count: 0,
      //   total_count: 0,
      // },
      // per_page_options: [5, 15, 25, { text: "All", value: -1 }],
      pagination: {
        sortBy: 'created_at',
        page: 1,
        rowsPerPage: 25,
        descending: true,
        totalItems: 0
      },
      per_page_options: [5, 15, 25],
      isPageReady: false
    }
  },

  computed: {
    filtered_users () {
      if (this.user_tab === 'artists') {
        return _.filter(this.users, (user) => { return user.user_type === 'artist' && user.status !== 'suspended' })
      } else if (this.user_tab === 'listeners') {
        return _.filter(this.users, (user) => { return user.user_type === 'listener' && user.status !== 'suspended' })
      } else if (this.user_tab === 'moderators') {
        return _.filter(this.users, (user) => { return user.user_type === 'moderator' && user.status !== 'suspended' })
      } else if (this.user_tab === 'suspended') {
        return _.filter(this.users, (user) => { return user.status === 'suspended' })
      } else {
        if (this.$store.state.auth.user.user_type !== 'admin') {
          return _.filter(this.users, (user) => { return user.user_type !== 'admin' })
        } else {
          return this.users
        }
      }
    }
  },

  created () {
    // this.$store.dispatch('auth/setTab', 'users')
    this.loadUsers()
  },

  methods: {
    loadUsers () {
      this.$store.dispatch('error/showLoadingActivity', true)
      this.isPageReady = false
      const params = {
        page: this.pagination.current_page,
        per_page: this.pagination.per_page
      }
      UserService.getUsers(params).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.isPageReady = true
        this.users = response.body.users
        this.pagination = response.body.pagination
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        // this.isPageReady = true
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    toggleLiveVideo (user) {
      const params = {
        user_id: user.id
      }
      console.log(params)
      AdminService.toggleLiveVideo(params)
    },

    suspendAccount (user) {
      const params = {
        status: 'suspended'
      }
      UserService.updateUserStatus(user.id, params).then(response => {
        user.status = 'suspended'
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    activateAccount (user) {
      const params = {
        status: 'active'
      }
      UserService.updateUserStatus(user.id, params).then(response => {
        user.status = 'active'
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    convertToArtist (user) {
      const params = {
        role: 'artist'
        // role: 'moderator'
      }
      UserService.updateUserRole(user.id, params).then(response => {
        user.user_type = 'artist'
        // user.user_type = 'moderator'
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  },

  mounted () {
  }
}
