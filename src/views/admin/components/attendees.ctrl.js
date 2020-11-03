import _ from 'lodash'
import AttendeeService from '@/services/attendee'

export default {
  components: {},

  data() {
    return {
      current_tab: 'all',
      tabs: [{ id: 'all', title: 'All Attendees' }],
      attendee_headers: [
        {
          text: 'Full Name',
          value: 'full_name',
          align: 'left',
        },
        {
          text: 'Artist / Brand / Label Name',
          value: 'display_name',
          align: 'left',
        },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Account Type', value: 'account_type', align: 'left' },
        { text: 'Referred By', value: 'referred_by', align: 'left' },
        { text: 'Status', value: 'status', align: 'center' },
        { text: '', value: '', align: 'center' },
      ],
      search_keyword: '',
      attendees: [],
      attendee: {},
      pagination: {
        sortBy: 'created_at',
        descending: true,
        page: 1,
        rowsPerPage: 50,
        totalItems: 0,
      },
      per_page_options: [50, 100, 150],
      show_attendee_delete_confirm_dialog: false,
      isPageReady: true,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
  },

  created() {
    this.$store.dispatch('error/showLoadingActivity', true)
    Promise.all([AttendeeService.getAttendees()])
      .then((values) => {
        this.attendees = values[0].body
        this.$store.dispatch('error/showLoadingActivity', false)
      })
      .catch((reason) => {
        console.log(reason)
        this.$store.dispatch('error/showLoadingActivity', false)
      })
  },

  methods: {
    inviteAttendee(attendee) {
      const attendee_id = attendee.id
      AttendeeService.inviteAttendee(attendee_id)
        .then((response) => {
          const attendeeIndex = _.findIndex(
            this.attendees,
            (attendee) => attendee.id === attendee_id
          )
          this.attendees[attendeeIndex].status = 'invited'
          this.attendees[attendeeIndex].inviter = this.currentUser
          const arr = this.attendees.slice()
          this.attendees = arr
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    openAttendeeDeleteConfirmDialog(attendee) {
      this.attendee = attendee
      this.show_attendee_delete_confirm_dialog = true
    },

    closeAttendeeDeleteConfirmDialog() {
      this.show_attendee_delete_confirm_dialog = false
    },

    deleteAttendee(attendee) {
      AttendeeService.deleteAttendee(attendee.id)
        .then(() => {
          this.closeAttendeeDeleteConfirmDialog()
          this.attendees = _.filter(
            this.attendees,
            (item) => item.id !== attendee.id
          )
        })
        .catch((e) => {
          this.closeAttendeeDeleteConfirmDialog()
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },
}
