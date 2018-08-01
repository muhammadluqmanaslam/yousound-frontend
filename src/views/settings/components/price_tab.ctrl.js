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
        { name: '$1000 Upgrade', value: 100000 }
      ],
      repost_price: 100,
      show_repost_price_confirm_modal: false,
      show_payment_modal: false,
      isPageReady: false
    }
  },

  created () {
    this.resetRepostPrice()
  },

  methods: {
    resetRepostPrice() {
      this.repost_price = this.$store.state.auth.user.repost_price
    },

    openRepostPriceConfirmModal () {
      this.show_repost_price_confirm_modal = true
    },

    closeRepostPriceConfirmModal () {
      this.show_repost_price_confirm_modal = false
    },

    openPaymentModal () {
      this.closeRepostPriceConfirmModal()
      this.show_payment_modal = true
    },

    closePaymentModal () {
      this.show_payment_modal = false
    },

    setRepostPrice (token) {
      const userId = this.$store.state.auth.user.id
      const params = {
        repost_price: this.repost_price
      }
      if (token) {
        params['payment_token'] = token.id
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.setRepostPrice(userId, params).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', ['Saved'])
        AuthService.setUser(response.body)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  }
}
