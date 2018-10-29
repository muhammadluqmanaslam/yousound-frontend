import AdminService from '@/services/admin'
import UserService from '@/services/user'
import StreamService from '@/services/stream'
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
        { text: 'View Direct Messages', value: 'enabled_view_direct_messages', align: 'left' },
        { text: 'Streaming', value: 'enabled_live_video', align: 'left' },
        { text: 'Free Streaming', value: 'enabled_live_video_free', align: 'left' },
        { text: 'Current Free Stream Hours', value: 'free_streamed_time' },
        { text: 'Stop Streaming' },
        { text: 'Free Stream Hours', value: 'free_stream_seconds' },
        { text: 'Demand Stream Hours', value: 'demand_stream_seconds' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Twitter Link', value: 'social_user_id', align: 'left' },
        { text: 'Date Joined', value: 'created_at', align: 'left' },
        { text: 'Verified By', value: 'verified_by', align: 'left' },
        { text: 'Status', value: 'status', align: 'left' },
      ],
      user_search: '',
      users: [],
      user: null,
      pagination: {
        sortBy: 'created_at',
        descending: true,
        rowsPerPage: 100,
        // page: 1,
        // totalItems: 0
      },
      per_page_options: [50, 100, 150],
      show_stream_delete_confirm_dialog: false,
      show_free_stream_toggle_confirm_dialog: false,
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
    this.loadUsers()
  },

  methods: {
    loadUsers () {
      this.$store.dispatch('error/showLoadingActivity', true)
      this.isPageReady = false
      const params = {
        page: this.pagination.page,
        per_page: this.pagination.rowsPerPage
      }
      UserService.getUsers(params).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.isPageReady = true
        this.users = response.body.users
        // this.pagination = response.body.pagination
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        // this.isPageReady = true
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    headers (tab_id) {
      if (tab_id == 'moderators') {
        return this.user_headers
      } else {
        return _.filter(this.user_headers, (h) => { return h.text != 'View Direct Messages' })
      }
    },

    toggleViewDirectMessages (user) {
      const params = {
        user_id: user.id
      }
      AdminService.toggleViewDirectMessages(params)
    },

    openStreamDeleteConfirmDialog (user) {
      this.user = user
      this.show_stream_delete_confirm_dialog = true
    },

    closeStreamDeleteConfirmDialog () {
      this.show_stream_delete_confirm_dialog = false
    },

    deleteStream () {
      this.closeStreamDeleteConfirmDialog()
      this.$store.dispatch('error/showLoadingActivity', true)
      StreamService.deleteStream(this.user.stream.id).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.user.stream.status = 'deleted'
        this.user = null
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        this.user = null
      })
    },

    toggleLiveVideo (user) {
      const params = {
        user_id: user.id
      }
      AdminService.toggleLiveVideo(params)
    },

    openFreeStreamToggleConfirmDialog () {
      this.show_free_stream_toggle_confirm_dialog = true
    },

    closeFreeStreamToggleConfirmDialog () {
      this.show_free_stream_toggle_confirm_dialog = false
    },

    toggleLiveVideoFree (user) {
      if (user.stream && user.stream.status == 'running') {
        this.openFreeStreamToggleConfirmDialog()
        user.enabled_live_video_free = !user.enabled_live_video_free
        return
      }

      const params = {
        user_id: user.id
      }
      AdminService.toggleLiveVideoFree(params)
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

    updateUserRole (user, role) {
      const params = {
        role: role
      }
      UserService.updateUserRole(user.id, params).then(response => {
        user.user_type = role
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  },

  mounted () {
  }
}
