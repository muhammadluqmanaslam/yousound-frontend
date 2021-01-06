import AuthService from '@/services/auth'
import AdminService from '@/services/admin'
import UserService from '@/services/user'
import StreamService from '@/services/stream'

export default {
  components: {},

  data() {
    return {
      users_tabs: [
        { id: 'any', title: 'All Users' },
        { id: 'artist', title: 'Artists' },
        { id: 'listener', title: 'Listeners' },
        { id: 'brand', title: 'Brands' },
        { id: 'label', title: 'Labels' },
        { id: 'moderator', title: 'Moderators' },
        { id: 'suspended', title: 'Suspended' },
      ],
      active_tab: 'any',
      user_headers: [
        { text: 'Username', value: 'username', align: 'left', sortable: false },
        {
          text: 'View Direct Messages',
          value: 'enabled_view_direct_messages',
          align: 'left',
          sortable: false,
        },
        {
          text: 'Streaming',
          value: 'enabled_live_video',
          align: 'left',
          sortable: false,
        },
        {
          text: 'Free Streaming',
          value: 'enabled_live_video_free',
          align: 'left',
          sortable: false,
        },
        // { text: 'Current Free Stream Hours', value: 'free_streamed_time' },
        // { text: 'Stop Streaming', value: 'id' },
        // { text: 'Free Stream Hours', value: 'free_stream_seconds' },
        // { text: 'Demand Stream Hours', value: 'demand_stream_seconds' },
        { text: 'Email', value: 'email', align: 'left', sortable: false },
        {
          text: 'Twitter Link',
          value: 'social_user_id',
          align: 'left',
          sortable: false,
        },
        {
          text: 'Date Joined',
          value: 'created_at',
          align: 'left',
          sortable: false,
        },
        {
          text: 'Invited By',
          value: 'invited_by',
          align: 'left',
          sortable: false,
        },
        {
          text: 'Verified By',
          value: 'verified_by',
          align: 'left',
          sortable: false,
        },
        { text: 'Status', value: 'status', align: 'left', sortable: false },
        { text: '', value: '', sortable: false },
      ],
      show_stream_delete_confirm_dialog: false,
      show_free_stream_toggle_confirm_dialog: false,
      show_user_delete_confirm_dialog: false,
      show_disconnect_stripe_confirm_dialog: false,
      search_value: '',
      user: null,
      per_page_options: [50, 100, 150],
      users: [],
      pagination: {
        sortBy: 'created_at',
        descending: true,
        page: 1,
        rowsPerPage: 50,
      },
      total_users: 0,
      isPageReady: true,
    }
  },

  computed: {
    headers() {
      if (this.active_tab === 'moderator') {
        return this.user_headers
      } else {
        return this._.filter(this.user_headers, (h) => {
          return h.text !== 'View Direct Messages'
        })
      }
    },
  },

  methods: {
    loadUsers() {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        q: this.search_value,
        filter: this.active_tab,
        page: this.pagination.page,
        per_page: this.pagination.rowsPerPage,
      }
      AdminService.getUsers(params)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.users = response.body.users
          this.total_users = response.body.pagination.total_count
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    onTab(tab) {
      if (this.active_tab === tab) return

      this.active_tab = tab
      this.pagination = {
        sortBy: 'created_at',
        descending: true,
        page: 1,
        rowsPerPage: 50,
      }
    },

    onKeyEnter(e) {
      this.loadUsers()
    },

    toggleViewDirectMessages(user) {
      const params = {
        user_id: user.id,
      }
      AdminService.toggleViewDirectMessages(params)
    },

    openStreamDeleteConfirmDialog(user) {
      this.user = user
      this.show_stream_delete_confirm_dialog = true
    },

    closeStreamDeleteConfirmDialog() {
      this.show_stream_delete_confirm_dialog = false
    },

    deleteStream() {
      this.closeStreamDeleteConfirmDialog()
      this.$store.dispatch('error/showLoadingActivity', true)
      StreamService.deleteStream(this.user.stream.id)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.user.stream.status = 'deleted'
          this.user = null
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
          this.user = null
        })
    },

    openDisconnectStripeConfirmDialog(user) {
      this.user = user
      this.show_disconnect_stripe_confirm_dialog = true
    },

    closeDisconnectStripeConfirmDialog() {
      this.show_disconnect_stripe_confirm_dialog = false
    },

    disconnectStripe() {
      this.closeDisconnectStripeConfirmDialog()
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        user_id: this.user.id,
      }
      AdminService.disconnectStripe(params)
        .then(() => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.user.stripe_connected = false
          this.user = null
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
          this.user = null
        })
    },

    toggleLiveVideo(user) {
      const params = {
        user_id: user.id,
      }
      AdminService.toggleLiveVideo(params)
    },

    openFreeStreamToggleConfirmDialog() {
      this.show_free_stream_toggle_confirm_dialog = true
    },

    closeFreeStreamToggleConfirmDialog() {
      this.show_free_stream_toggle_confirm_dialog = false
    },

    toggleLiveVideoFree(user) {
      if (user.stream && user.stream.status === 'running') {
        this.openFreeStreamToggleConfirmDialog()
        user.enabled_live_video_free = !user.enabled_live_video_free
        return
      }

      const params = {
        user_id: user.id,
      }
      AdminService.toggleLiveVideoFree(params)
    },

    openUserDeleteConfirmDialog(user) {
      this.user = user
      this.show_user_delete_confirm_dialog = true
    },

    closeUserDeleteConfirmDialog() {
      this.show_user_delete_confirm_dialog = false
    },

    sendConfirmEmail(user) {
      const params = {
        email: user.email,
      }
      AuthService.sendConfirmEmail(params)
        .then((response) => {
          // this.$store.dispatch('error/showSuccessToast', ['Resent a confirmation email'])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    removeAccount(user) {
      UserService.deleteUser(user.id)
        .then((response) => {
          this.users = this._.filter(this.users, (item) => item.id !== user.id)
          this.closeUserDeleteConfirmDialog()
        })
        .catch(() => {
          this.closeUserDeleteConfirmDialog()
        })
    },

    suspendAccount(user) {
      const params = {
        status: 'suspended',
      }
      UserService.updateUserStatus(user.id, params)
        .then((response) => {
          user.status = 'suspended'
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    activateAccount(user) {
      const params = {
        status: 'active',
      }
      UserService.updateUserStatus(user.id, params)
        .then((response) => {
          user.status = 'active'
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    updateUserRole(user, role) {
      const params = {
        role: role,
      }
      UserService.updateUserRole(user.id, params)
        .then((response) => {
          user.user_type = role
          this.users = this._.filter(this.users, (item) => item.id !== user.id)
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },

  created() {},

  watch: {
    pagination: {
      handler() {
        this.loadUsers()
      },
    },
  },
}
