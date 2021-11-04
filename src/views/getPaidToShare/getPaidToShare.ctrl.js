import AuthService from '@/services/auth'
import UserService from '@/services/user'

import paymentModal from '@/components/paymentmodal'
import accordion from '@/components/accordion'

export default {
  props: {
    propMode: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    paymentModal,
    accordion,
  },

  data() {
    return {
      prices: [
        100,
        500,
        1000,
        2000,
        5000,
        10000,
        25000,
        50000,
        100000,
        250000,
        500000,
        1000000,
        2500000,
        5000000,
        10000000,
        25000000,
        50000000,
        100000000,
      ],
      repost_price: 100,
      proration: {
        add_amount: 0,
        expire_at: null,
      },
      show_repost_price_confirm_modal: false,
      show_payment_modal: false,
      isPageReady: false,
      accordions: [
        {
          title: 'How much does it cost?',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
        },
        {
          title: 'How often do I pay for my repost price?',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
        },
        {
          title: 'Can I change my price any time?',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
        },
        {
          title: 'How many followers should I have?',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
        },
        {
          title: 'How long do my accepted reposts last for ?',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
        },
        {
          title: 'How much should I charge?',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
        },
      ],
    }
  },

  computed: {
    stripeLink() {
      return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.STRIPE_CONNECT_CLIENT_ID}&scope=read_write&state=${this.$store.state.auth.secret_code}`
    },
    currentUser() {
      console.log(this.$store.state.auth.user);
      return this.$store.state.auth.user
    },

    repost_prices() {
      let arr = []
      for (let i in this.prices) {
        arr.push({
          name: `$${this.prices[i] / 100}${this.prices[i] > this.currentUser.max_repost_price ? ' Upgrade' : ''
                        }`,
          value: this.prices[i],
        })
      }
      return arr
    },
  },

  created() {
    this.resetRepostPrice()
  },

  methods: {
    resetRepostPrice() {
      this.repost_price = this.currentUser.repost_price
    },

    openRepostPriceConfirmModal() {
      if (this.repost_price == this.currentUser.repost_price) {
        return
      }

      const params = {
        new_repost_price: this.repost_price,
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.getRepostPriceProration(this.currentUser.id, params)
                .then((response) => {
                  this.$store.dispatch('error/showLoadingActivity', false)
                  this.proration = response.body
                    // console.log(this.proration)
                  if (this.proration.add_amount > 0) {
                    this.show_repost_price_confirm_modal = true
                  } else {
                    this.setRepostPrice(null)
                  }
                })
                .catch((e) => {
                  this.$store.dispatch('error/showLoadingActivity', false)
                })
    },

    closeRepostPriceConfirmModal() {
      this.show_repost_price_confirm_modal = false
    },

    openPaymentModal() {
      this.closeRepostPriceConfirmModal()
      if (this.proration.add_amount > 0) {
        this.show_payment_modal = true
      } else {
        this.setRepostPrice(null)
      }
    },

    closePaymentModal() {
      this.show_payment_modal = false
    },

    setRepostPrice(token) {
      const params = {
        repost_price: this.repost_price,
        payment_amount: this.proration.add_amount,
      }
            // console.log('setRepostPrice', params)
      if (token) {
        params['payment_token'] = token.id
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.setRepostPrice(this.currentUser.id, params)
                .then((response) => {
                  this.$store.dispatch('error/showLoadingActivity', false)
                  this.$store.dispatch('error/showSuccessToast', ['Saved'])
                  AuthService.setUser(response.body)
                })
                .catch((e) => {
                  this.$store.dispatch('error/showLoadingActivity', false)
                  this.$store.dispatch(
                        'error/showErrorToast',
                        e.body.errors || [e.body]
                    )
                })
    },

    learnMore() {
      this.$router.push({
        path: '/terms',
      })
    },
  },
}
