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
      show_order_complete_dialog: false,
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
    if (!this.$store.state.auth.user) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    this.$store.dispatch('navigator/goNextState', { page: 'checkout', tab: '' })
    let params = {}
    if (this.$store.state.auth.user.default_address) {
      this.shippingAddress.push(this.$store.state.auth.user.default_address)
      params.country = this.$store.state.auth.user.default_address.country
      params.state = this.$store.state.auth.user.default_address.state
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
  },

  methods: {
    isDigitalProduct (item) {
      return _.get(item, 'product.category.is_digital', false)
    },

    productStatus (item) {
      if (this.isDigitalProduct(item)) {
        return {
          text: 'digital content',
          style: 'success'
        }
      } else if (['published', 'collaborated'].indexOf(item.product.status) === -1 || item.product.stock_status !== 'active') {
        return {
          text: 'out of stock',
          style: 'error'
        }
      } else if (item.quantity > item.product_variant.quantity) {
        return {
          text: 'limited stock',
          style: 'warning'
        }
      } else {
        return {
          text: 'in stock',
          style: 'success'
        }
      }
    },

    productStatusStyle (item) {
      return this.productStatus(item).style
    },

    productStatusText (item) {
      return this.productStatus(item).text
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
      // console.log(cartItem.product.name)
      ItemService.deleteCartItem(cartItem.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', [`deleted ${cartItem.product.name} successfully.`])
        this.cartCost = response.body
        _.remove(this.cartItems, (item) => { return item.id == cartItem.id })
        const arr = this.cartItems.slice()
        this.cartItems = arr
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    orderItems(token) {
      if (this.shippingAddress.length > 0) {
        // console.log(token)
        this.$store.dispatch('error/showLoadingActivity', true)
        let params = {
          shipping_address_id: this.shippingAddress[0].id
        }
        if(token) {
          params['payment_token'] = token.id
        }
        ItemService.orderItems(params).then(response => {
          this.$store.dispatch('error/showLoadingActivity', false)
          // this.$store.dispatch('error/showSuccessToast', ['Ordered successfully.'])
          // this.$store.dispatch('navigator/goNextState', { page: 'cart', tab: 'history' })
          // this.$router.push({path : '/cart#history'})
          this.openOrderCompleteDialog()
        }).catch(e => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])

          ItemService.getShoppingCartItems().then(response => {
            this.cartItems = response.body
          })
        })
      } else {
        this.$store.dispatch('error/showErrorToast', ['Please add Shipping Address.'])
      }
    },

    viewOrderHistory () {
      this.closeOrderCompleteDialog()
      this.$router.push({path : '/cart#history'})
    },

    openPaymentDialog () {
      if (this.shippingAddress.length == 0) {
        this.$store.dispatch('error/showErrorToast', ['Please add Shipping Address.'])
      } else {
        this.showPaymentModal = true  
      }
    },

    closePaymentDialog () {
      this.showPaymentModal = false
    },

    openOrderCompleteDialog () {
      this.show_order_complete_dialog = true
    },

    closeOrderCompleteDialog () {
      this.show_order_complete_dialog = false
    },

    hideShippingAddress () {
      console.log('test')
    }
  },

  mounted () {
  }
}
