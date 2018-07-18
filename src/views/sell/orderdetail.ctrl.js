import _ from 'lodash'
import ProductService from '@/services/product'
import OrderService from '@/services/order'

export default {
  components: {
  },

  data () {
    return {
      active: 'none',
      order_id: null,
      order_detail: null,
      isPageReady: false
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },

    user () {
      return this.order_detail.customer
    },

    subTotal () {
      var sum = 0
      for (let index in this.order_detail.items) {
        const item = this.order_detail.items[index]
        sum += item.price * item.quantity
      }
      return sum
    },

    shippingTotal () {
      var sum = 0
      for (let index in this.order_detail.items) {
        const item = this.order_detail.items[index]
        if (item.shipping_cost) {
          sum += item.shipping_cost * item.quantity
        }
      }
      return sum
    },

    refundAmount () {
      return _.get(this.order_detail, 'refund_amount', 0)
    },

    total () {
      return this.subTotal + this.shippingTotal - this.refundAmount
    }
  },

  created () {
    if (!this.currentUser) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    this.$store.dispatch('navigator/goNextState', { page: 'sell', tab: '' })
    this.order_id = this.$route.params.slug
    if (this.order_id) {
      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([
        OrderService.getOrder(this.order_id)
      ]).then(values => {
        this.order_detail = values[0].body
        this.isPageReady = true
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(reason => {
        console.log(reason)
        this.$store.dispatch('error/showLoadingActivity', false)
        // this.$store.dispatch('error/showErrorToast', [reason])
      })
    }
  },

  methods: {
  },

  mounted () {
  }
}
