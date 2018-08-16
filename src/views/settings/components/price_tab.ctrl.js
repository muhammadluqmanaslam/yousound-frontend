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
      proration: {
        sent_amount: 0,
        remaining_amount: 0
      },
      show_repost_price_confirm_modal: false,
      show_payment_modal: false,
      isPageReady: false
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },

    additionalAmount () {
      let amount = 0
      if (this.repost_price > 100 && this.repost_price > this.proration.remaining_amount) {
        amount = this.repost_price - this.proration.remaining_amount
      }
      // console.log('additionalAmount', amount)
      return amount
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

      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.getRepostPriceProration(this.currentUser.id).then(response => {
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
      if (this.additionalAmount > 0) {
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
        payment_amount: this.additionalAmount
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
    }
  }
}
