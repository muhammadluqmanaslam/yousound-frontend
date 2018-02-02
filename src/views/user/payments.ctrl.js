import PaymentService from '@/services/payment'
import UserService from '@/services/user'
import sendMessage from '@/components/sendmessage'

export default {
  components: {
    sendMessage
  },

  data () {
    return {
      active: 'received',
      tabs: [
        {
          id: 'received',
          title: 'Received'
        },
        {
          id: 'sent',
          title: 'Sent'
        }
      ],
      user: {},
      withdraw_dialog: false,
      withdarw_option: 'all',
      histories: [],
      withdraw_amount: null,
      send_message_dialog: false,
      messaging_user: {},
      page_index: 1,
      total_pages: 1,
      items_per_page: 6 * 5
    }
  },

  computed: {
    sent_histores () {
      // _.filter(this.histories, (history) => { history.type == 'sent' })
      return this.histories
    },

    received_histories () {
      // _.filter(this.histories, (history) => { history.type == 'received' })
      return this.histories
    }
  },

  created () {
    this.$store.dispatch('navigator/goNextState', {page: 'payments', tab: ''})
    this.loadUserInfo()
  },

  methods: {
    loadUserInfo() {
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.getUserInfo(this.$store.state.auth.user.slug).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.user = response.body
        this.loadPayments('received')
      })
      .catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (e.body.errors) {
          this.$store.dispatch('error/showErrorToast', e.body.errors)
        } else {
          this.$store.dispatch('error/showErrorToast', [e.body])
        }
      })
    },

    showSendMessageDialog (history) {
      this.send_message_dialog = true
      if(this.active === 'received') {
        this.messaging_user = history.sender
      } else {
        this.messaging_user = history.receiver
      }
    },

    hideSendMessageDialog () {
      this.send_message_dialog = false
    },

    loadPayments (tab) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = new FormData()
      params.append('page', this.page_index)
      params.append('per_page', this.items_per_page)
      if (tab === 'sent') {
        PaymentService.getSentPayments(params).then( response=> {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.histories = response.body.payments
        }).catch(e => {
          this.$store.dispatch('error/showLoadingActivity', false)
          if (e.body.errors) {
            this.$store.dispatch('error/showErrorToast', e.body.errors)
          } else {
            this.$store.dispatch('error/showErrorToast', [e.body])
          }
        })
      } else {
        PaymentService.getReceivedPayments(params).then( response=> {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.histories = response.body.payments
        }).catch(e => {
          this.$store.dispatch('error/showLoadingActivity', false)
          if (e.body.errors) {
            this.$store.dispatch('error/showErrorToast', e.body.errors)
          } else {
            this.$store.dispatch('error/showErrorToast', [e.body])
          }
        })
      }
    },

    withdrawMoney () {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = new FormData()
      params.append('amount', this.withdraw_amount)
      PaymentService.withdrawMoney(params).then( response=> {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', [`Deposited ${this.withdraw_amount} successfully.`])
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (e.body.errors) {
          this.$store.dispatch('error/showErrorToast', e.body.errors)
        } else {
          this.$store.dispatch('error/showErrorToast', [e.body])
        }
      })
    }
  },

  mounted () {
  }
}
