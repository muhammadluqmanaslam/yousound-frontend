import _ from 'lodash'
import AdminService from '@/services/admin'
import signupApproveModal from './signup_approve_modal'
import signupDenyModal from './signup_deny_modal'
import SubscriptionService from '@/services/subscription'
import moment from 'moment'

export default {
  components: {
    signupApproveModal,
    signupDenyModal,
  },

  data() {
    return {
      active_tab: 'artists',
      subscriptions_tabs: [
        { id: 'artists', title: 'Artists' },
        { id: 'brands', title: 'Brands' },
        { id: 'listeners', title: 'Listeners' },
        { id: 'trial', title: 'Trial' },
        { id: 'cancelled', title: 'Cancelled' },
        { id: 'free_credit', title: 'Free Credit' },
      ],
      artists_headers: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'First Name', value: 'first_name', align: 'left' },
        { text: 'Last Name', value: 'last_name', align: 'left' },
        { text: 'Activate Date', value: 'activate_date', align: 'left' },
        { text: 'Tier', value: 'tier', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Member For Months', value: 'trial_end', align: 'left' },
        { text: 'Credits', value: 'credits', align: 'left' },
      ],

      brands_headers: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'First Name', value: 'first_name', align: 'left' },
        { text: 'Last Name', value: 'last_name', align: 'left' },
        { text: 'Activate Date', value: 'activate_date', align: 'left' },
        { text: 'Tier', value: 'tier', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Member For Months', value: 'trial_end', align: 'left' },
        { text: 'Credits', value: 'credits', align: 'left' },
      ],

      listeners_headers: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'First Name', value: 'first_name', align: 'left' },
        { text: 'Last Name', value: 'last_name', align: 'left' },
        { text: 'Activate Date', value: 'activate_date', align: 'left' },
        { text: 'Tier', value: 'tier', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Member For Months', value: 'trial_end', align: 'left' },
        { text: 'Credits', value: 'credits', align: 'left' },
      ],
      trial_headers: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'First Name', value: 'first_name', align: 'left' },
        { text: 'Last Name', value: 'last_name', align: 'left' },
        { text: 'Activate Date', value: 'activate_date', align: 'left' },
        { text: 'Tier', value: 'tier', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Member For Months', value: 'trial_end', align: 'left' },
        { text: 'Credits', value: 'credits', align: 'left' },
      ],

      cancelled_headers: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'First Name', value: 'first_name', align: 'left' },
        { text: 'Last Name', value: 'last_name', align: 'left' },
        { text: 'Activate Date', value: 'activate_date', align: 'left' },
        { text: 'Tier', value: 'tier', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Member For Months', value: 'trial_end', align: 'left' },
        { text: 'Credits', value: 'credits', align: 'left' },
      ],

      free_credit_headers: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'First Name', value: 'first_name', align: 'left' },
        { text: 'Last Name', value: 'last_name', align: 'left' },
        { text: 'Credit Remaining Days', value: 'trial_end', align: 'left' },
        { text: 'Tier', value: 'tier', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Member For Months', value: 'trial_end', align: 'left' },
        { text: 'Credits', value: 'credits', align: 'left' },
        { text: 'Credit Increase', value: 'Free Month Credit', align: 'left' },
        { text: 'Action', value: 'Action', align: 'left' },
      ],
      search_value: '',
      show_verification_modal: false,
      user: {},
      per_page_options: [50, 100, 150],
      subscriptions: [],
      total_subscriptions: 0,
      pagination: {
        // sortBy: 'created_at',
        // descending: true,
        // totalItems: 0,
        page: 1,
        rowsPerPage: 50,
      },
      isPageReady: true,
      choose_month: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "Forever"],
      selectedMonth: [],
    }
  },

  computed: {
    headers() {
      switch (this.active_tab) {
        case 'artists':
          return this.artists_headers
        case 'brands':
          return this.brands_headers
        case 'listeners':
          return this.listeners_headers
        case 'trial':
          return this.trial_headers
        case 'cancelled':
          return this.cancelled_headers
        case 'free_credit':
          return this.free_credit_headers
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
      AdminService.getFreeAccountCreditUsers(params)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.subscriptions = response.body.users
          this.total_subscriptions = response.body.pagination.total_count
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

    openVerificationModal(user) {
      const month = this.selectedMonth.filter(m => m.id == user.id)[0]
      if (month != null) {
        this.user = user
        this.show_verification_modal = true
      } else {
        this.$store.dispatch(
          'error/showErrorToast', ["Please select a month"]
        )
      }
    },

    async proceedFreeAccountCredit() {
      const row = this.selectedMonth.filter(m => m.id == this.user.id)[0]
      if (row != null) {
        let month = row.month
        let params = { id: this.user.id, free_credit_month: month }
        await SubscriptionService.freeAccountCredit(params).then((response) => {
          this.subscriptions.map(subscription => subscription.id == this.user.id ?
            subscription.trial_end = response.body.success_response : ''
          )
          const date = new Date(response.body.success_response)
          const success_response = `Trial of ${this.user.username} has been updated to ${this.formatDate(date)}.`
          this.$store.dispatch('error/showSuccessToast', [success_response])
          this.show_verification_modal = false
        }).catch((e) => {
          this.$store.dispatch('error/showErrorToast', [e.body.exception])
        })
      } else {
        this.$store.dispatch('error/showErrorToast', ["Please select a month"])
      }
    },

    closeVerificationModal() {
      this.show_verification_modal = false
    },

    selectMonth(month, id) {
      if(this.selectedMonth.length == 0) {
        this.selectedMonth.push({"id": id, "month": month})
      } else {
        for(let i=0;i<this.selectedMonth.length;i++) {
          if (this.selectedMonth[i].id == id) {
            this.selectedMonth[i] = {"id": id, "month": month}
          } else {
            this.selectedMonth.push({ "id": id, "month": month})
          }
        }
      }
    },

    getNumberOfMonths(signupDate) {
      const startDate = new Date(signupDate)
      const endDate = new Date()
      return endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear())
    },

    formatDate(value) {
      if (value) {
        return moment(String(value)).format('MMM DD, YYYY')
      }
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
