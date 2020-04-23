import AuthService from '@/services/auth'
import UserService from '@/services/user'

import paymentModal from '@/components/paymentmodal'

export default {
  components: {
    paymentModal
  },

  data () {
    return {
      repost_prices: [
        { name: '$1', value: 100 },
        { name: '$5 Upgrade', value: 500 },
        { name: '$10 Upgrade', value: 1000 },
        { name: '$20 Upgrade', value: 2000 },
        { name: '$50 Upgrade', value: 5000 },
        { name: '$100 Upgrade', value: 10000 },
        { name: '$250 Upgrade', value: 25000 },
        { name: '$500 Upgrade', value: 50000 },
        { name: '$1000 Upgrade', value: 100000 },
        { name: '$2500 Upgrade', value: 250000 },
        { name: '$5000 Upgrade', value: 500000 },
        { name: '$10000 Upgrade', value: 1000000 },
        { name: '$25000 Upgrade', value: 2500000 },
        { name: '$50000 Upgrade', value: 5000000 },
        { name: '$100000 Upgrade', value: 10000000 },
        { name: '$250000 Upgrade', value: 25000000 },
        { name: '$500000 Upgrade', value: 50000000 },
        { name: '$1000000 Upgrade', value: 100000000 },
        // { name: '$2500000 Upgrade', value: 250000000 },
        // { name: '$5000000 Upgrade', value: 500000000 },
      ],
      repost_price: 100,
      proration: {
        add_amount: 0,
        expire_at: null
      },
      show_repost_price_confirm_modal: false,
      show_payment_modal: false,
      isPageReady: false
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    }
  },

  created () {
    this.resetRepostPrice()
  },

  methods: {
    resetRepostPrice() {
      this.repost_price = this.currentUser.repost_price
    },

    openRepostPriceConfirmModal () {
      if (this.currentUser.repost_price == this.repost_price) {
        return
      }

      const params = {
        new_repost_price: this.repost_price
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.getRepostPriceProration(this.currentUser.id, params).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.proration = response.body
        // console.log(this.proration)
        this.show_repost_price_confirm_modal = true
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
      })
    },

    closeRepostPriceConfirmModal () {
      this.show_repost_price_confirm_modal = false
    },

    openPaymentModal () {
      this.closeRepostPriceConfirmModal()
      if (this.proration.add_amount > 0) {
        this.show_payment_modal = true
      } else {
        this.setRepostPrice(null)
      }
    },

    closePaymentModal () {
      this.show_payment_modal = false
    },

    setRepostPrice (token) {
      const params = {
        repost_price: this.repost_price,
        payment_amount: this.proration.add_amount
      }
      // console.log('setRepostPrice', params)
      if (token) {
        params['payment_token'] = token.id
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.setRepostPrice(this.currentUser.id, params).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', ['Saved'])
        AuthService.setUser(response.body)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    learnMore() {
      this.$router.push({
        path: '/terms'
      })
    }
  }
}
