import { PaymentTypes } from '@/helper'
import AuthService from '@/services/auth'
import PaymentService from '@/services/payment'
import UserService from '@/services/user'
import sendMessage from '@/components/sendmessage'

export default {
  components: {
    sendMessage
  },

  data () {
    return {
      activeTab: 'received',
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
    currentUser () {
      return this.$store.state.auth.user
    },

    PaymentTypes () {
      return PaymentTypes
    }
  },

  watch: {
    '$route' (toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      this.setTab(tab)
    }
  },

  created () {
    UserService.getUserInfo(this.$store.state.auth.user.slug).then(response => {
      AuthService.setUser(response.body)
      const tab = this.$route.hash.substr(1)
      this.setTab(tab)
    }).catch(e => {
      this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
    })
  },

  methods: {
    showSendMessageDialog (history) {
      this.send_message_dialog = true
      if(this.activeTab === 'received') {
        this.messaging_user = history.sender
      } else {
        this.messaging_user = history.receiver
      }
    },

    hideSendMessageDialog () {
      this.send_message_dialog = false
    },

    onTab (tab) {
      this.$router.push({
        path: this.$route.path,
        hash: tab
      })
    },

    setTab (tab) {
      if (!tab)
        tab = 'received'

      this.activeTab = tab
      this.$store.dispatch('navigator/goNextState', { page: 'payments', tab: '' })
      this.loadPayments(tab)
    },

    loadPayments (tab) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        page: this.page_index,
        per_page: this.items_per_page
      }
      if (tab === 'sent') {
        PaymentService.getSentPayments(params).then( response=> {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.histories = response.body.payments
        }).catch(e => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      } else {
        PaymentService.getReceivedPayments(params).then( response=> {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.histories = response.body.payments
        }).catch(e => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
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
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  },

  mounted () {
  }
}
