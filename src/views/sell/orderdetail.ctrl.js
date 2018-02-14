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
          sum += item.shipping_cost
        }
      }
      return sum
    },

    feeTotal () {
      var sum = 0
      for (let index in this.order_detail.items) {
        const item = this.order_detail.items[index]
        if (item.fee) {
          sum += item.fee
        }
      }
      return sum
    },

    total () {
      return this.subTotal + this.shippingTotal + this.feeTotal
    }
  },

  created () {
    this.$store.dispatch('navigator/goNextState', {page: 'sell', tab: ''})
    if (this.$store.state.auth.user) {
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
    } else {
      this.$root.$emit('showLoginModal')
    }
  },

  methods: {
  },

  mounted () {
  }
}
