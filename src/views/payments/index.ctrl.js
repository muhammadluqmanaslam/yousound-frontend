import { PaymentTypes, Filter } from '@/helper'

import AuthService from '@/services/auth'
import PaymentService from '@/services/payment'
import UserService from '@/services/user'

import productModal from './components/product'
import sendMessage from '@/components/sendmessage'
import shareModal from '@/components/sharemodal'
import UserCard from  '@/components/user_card'

export default {
  components: {
    sendMessage,
    shareModal,
    productModal,
    UserCard
  },

  data () {
    return {
      active_tab: 'received',
      tabs: [
        { id: 'received', title: 'Received' },
        { id: 'sent', title: 'Sent' }
      ],
      show_withdraw_dialog: false,
      show_withdraw_confirm_modal: false,
      withdraw_option: 'all',
      withdraw_amount: 1.00,
      show_refund_confirm_dialog: false,
      show_refund_dialog: false,
      refund_option: 'all',
      refund_amount: 1.00,
      refund_description: '',
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
    },

    refundAmount () {
      switch (this.payment.payment_type) {
        case 'pay_view_stream':
          return this.payment.received_amount
        default:
          if (this.refund_option == 'all') {
            return this.payment.sent_amount - this.payment.refund_amount
          } else {
            return parseInt(this.refund_amount * 100)
          }
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
    isActiveTab(tab) {
      return this.active_tab == tab
    },

    showSendMessageDialog (history) {
      this.send_message_dialog = true
      if(this.active_tab === 'received') {
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

    openRefundDialog (payment) {
      this.payment = payment
      switch (this.payment.payment_type) {
        case 'pay_view_stream':
          this.openRefundConfirmDialog()
          break
        default:
          this.show_refund_dialog = true
      }
    },

    closeRefundDialog () {
      this.show_refund_dialog = false
    },

    openRefundConfirmDialog () {
      this.closeRefundDialog()
      this.show_refund_confirm_dialog = true
    },

    closeRefundConfirmDialog () {
      // this.show_refund_dialog = true
      this.show_refund_confirm_dialog = false
    },

    canRefund (payment) {
      let val = 'Fully Refunded'
      switch (payment.payment_type) {
        case 'buy':
          if (payment.sent_amount > payment.refund_amount) {
            val = true
          }
          break
        case 'pay_view_stream':
          if (payment.received_amount > payment.refund_amount) {
            val = true
          }
          break
        default:
          val = ''
      }

      return val
    },

    refundMoney () {
      // console.log('refundMoney', this.refundAmount, this.refund_description, this.payment)
      this.show_refund_confirm_dialog = false
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        amount: this.refundAmount,
        description: this.refund_description
      }
      PaymentService.refundMoney(this.payment.id, params).then(response => {
        AuthService.setUser(response.body)
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', [`Refunded $${Filter.formatNumber(this.refundAmount)} successfully.`])

        this.payment.refund_amount += this.refundAmount
        const arr = this.histories.slice();
        this.histories = arr;
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
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

      this.active_tab = tab
      this.$store.dispatch('navigator/goNextState', { page: 'payments', tab: '' })
      this.page_index = 1
      this.total_pages = 1
      this.histories = []
      this.loadPayments(tab, this.page_index)
    },

    loadPayments (tab, page) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        page: page,
        per_page: this.items_per_page
      }
      if (tab === 'sent') {
        PaymentService.getSentPayments(params).then(response=> {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.page_index = response.body.pagination.current_page
          this.total_pages = response.body.pagination.total_pages
          this.histories = this.histories.concat(response.body.payments)
        }).catch(e => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      } else {
        PaymentService.getReceivedPayments(params).then(response=> {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.page_index = response.body.pagination.current_page
          this.total_pages = response.body.pagination.total_pages
          this.histories = this.histories.concat(response.body.payments)
        }).catch(e => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      }
    },

    loadMore () {
      this.loadPayments(this.tab, this.page_index + 1)
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
