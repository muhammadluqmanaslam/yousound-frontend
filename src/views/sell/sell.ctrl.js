import _ from 'lodash'

import ItemService from '@/services/item'
import OrderService from '@/services/order'
import ProductService from '@/services/product'

import productItem from '@/components/productitem'
import profileItem from '@/components/profileitem'
import sendMessage from '@/components/sendmessage'
import collaborateProduct from './components/collaborate_product'

export default {
  components: {
    collaborateProduct,
    productItem,
    profileItem,
    sendMessage
  },

  data () {
    return {
      tab: 'orders',
      show_ship_confirm_modal: false,
      show_unship_confirm_modal: false,
      shipping_id: null,
      order_detail: null,
      orderHistories: [],
      products: [],
      product: {},
      selected_item: {},
      product_delete_confirm_dialog: false,
      showSendMessage: false,
      page_index: 1,
      total_pages: 1,
      items_per_page: 6 * 5,
      isPageReady: false
    }
  },

  computed: {
    _ () {
      return _
    },

    user () {
      return this.order_detail.customer
    },

    published_products () {
      return _.filter(this.products, (item) => { return item.status === 'published' })
    },

    pending_products () {
      return _.filter(this.products, (item) => { return item.status == 'pending' })
    },

    collaborated_products () {
      return _.filter(this.products, (item) => { return item.status == 'collaborated' })
    },
  },

  created () {
    this.tab = this.$store.state.order.tab || 'orders'
    this.$store.dispatch('navigator/goNextState', {page: 'sell', tab: this.tab})
    if (this.$store.state.auth.user) {
      if (['artist', 'brand', 'label'].indexOf(this.$store.state.auth.user.user_type) == -1)  {
        this.$router.push({ path: '/'})
      } else {
        this.loadData()
      }
    } else {
      this.$root.$emit('showLoginModal')
    }
  },

  methods: {
    loadData () {
      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([
        OrderService.getReceivedOrders({ page: this.page_index, per_page: this.items_per_page }),
        ProductService.getProducts()
      ]).then(values => {
        this.orderHistories = values[0].body.orders
        this.products = values[1].body

        this.isPageReady = true
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(reason => {
        console.log(reason)
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', reason)
      })
    },

    addProduct () {
      this.$router.push({ path: '/product/add' })
    },

    onTab (tab) {
      this.$store.dispatch('order/setTab', tab)
    },

    editProduct (product) {
      this.$router.push(`/product/edit/${product.id}`)
    },

    openShipConfirmModal (item) {
      this.selected_item = item
      this.show_ship_confirm_modal = true
    },

    closeShipConfirmModal () {
      this.show_ship_confirm_modal = false
    },

    shipItem () {
      const itemId = this.selected_item.id
      ItemService.markShipped(itemId).then(response => {
        let item
        _.each(this.orderHistories, (order) => {
          item = _.find(order.items, { id: itemId })
          if (!!item) {
            return false
          }
        })
        item.status = 'item_shipped'
        const arr = this.orderHistories.slice()
        this.orderHistories = arr
        this.closeShipConfirmModal()
      }).catch(e => {
        this.closeShipConfirmModal()
      })
    },

    openUnshipConfirmModal (item) {
      this.selected_item = item
      this.show_unship_confirm_modal = true
    },

    closeUnshipConfirmModal () {
      this.show_unship_confirm_modal = false
    },

    unshipItem () {
      const itemId = this.selected_item.id
      ItemService.markUnshipped(itemId).then(response => {
        let item
        _.each(this.orderHistories, (order) => {
          item = _.find(order.items, { id: itemId })
          if (!!item) {
            return false
          }
        })
        item.status = 'item_ordered'
        const arr = this.orderHistories.slice()
        this.orderHistories = arr
        this.closeUnshipConfirmModal()
      }).catch(e => {
        this.closeUnshipConfirmModal()
      })
    },

    showMessageDialog (order) {
      this.order_detail = order
      this.showSendMessage = true
    },

    dismissMessageModal () {
      this.showSendMessage = false
    },

    openProductDeleteConfirmDialog (product) {
      this.product = product
      this.product_delete_confirm_dialog = true
    },

    closeProductDeleteConfirmDialog () {
      this.product = {}
      this.product_delete_confirm_dialog = false
    },

    deleteProduct () {
      ProductService.deleteProduct(this.product.id).then(response => {
        _.remove(this.products, (item) => { return item.id == this.product.id })
        const arr = this.products.slice()
        this.products = arr
        this.closeProductDeleteConfirmDialog()
      }).catch(e => {
        this.closeProductDeleteConfirmDialog()
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    releaseProduct (product) {
      ProductService.releaseProduct(product.id).then(response => {
        this.tab = 'collaborations'
        this.loadData()
      })
    },

    notResponded(product) {
      const collaborator = _.find(product.collaborators, (c) => {
        return c.user_id == this.$store.state.auth.user.id
      })
      // console.log('notResponded', this.$store.state.auth.user.id, collaborator)
      return collaborator && (collaborator.status == 'pending')
    },

    acceptCollaboration(product) {
      ProductService.acceptCollaboration(product.id).then(response => {
        this.loadData()
      })
    },

    denyCollaboration(product) {
      ProductService.denyCollaboration(product.id).then(response => {
        this.loadData()
      })
    },
  },

  mounted () {
  }
}
