import trackCard from '@/components/trackcard'
import profileItem from '@/components/profileitem'
import sendMessage from '@/components/sendmessage'
import ItemService from '@/services/item'
import OrderService from '@/services/order'
import activityProductCard from '@/components/activityproductcard'

export default {
  components: {
    trackCard,
    profileItem,
    sendMessage,
    activityProductCard
  },

  data () {
    return {
      tab: 'cart',
      showSendMessage: false,
      order_detail: null,
      cartItems: [],
      orderHistories: [],
      cartCost: {},
      page_index: 1,
      total_pages: 1,
      items_per_page: 6 * 5,
      isPageReady: false
    }
  },

  computed: {
    user () {
      return this.order_detail.merchant
    },
  },

  created () {
    // this.$store.dispatch('navigator/setCurrentState', { page: 'checkout', tab: '' })
    this.$store.dispatch('navigator/goNextState', { page: 'cart', tab: this.tab })
    // console.log('current', this.$store.state.navigator.current)
    // console.log('last', this.$store.getters['navigator/last'])

    if (this.$store.getters['navigator/last'].page === 'checkout') {
      this.tab = 'history'
    }

    if (this.$store.state.auth.user) {
      let params = {}
      if (this.$store.state.auth.user.default_address) {
        params.country = this.$store.state.auth.user.default_address.country
      }

      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([
        ItemService.getShoppingCartItems(),
        ItemService.calculateCost(params),
        OrderService.getSentOrders({ page: this.page_index, per_page: this.items_per_page })
      ]).then(values => {
        this.cartItems = values[0].body
        this.cartCost = values[1].body
        this.orderHistories = values[2].body.orders

        this.isPageReady = true
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(reason => {
        console.log(reason)
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', reason)
      })
    } else {
      this.$root.$emit('showLoginModal')
    }
  },

  methods: {
    onTab (tab) {
      this.tab = tab
    },

    submit () {
      this.$router.push({ path: '/cart/checkout/' })
    },

    showMessageDialog (order) {
      this.order_detail = order
      this.showSendMessage = true
    },

    dismissMessageModal () {
      this.showSendMessage = false
    },

    addQuantity (item) {
      ItemService.updateCartItem(item.id, { quantity: item.quantity + 1 }).then(response => {
        item.quantity += 1
        this.cartCost = response.body
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    removeQuantity (item) {
      if (item.quantity > 1) {
        ItemService.updateCartItem(item.id, { quantity: item.quantity - 1 }).then(response => {
          item.quantity -= 1
          this.cartCost = response.body
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      }
    },

    removeCartItem(cartItem) {
      ItemService.deleteCartItem(cartItem.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', [`deleted ${cartItem.product.name} successfully.`])
        this.cartCost = response.body
        _.remove(this.cartItems, (item) => { return item.id == cartItem.id })
        const arr = this.cartItems.slice()
        this.cartItems = arr
        this.$store.dispatch('activity/setCartCount', this.$store.state.activity.count.cart - 1)
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  },

  mounted () {
  }
}
