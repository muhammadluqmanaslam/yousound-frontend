// import AdminService from '@/services/admin'
import PaymentService from '@/services/payment'
import { Stripe } from '@/helper'

export default {
  components: {},

  data() {
    return {
      tabs: [
        { id: 'all', title: 'All Transactions' },
        // { id: 'refunded', title: 'Refunded Transactions' },
      ],
      active_tab: 'all',
      headers: [
        { text: 'Sender', value: 'sender.display_name', align: 'left' },
        { text: 'Receiver', value: 'receiver.display_name', align: 'left' },
        { text: 'Sent Amount', value: 'sent_amount', align: 'center' },
        { text: 'Received Amount', value: 'received_amount', align: 'center' },
        { text: 'Type', value: 'payment_type', align: 'center' },
        { text: 'Status', value: 'status', align: 'center' },
        { text: 'Created', value: 'created_at', align: 'center' },
      ],
      searchValue: '',
      per_page_options: [50, 100, 150],
      all_transactions: [],
      refunded_transactions: [],
      all_pagination: {
        page: 1,
        rowsPerPage: 50,
      },
      refunded_pagination: {
        page: 1,
        rowsPerPage: 50,
      },
      total_all_transactions: 0,
      total_refunded_transactions: 0,
      calculateFee: Stripe.calculateFee,
      isPageReady: true,
    }
  },

  created() {},

  methods: {
    loadAllTransactions() {
      const params = {
        q: this.searchValue,
        page: this.all_pagination.page,
        per_page: this.all_pagination.rowsPerPage,
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      PaymentService.getAllPayments(params)
        .then((response) => {
          this.all_transactions = response.body.payments
          this.total_all_transactions = response.body.pagination.total_count
          this.$store.dispatch('error/showLoadingActivity', false)
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
        })
    },

    loadRefundedTransactions() {
      const params = {
        q: this.searchValue,
        payment_types: 'refund',
        page: this.all_pagination.page,
        per_page: this.all_pagination.rowsPerPage,
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      PaymentService.getAllPayments(params)
        .then((response) => {
          this.refunded_transactions = response.body.payments
          this.total_refunded_transactions =
            response.body.pagination.total_count
          this.$store.dispatch('error/showLoadingActivity', false)
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
        })
    },

    onTab(tab) {
      this.active_tab = tab
    },

    onKeyEnter(e) {
      // console.log('onKeyEnter', this.active_tab, this.searchValue, e)
      switch (this.active_tab) {
        case 'all':
          this.loadAllTransactions()
          break
        case 'refunded':
          this.loadRefundedTransactions()
          break
      }
    },
  },

  watch: {
    all_pagination: {
      handler() {
        this.loadAllTransactions()
      },
    },

    refunded_pagination: {
      handler() {
        this.loadRefundedTransactions()
      },
    },
  },
}
