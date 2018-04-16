import _ from 'lodash'
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
      signups_tab: 'waiting',
      signups_tabs: [
        { id: 'waiting', title: 'Waiting For Approval' },
        { id: 'co-signed', title: 'Co-Signed' },
        { id: 'approved', title: 'Approved' },
        { id: 'denied', title: 'Denied' }
      ],
      waiting_headers: [
        { text: 'User', value: 'display_name', align: 'left' },
        { text: 'User Type', value: 'request_role', align: 'left' },
        { text: 'Date Signed Up', value: 'created_at', align: 'left' }
      ],
      invited_headers: [
        { text: 'User', value: 'display_name', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'Date', value: 'joined_date', align: 'left' },
        { text: 'Status', value: 'status', align: 'left' },
        { text: 'Invited By', value: 'invited_by', align: 'left' },
        { text: 'Profile', value:'facebook', align: 'left'}
      ],
      approved_headers: [
        { text: 'User', value: 'display_name', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'Date Signed Up', value: 'signed_up_date', align: 'center' },
        { text: 'Date Accepted', value: 'approved_date', align: 'center' },
        { text: 'Verified By', value: 'verified_by', align: 'left' },
        { text: 'View Submission', value:'facebook', align: 'left'}
      ],
      denied_headers: [
        { text: 'User', value: 'display_name', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'Date Signed Up', value: 'signed_up_date', align: 'center' },
        { text: 'Date Denied', value: 'denied_date', align: 'center' },
        { text: 'Verified By', value: 'verified_by', align: 'left' },
        { text: 'View Submission', value:'facebook', align: 'left'}
      ],
      signups_search: '',
      signups: [],
      show_approve_modal: false,
      show_deny_modal: false,
      user: {},
      isPageReady: true
    }
  },

  computed: {
    filtered_items () {
      switch (this.signups_tab) {
        case 'waiting':
          return _.filter(this.signups, (user) => { return user.request_status === 'pending' && !user.inviter })
        case 'co-signed':
          return _.filter(this.signups, (user) => { return user.request_status === 'pending' && user.inviter })
        case 'approved':
          return _.filter(this.signups, (user) => { return user.request_status === 'accepted' })
        case 'denied':
          return _.filter(this.signups, (user) => { return user.request_status === 'denied' })
        default:
          return []
      }
    }
  },

  created () {
    Promise.all([
      AdminService.getSignupUsers()
    ]).then(values => {
      this.signups = values[0].body.users
    }).catch(reason => {
      console.log(reason)
    })
  },

  methods: {
    openApproveModal (user) {
      this.user = user
      this.show_approve_modal = true
    },

    closeApproveModal () {
      this.show_approve_modal = false
    },

    showDenyModal () {
      this.show_deny_modal = true
    },

    closeDenyModal () {
      this.show_deny_modal = false
    },

    approveUser (user) {
      // console.log('approveUser', user)
      AdminService.approveUser({ user_id: user.id }).then(response => {
        // console.log('approveUser', user)
        // user.request_status = 'accepted'
        // user.user_type = user.request_role
        _.assignIn(user, response.body)
        const arr = this.signups.slice()
        this.signups = arr
        this.closeApproveModal()
      })
    },

    denyUser (user) {
      this.show_approve_modal = false
      this.show_deny_modal = true
    },

    viewSubmission (user) {
      // console.log('viewSubmission', user, this.user)
      if (!user.denial_reason || !user.denial_description) {
        return
      }

      const params = {
        user_id: user.id,
        denial_reason: user.denial_reason,
        denial_description: user.denial_description
      }
      AdminService.denyUser(params).then(response => {
        console.log('viewSubmission', user)
        user.request_status = 'denied'
        const arr = this.signups.slice()
        this.signups = arr
        this.closeDenyModal()
      })
    },
  }
}
