import contentTopHeader from '@/components/contentTopHeader'
import paymentModal from '@/components/paymentmodal'

export default {
  components: {
    paymentModal,
    contentTopHeader,
  },

  props: {},

  data() {
    return {
      hour: 1,
      showPaymentModal: false,
      selected: {
        plan: {},
        hour: null,
      },
      plans: [
        {
          title: 'Basic',
          viewersLimit: 100,
          price: 9.99,
          benefits: [
            '100 concurrent viewer limit',
            'Unused time rolls over',
          ],
          id: 'basic',
          selectedHour: 1,
        },
        {
          title: 'Plus',
          viewersLimit: 500,
          price: 39.99,
          benefits: [
            '500 concurrent viewer limit',
            'Unused time rolls over',
          ],
          id: 'plus',
          selectedHour: 1,
        },
        {
          title: 'Pro',
          viewersLimit: 1000,
          price: 74.99,
          benefits: [
            '1,000 concurrent viewer limit',
            'Unused time rolls over',
          ],
          id: 'pro',
          selectedHour: 1,
        },
      ],
    }
  },

  computed: {
    hasFree_stream_seconds() {
      return this.currentUser.free_stream_seconds !== undefined && this.currentUser.free_stream_seconds > 0
    },
    currentUser() {
      let user = this.$store.state.auth.user
      // user.free_stream_seconds = 0 // test
      return user
    },
    hours() {
      const num = Array.from({length: 24}, (_, i) => ({value: i + 1, title: i + 1 + ' Hour'}))
      return num
    },
    payable() {
      const payable = this.selected.plan.price * this.selected.plan.selectedHour
      return payable
    },
  },

  created() {},

  methods: {
    getPayable(plan) {
      this.selected.plan = plan
      this.openPaymentDialog()
    },
    openPaymentDialog() {
      this.showPaymentModal = true
    },

    closePaymentDialog() {
      this.showPaymentModal = false
    },

    proceedToUpload() {
      this.$router.push({name: "VideoCreate"})
    },
  },

  mounted() {
    console.log(this.user)
  },
}
