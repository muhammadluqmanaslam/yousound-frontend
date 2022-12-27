import _ from 'lodash'
// import AuthService from '@/services/auth'
import OrderService from '@/services/order'
import { Stripe } from '@/helper'
import contentTopHeader from '@/components/contentTopHeader'
import activityProductCard from '@/components/activityproductcard'

export default {
  components: {
    contentTopHeader,
    activityProductCard 
  },

  data() {
    return {
      active: 'none',
      order_id: null,
      order_detail: null,
      isPageReady: false,
      tabs: [
        { id: 'cart', title: 'Cart', },
        { id: 'history', title: 'Order History', },
      ],
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    user() {
      return this.order_detail.customer
    },

    shippingFullName() {
      return [
        _.get(this.order_detail, 'shipping_address.first_name', ''),
        _.get(this.order_detail, 'shipping_address.last_name', ''),
      ].join(' ')
    },

    subTotal() {
      var sum = 0
      for (let index in this.order_detail.items) {
        const item = this.order_detail.items[index]
        if (this.isDigitalProduct(item)) {
          sum += item.price
        } else {
          sum += item.price * item.quantity
        }
      }
      return sum
    },

    shippingTotal() {
      var sum = 0
      for (let index in this.order_detail.items) {
        const item = this.order_detail.items[index]
        if (item.shipping_cost) {
          sum += item.shipping_cost
        }
      }
      return sum
    },

    taxTotal() {
      var sum = 0
      for (let index in this.order_detail.items) {
        const item = this.order_detail.items[index]
        if (item.tax) {
          sum += item.tax
        }
      }
      return sum
    },

    refundAmount() {
      return _.get(this.order_detail, 'refund_amount', 0)
    },

    stripeFee() {
      return Stripe.calculateFee(
        this.subTotal + this.shippingTotal + this.taxTotal
      )
    },

    total() {
      return (
        this.subTotal +
        this.shippingTotal +
        this.taxTotal +
        this.stripeFee -
        this.refundAmount
      )
    },
  },

  created() {
    // redirect to login when 401 error happens, check it in App.vue
    // if (!this.currentUser) {
    //   AuthService.clearTokenAndUserInfo()
    //   this.$router.push({ path: '/login' })
    //   return
    // }

    this.$store.dispatch('navigator/goNextState', { page: 'sell', tab: '' })
    this.order_id = this.$route.params.slug
    if (this.order_id) {
      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([OrderService.getOrder(this.order_id)])
        .then((values) => {
          this.order_detail = values[0].body

          this.isPageReady = true
          this.$store.dispatch('error/showLoadingActivity', false)
        })
        .catch((reason) => {
          console.log(reason)
          this.$store.dispatch('error/showLoadingActivity', false)
          // this.$store.dispatch('error/showErrorToast', [reason])
        })
    }
  },

  methods: {
    isDigitalProduct(item) {
      return _.get(item, 'product.category.is_digital', false)
    },
    isActiveTab(tab) {
      return this.active_tab === tab
    },
    onTab(tab) {
      this.$router.push({
        path: this.$route.path,
        hash: tab,
        query: {
          grid_view: this.grid_show,
        },
      })
    },
  },

  mounted() {},
}
