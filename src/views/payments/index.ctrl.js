import { PaymentTypes, Filter } from '@/helper'

import AuthService from '@/services/auth'
import PaymentService from '@/services/payment'
import UserService from '@/services/user'

import sendMessage from '@/components/sendmessage'
import shareModal from '@/components/sharemodal'

import productModal from './components/product'


export default {
  components: {
    sendMessage,
    shareModal,
    productModal
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
      show_withdraw_dialog: false,
      show_withdraw_confirm_modal: false,
      withdraw_option: 'all',
      withdraw_amount: 1.00,
      histories: [],
      payment: {},
      show_product_modal: false,
      show_share_modal: false,
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
    },

    disableWithdrawButton () {
      return this.withdraw_option != 'all' &&
        (!this.withdraw_amount || this.withdraw_amount < 1 || this.currentUser.available_amount < this.withdraw_amount)
    },

    stripeLink () {
      return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.STRIPE_CONNECT_CLIENT_ID}&scope=read_write&state=${this.$store.state.auth.secret_code}`
    },

    withdrawAmount () {
      if (this.withdraw_option == 'all') {
        return this.currentUser.available_amount
      } else {
        return parseInt(this.withdraw_amount * 100)
      }
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

    openProductModal (payment) {
      this.payment = payment
      this.show_product_modal = true
    },

    closeProductModal () {
      this.show_product_modal = false
    },

    shareProduct () {
      this.closeProductModal()
      this.openShareModal()
    },

    openShareModal () {
      this.show_share_modal = true
    },

    closeShareModal () {
      this.show_share_modal = false
    },

    openWithdrawModal () {
      this.show_withdraw_dialog = true
    },

    closeWithdrawModal () {
      this.show_withdraw_dialog = false
    },

    openWithdrawConfirmModal () {
      this.closeWithdrawModal()
      this.show_withdraw_confirm_modal = true
    },

    closeWithdrawConfirmModal () {
      this.openWithdrawModal()
      this.show_withdraw_confirm_modal = false
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
      this.show_withdraw_confirm_modal = false
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        amount: this.withdrawAmount
      }
      PaymentService.withdrawMoney(params).then(response => {
        AuthService.setUser(response.body)
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', [`Withdrew $${Filter.formatNumber(this.withdrawAmount)} successfully.`])
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  },

  mounted () {
  }
}
