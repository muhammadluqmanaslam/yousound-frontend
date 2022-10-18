import _ from 'lodash'
import AdminService from '@/services/admin'
import signupApproveModal from './signup_approve_modal'
import signupDenyModal from './signup_deny_modal'

export default {
  components: {
    signupApproveModal,
    signupDenyModal,
  },

  data() {
    return {
      active_tab: 'waiting',
      signups_tabs: [
        { id: 'waiting', title: 'Waiting For Approval' },
        { id: 'co-signed', title: 'Co-Signed' },
        { id: 'approved', title: 'Approved' },
        { id: 'denied', title: 'Denied' },
      ],
      waiting_headers: [
        { text: 'User', value: 'display_name', align: 'left' },
        { text: 'User Type', value: 'request_role', align: 'left' },
        { text: 'Genre', value: 'genre.name', align: 'left' },
        { text: 'Date Signed Up', value: 'created_at', align: 'left' },
        { text: 'Invited By', value: 'invited_by', align: 'left' },
        { text: '', value: 'id', align: 'left' },
      ],
      invited_headers: [
        { text: 'User', value: 'display_name', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'Genre', value: 'genre.name', align: 'left' },
        { text: 'Date', value: 'joined_date', align: 'left' },
        { text: 'Status', value: 'status', align: 'left' },
        { text: 'Invited By', value: 'invited_by', align: 'left' },
        { text: '', value: 'id', align: 'left' },
      ],
      approved_headers: [
        { text: 'User', value: 'display_name', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'Date Signed Up', value: 'signed_up_date', align: 'center' },
        { text: 'Date Accepted', value: 'approved_date', align: 'center' },
        { text: 'Verified By', value: 'verified_by', align: 'left' },
        { text: '', value: '', align: 'left' },
      ],
      denied_headers: [
        { text: 'User', value: 'display_name', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'Date Signed Up', value: 'signed_up_date', align: 'center' },
        { text: 'Date Denied', value: 'denied_date', align: 'center' },
        { text: 'Verified By', value: 'verified_by', align: 'left' },
        { text: '', value: 'id', align: 'left' },
      ],
      search_value: '',
      show_approve_modal: false,
      show_deny_modal: false,
      user: {},
      per_page_options: [50, 100, 150],
      signups: [],
      total_signups: 0,
      pagination: {
        // sortBy: 'created_at',
        // descending: true,
        // totalItems: 0,
        page: 1,
        rowsPerPage: 50,
      },
      isPageReady: true,
    }
  },

  computed: {
    headers() {
      switch (this.active_tab) {
        case 'waiting':
          return this.waiting_headers
        case 'co-signed':
          return this.invited_headers
        case 'approved':
          return this.approved_headers
        case 'denied':
          return this.denied_headers
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
      AdminService.getSignupUsers(params)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.signups = response.body.users
          this.total_signups = response.body.pagination.total_count
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
        page: 1,
        rowsPerPage: 10,
      }
    },

    onKeyEnter(e) {
      this.loadUsers()
    },

    openApproveModal(user) {
      this.user = user
      this.show_approve_modal = true
    },

    closeApproveModal() {
      this.show_approve_modal = false
    },

    showDenyModal() {
      this.show_deny_modal = true
    },

    closeDenyModal() {
      this.show_deny_modal = false
    },

    approveUser(user) {
      // console.log('approveUser', user)
      this.$store.dispatch('error/showLoadingActivity', true)

      AdminService.approveUser({ user_id: user.id }).then((response) => {
        // console.log('approveUser', user)
        // user.request_status = 'accepted'
        // user.user_type = user.request_role
        this.$store.dispatch('error/showLoadingActivity', false)
        _.assignIn(user, response.body)
        this.signups = this.signups.filter(u => u.id != user.id)
        this.$store.dispatch('error/showSuccessToast', ["User account has been successfully approved."])
        this.closeApproveModal()
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', [e.body.errors])
      })
    },

    denyUser() {
      this.show_approve_modal = false
      this.show_deny_modal = true
    },

    viewSubmission(user) {
      // console.log('viewSubmission', user, this.user)
      if (!user.denial_reason || !user.denial_description) {
        return
      }

      const params = {
        user_id: user.id,
        denial_reason: user.denial_reason,
        denial_description: user.denial_description,
      }
      this.$store.dispatch('error/showLoadingActivity', true)

      AdminService.denyUser(params).then((response) => {
        console.log('viewSubmission', user)
        user.request_status = 'denied'
        this.signups = this.signups.filter(u => u.id != user.id)
        this.closeDenyModal()
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', ["User account has been successfully denied."])
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', [e.body.errors])
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
