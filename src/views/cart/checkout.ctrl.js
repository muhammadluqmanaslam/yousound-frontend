import AddressService from '@/services/address'
import ItemService from '@/services/item'
import paymentModal from '@/components/paymentmodal'
import activityProductCard from '@/components/activityproductcard'

export default {
  components: {
    paymentModal,
    activityProductCard
  },

  data () {
    return {
      cartItems: [],
      shippingAddress: [],
      showAddress: true,
      showPaymentModal: false,
      cartCost: {
        total_cost: 0,
        subtotal_cost: 0,
        shipping_cost: 0
      },
      isPageReady: false
    }
  },

  computed: {
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'checkout', tab: '' })
    if (this.$store.state.auth.user) {
      let params = {}
      if (this.$store.state.auth.user.default_address) {
        this.shippingAddress.push(this.$store.state.auth.user.default_address)
        params.country = this.$store.state.auth.user.default_address.country
      }

      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([
        ItemService.getShoppingCartItems(),
        ItemService.calculateCost(params),
        AddressService.getAddresses(),
      ]).then(values => {
        this.cartItems = values[0].body
        this.cartCost = values[1].body
        // this.shippingAddress = values[2].body
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
      // console.log(cartItem.product.name)
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
    },

    orderItems(token) {
      if (this.shippingAddress.length > 0) {
        // console.log(token)
        this.$store.dispatch('error/showLoadingActivity', true)
        const params = new FormData()
        params.append('shipping_address_id', this.shippingAddress[0].id)
        if(token) {
          params.append('payment_token', token.id)
        }
        ItemService.orderItems(params).then(response => {
          this.hidePaymentDialog()
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showSuccessToast', ['Ordered successfully.'])
          this.$store.dispatch('activity/setCartCount', 0)
          this.$store.dispatch('navigator/goNextState', { page: 'cart', tab: 'history' })
          this.$router.push({path : '/cart'})
        }).catch(e => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      } else {
        this.$store.dispatch('error/showErrorToast', ['Please add Shipping Address.'])
      }
    },

    hidePaymentDialog () {
      this.showPaymentModal = false
    },

    showPaymentDialog () {
      if (this.shippingAddress.length == 0) {
        this.$store.dispatch('error/showErrorToast', ['Please add Shipping Address.'])
      } else {
        this.showPaymentModal = true  
      }
    },

    hideShippingAddress () {
      console.log('test')
    }
  },

  mounted () {
  }
}
