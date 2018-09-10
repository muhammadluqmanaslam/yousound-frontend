import _ from 'lodash'
import AttendeeService from '@/services/attendee'

export default {
  components: {
  },

  data() {
    return {
      current_tab: 'all',
      tabs: [
        { id: 'all', title: 'All Attendees' }
      ],
      attendee_headers: [
        { text: 'Full Name', value: 'full_name', align: 'left' },
        { text: 'Artist / Brand / Label Name', value: 'display_name', align: 'left' },
        { text: 'Email', value: 'email', align: 'left'},
        { text: 'Account Type', value: 'account_type', align: 'left' },
        { text: 'Referred By', value: 'referred_by', align: 'left' },
        { text: 'Status', value: 'status', align: 'center' }
      ],
      search_keyword: '',
      attendees: [],
      pagination: {
        page: 1,
        rowsPerPage: 100,
        descending: true,
        totalItems: 0
      },
      per_page_options: [50, 100, 150],
      isPageReady: true
    }
  },

  created() {
    this.$store.dispatch('error/showLoadingActivity', true)
    Promise.all([
      AttendeeService.getAttendees()
    ]).then(values => {
      this.attendees = values[0].body
      this.$store.dispatch('error/showLoadingActivity', false)
    }).catch(reason => {
      console.log(reason)
      this.$store.dispatch('error/showLoadingActivity', false)
    })
  },

  methods: {
    inviteAttendee(attendee) {
      const attendee_id = attendee.id
      AttendeeService.inviteAttendee(attendee_id).then(response => {
        const attendeeIndex = _.findIndex(this.attendees, (attendee) => (attendee.id == attendee_id))
        this.attendees[attendeeIndex].status = 'invited'
        const arr = this.attendees.slice()
        this.attendees = arr
      })
    }
  }
}
