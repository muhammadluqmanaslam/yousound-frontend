import _ from 'lodash'

import ItemService from '@/services/item'
import OrderService from '@/services/order'

import activityProductCard from '@/components/activityproductcard'
import profileItem from '@/components/profileitem'
import sendMessage from '@/components/sendmessage'
import trackCard from '@/components/trackcard'

export default {
  components: {
    activityProductCard,
    profileItem,
    sendMessage,
    trackCard
  },

  data () {
    return {
      current_tab: 'cart',
      showSendMessage: false,
      show_address_confirm_dialog: false,
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
    }
  },

  watch: {
    '$route' (toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      this.init(tab)
    }
  },

  created () {
    const tab = this.$route.hash.substr(1)
    this.init(tab)
  },

  methods: {
    init (tab) {
      if (!this.$store.state.auth.user) {
        AuthService.clearTokenAndUserInfo()
        this.$router.push({ path: '/login' })
        return
      }

      this.current_tab = tab || 'cart'
      this.$store.dispatch('navigator/goNextState', { page: 'cart', tab: this.current_tab })

      let params
      switch (this.current_tab) {
        case 'cart':
          params = {}
          if (this.$store.state.auth.user.default_address) {
            params.country = this.$store.state.auth.user.default_address.country
          }
          this.isPageReady = false
          this.$store.dispatch('error/showLoadingActivity', true)
          Promise.all([
            ItemService.getShoppingCartItems(),
            ItemService.calculateCost(params),
          ]).then(values => {
            this.cartItems = values[0].body
            this.cartCost = values[1].body
            this.isPageReady = true
            this.$store.dispatch('error/showLoadingActivity', false)
          }).catch(reason => {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('error/showErrorToast', reason)
          })
          break
        case 'history':
          params = {
            page: this.page_index,
            per_page: this.items_per_page
          }
          this.isPageReady = false
          this.$store.dispatch('error/showLoadingActivity', true)
          Promise.all([
            OrderService.getSentOrders(params)
          ]).then(values => {
            this.orderHistories = values[0].body.orders

            this.isPageReady = true
            this.$store.dispatch('error/showLoadingActivity', false)
          }).catch(reason => {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('error/showErrorToast', reason)
          })
          break
      }
    },

    onTab (tab) {
      this.$router.push({
        path: this.$route.path,
        hash: tab,
        query: {
          grid_view: this.grid_show
        }
      })
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

    openAddressConfimDialog (order) {
      this.order_detail = order
      this.show_address_confirm_dialog = true
    },

    closeAddressConfimDialog () {
      this.show_address_confirm_dialog = false
    },

    removeMyAddress () {
      this.closeAddressConfimDialog()
      OrderService.hideMyAddress(this.order_detail.id).then(response => {
        this.init(this.current_tab)
      })
    },

    productStatus (item) {
      if (['published', 'collaborated'].indexOf(item.product.status) === -1 || item.product.stock_status !== 'active') {
        return {
          text: 'out of stock',
          style: 'error'
        }
      } else if (item.quantity > item.product_variant.quantity) {
        return {
          text: 'lack of stock',
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
      ItemService.deleteCartItem(cartItem.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', [`deleted ${cartItem.product.name} successfully.`])
        this.cartCost = response.body
        _.remove(this.cartItems, (item) => { return item.id == cartItem.id })
        const arr = this.cartItems.slice()
        this.cartItems = arr
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  },

  mounted () {
  }
}
