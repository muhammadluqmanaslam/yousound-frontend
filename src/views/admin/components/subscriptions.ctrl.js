import _ from 'lodash'
import AdminService from '@/services/admin'
import signupApproveModal from './signup_approve_modal'
import signupDenyModal from './signup_deny_modal'
import SubscriptionService from '@/services/subscription'
import moment from 'moment'
import contentTopHeader from '@/components/contentTopHeader'
import VueJsonToCsv from 'vue-json-to-csv'


export default {
  components: {
    signupApproveModal,
    signupDenyModal,
    contentTopHeader,
    VueJsonToCsv,
  },

  data() {
    return {
      active_tab: 'artists',
      small_input: false,
      tabs_count: [],
      cancelledEmails: [],
      selectedExportOption: 'All',
      search: '',
      subscriptions_tabs: [
        { id: 'artists', title: 'Artists' },
        { id: 'brands', title: 'Brands' },
        { id: 'listeners', title: 'Listeners' },
        { id: 'trial', title: 'Trial' },
        { id: 'trial_drop_off', title: 'Trial Drop Off' },
        { id: 'cancelled', title: 'Cancelled' },
        { id: 'free_credit', title: 'Free Credit', sort: 'falsesrc/views/admin/components/general.scss' },
       
      ],
      artists_headers: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'Name', value: 'first_name last_name', align: 'left' },
        
        { text: 'Activate Date', value: 'activate_date', align: 'left' },
        { text: 'Tier', value: 'plan', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Member For (mo)', value: 'member_for_months', align: 'left' },
        { text: 'Credits', value: 'trial_end', align: 'left' },
      ],

      brands_headers: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'Name', value: 'first_name last_name', align: 'left' },
       
        { text: 'Activate Date', value: 'trial_start', align: 'left' },
        { text: 'Tier', value: 'plan', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Member For Months', value: 'member_for_months', align: 'left' },
        { text: 'Credits', value: 'trial_end', align: 'left' },
      ],

      listeners_headers: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'Name', value: 'first_name last_name', align: 'left' },
        { text: 'Activate Date', value: 'activate_date', align: 'left' },
        { text: 'Tier', value: 'plan', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Member For Months', value: 'member_for_months', align: 'left' },
        { text: 'Credits', value: 'trial_end', align: 'left' },
      ],
      trial_headers: [
        { text: 'Users', value: 'username', align: 'left' },
        { text: 'User type', value: 'user_type', align: 'left' },
        { text: 'First / Last Name', value: 'first_name last_name', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        { text: 'Member For (mo)', value: 'member_for_months', align: 'left' },
        { text: 'Ghost trial remaining', value: 'free_trial_time', align: 'left' },
        { text: 'Credits', value: 'trial_end', align: 'left' },
        // { text: 'Trial Completed', value: 'trial_complete', align: 'left' },
      ],
      trial_drop_off_headers: [
        { text: 'Users', value: 'username', align: 'left' },
        { text: 'User type', value: 'user_type', align: 'left' },
        { text: 'Initial signup type', value: 'initial_signup_type', align: 'left' },
        { text: 'First / Last Name', value: 'first_name', align: 'left' },
       
        { text: 'Email', value: 'email', align: 'left' },
        
        { text: 'Credits', value: 'trial_end', align: 'left' }
      ],
      cancelled_headers: [
        { text: 'Users', value: 'username', align: 'left' },
        { text: 'User type', value: 'user_type', align: 'left' },
        { text: 'Initial signup type', value: 'initial_signup_type', align: 'left' },
        { text: 'First / Last Name', value: 'first_name last_name', align: 'left' },
       
        { text: 'Email', value: 'email', align: 'left' },

        { text: 'Credits', value: 'trial_end', align: 'left' },
      ],

      free_credit_headers: [
        { text: 'Users', value: 'username', align: 'left' },
        { text: 'User Type', value: 'user_type', align: 'left' },
        { text: 'Name', value: 'first_name last_name', align: 'left' },
        
        { text: 'Activate date', value: 'trial_start', align: 'left' },
        { text: 'Tier', value: 'plan', align: 'left' },
        { text: 'Credit Remaining', value: 'trial_end', align: 'left' },
        { text: 'Email', value: 'email', align: 'left' },
        
        { text: 'Member For (mo)', value: 'trial_start', align: 'left' },
        // { text: 'Credits', value: 'trial_end', align: 'center' },
        { text: 'Credit Increase', value: 'free_month_credits', align: 'left' },
        { text: 'Action', value: 'Action', align: 'center' },
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
        case 'trial_drop_off':
          return this.trial_drop_off_headers
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
          this.tabs_count = response.body.tabs_count
          if (this.active_tab == 'cancelled' || this.active_tab == 'trial_drop_off') {
            this.cancelledEmails = []
            this.selectedExportOption = 'All'
            this.subscriptions.map(subscription => {
              this.cancelledEmails.push({email: subscription.email})
            })
          }
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    filterCsvData(value) {
      this.cancelledEmails= []
      this.selectedExportOption = value
      if (value == 'All') {
        this.subscriptions.map(subscription => {
          this.cancelledEmails.push({email: subscription.email})
        })
      } else if (value == 'creator') {
        this.subscriptions.map(subscription => {
          if (subscription.user_type == 'artist' || subscription.user_type == 'brand') {
            this.cancelledEmails.push({email: subscription.email})
          }
        })
      } else if (value == 'listener') {
        this.subscriptions.map(subscription => {
          if (subscription.user_type == 'listener') {
            this.cancelledEmails.push({email: subscription.email})
          }
        })
      }
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
