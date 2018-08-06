import AuthService from '@/services/auth.js'

export default {
  components: {
  },

  data() {
    return {
      account_types: [
        { id: 'artist', name: 'Artist' },
        { id: 'brand', name: 'Brand' },
        { id: 'label', name: 'Label' }
      ],
      attendee: {
        full_name: '',
        display_name: '',
        email: '',
        account_type: ''
      },
      show_attendee_confirm_dialog: false
    }
  },

  created() {
    this.$store.dispatch('navigator/goNextState', { page: '', tab: '' })
  },

  methods: {
    submit () {
      this.$validator.validateAll().then(response => {
        if (response === true) {
          const params = {
            attendee: this.attendee
          }
          this.$store.dispatch('error/showLoadingActivity', true)
          AuthService.addAttendee(params).then(response => {
            this.$store.dispatch('error/showLoadingActivity', false)
            // this.$store.dispatch('error/showSuccessToast', ['You reserved your account'])
            this.show_attendee_confirm_dialog = true
          }).catch(e => {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        } else {
          this.$store.dispatch('error/showErrorToast', [this.errors.items[0].msg])
        }
      })
    }
  }
}
