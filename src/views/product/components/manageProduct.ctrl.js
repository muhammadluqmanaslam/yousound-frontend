import _ from 'lodash'
import moment from 'moment'

import { Utils } from '@/helper'

import AuthService from '@/services/auth'
import ItemService from '@/services/item'
import OrderService from '@/services/order'
import ProductService from '@/services/product'
import UserService from '@/services/user'

import productItem from '@/components/productitem'
import profileItem from '@/components/profileitem'
import sendMessage from '@/components/sendmessage'
import collaborateProduct from '@/views/sell/components/collaborate_product'
import { Storage, MyCookies } from '@/helper'
import contentTopHeader from '@/components/contentTopHeader'

const filterArrowDownString =
    '<i class="material-icons icon icon--right theme--dark">keyboard_arrow_down</i>'

export default {
  components: {
    collaborateProduct,
    productItem,
    profileItem,
    sendMessage,
    contentTopHeader,
  },

  data() {
    return {
      productTab: 'published',
      active_tab: 'orders',
      tabs: [
        { id: 'orders', title: 'Orders' },
        { id: 'products', title: 'Products' },
        { id: 'collaborations', title: 'Collaborations' },
        { id: 'pendings', title: 'Pending collaborations' },
      ],
      filters: [
                { id: '', name: 'All' },
                { id: 'creator_unshipped', name: 'Unshipped' },
                { id: 'creator_shipped', name: 'Shipped' },
                { id: 'collaborator_unshipped', name: 'Collaborated Unshipped' },
                { id: 'collaborator_shipped', name: 'Collaborated Shipped' },
      ],
      activeFilter: null,
      exportPeriod: null,
      show_product_finish_modal: false,
      show_ship_confirm_modal: false,
      show_unship_confirm_modal: false,
      show_ship_all_confirm_dialog: false,
      show_help_dialog: false,
      product_delete_confirm_dialog: false,
      showSendMessage: false,
      valid_tracking_form: true,
      shipping_id: null,
      order_detail: null,
      orderHistories: [],
      order_pagination: {
        current_page: 1,
        per_page: 100,
      },
      products: [],
      product: {},
      selected_item: {},
      tracking_site: null,
      tracking_number: null,
      page_index: 1,
      total_pages: 1,
      items_per_page: 6 * 5,
      isPageReady: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
    user() {
      return this.order_detail.customer
    },

    published_products() {
      return _.filter(this.products, (item) => {
        return item.status === 'published'
      })
    },
    pending_products() {
      return _.filter(this.products, (item) => {
        return item.status == 'pending'
      })
    },
    collaborated_products() {
      return _.filter(this.products, (item) => {
        return item.status == 'collaborated'
      })
    },
    activeFilterName() {
      return _.get(this.activeFilter, 'name', 'All')
    },
    activeFilterItemStatus() {
      const status = _.get(this.activeFilter, 'id', '').split('_')[1] || ''
      let item_status = ''
      switch (status) {
        case 'shipped':
          item_status = 'item_shipped'
          break
        case 'unshipped':
          item_status = 'item_ordered'
          break
        default:
          item_status = ''
          break
      }
      return item_status
    },
  },
  watch: {
    $route(toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      this.setTab(tab)
    },
  },
  methods: {
    setProductFilter(id) {
    //   update status if id is valid
    //   productTab will be fallback idf id is not valid
    //   id will always be updated in future
      const status = id || this.productTab

    //   update productTab with valid instance
      this.productTab = status

      const filtered = _.filter(this.products, (item) => {
        return item.status === status
      })

    //   console.log(this.products)
      console.log(this.products.filter((p) => p.status == 'published'))
    //   console.log(this.products.map((p) => p.status))
      console.log(this.products.map((p) => p.collaborators))
      return filtered
    },
    isActiveTab(tab) {
      return this.active_tab == tab
    },

    loadProducts() {
      this.$store.dispatch('error/showLoadingActivity', true)
      ProductService.getProducts().then((response) => {
        this.products = response.body
        this.$store.dispatch('error/showLoadingActivity', false)
      })
    },

    loadOrders() {
      this.$store.dispatch('error/showLoadingActivity', true)
      OrderService.getReceivedOrders({
        page: this.order_pagination.current_page + 1,
        per_page: this.order_pagination.per_page,
      }).then((response) => {
        this.orderHistories = this.orderHistories.concat(response.body.orders)
        this.order_pagination = response.body.pagination
        this.$store.dispatch('error/showLoadingActivity', false)
      })
    },

    addProduct() {
      this.$router.push({ path: '/product/add' })
    },

    onTab(tab) {
      this.$router.push({
        path: this.$route.path,
        hash: tab,
      })
    },

    setTab(tab) {
      if (!tab) {
        tab = 'orders'
      }

      this.active_tab = tab
            // this.$store.dispatch('navigator/setCurrentState', { page: 'sell', tab: tab })
      this.$store.dispatch('navigator/goNextState', { page: 'sell', tab: tab })
    },

    isDigitalProduct(item) {
      return _.get(item, 'product.category.is_digital', false)
    },

    isCollaborated(item) {
      return _.find(item.product.collaborators, {
        user_id: this.currentUser.id,
      })
    },

    editProduct(product) {
      this.$router.push(`/product/edit/${product.id}`)
    },

    openHelpDialog() {
      this.show_help_dialog = true
    },

    closeHelpDialog() {
      this.show_help_dialog = false
      const params = {
        user: {
          sell_page_visited: 1,
        },
      }
      UserService.updateUserInfo(this.currentUser.id, params).then(
                (response) => {
                  AuthService.setUser(response.body)
                  this.$store.dispatch('auth/setUser', response.body)
                }
            )
    },

    openProductFinishModal() {
      this.show_product_finish_modal = true
    },

    closeProductFinishModal() {
      this.show_product_finish_modal = false
    },

        // openShipAllConfirmDialog() {
        //   this.show_ship_all_confirm_dialog = true
        // },

        // closeShipAllConfirmDialog() {
        //   this.show_ship_all_confirm_dialog = false
        // },

        // shipAll() {
        //   this.$store.dispatch('error/showLoadingActivity', true)
        //   ItemService.markAllShipped().then(response => {
        //     _.each(this.orderHistories, (order) => {
        //       _.each(order.items, (item) => {
        //         item.status = 'item_shipped'
        //       })
        //     })
        //     const arr = this.orderHistories.slice()
        //     this.orderHistories = arr
        //     this.closeShipAllConfirmDialog()
        //     this.$store.dispatch('error/showLoadingActivity', false)
        //   }).catch(e => {
        //     this.closeShipAllConfirmDialog()
        //     this.$store.dispatch('error/showLoadingActivity', false)
        //   })
        // },

    csvExport() {
      let params = {}
      if (this.exportPeriod && this.exportPeriod.start) {
        params['start_date'] = this.exportPeriod.start + ' 00:00:00'
      }
      if (this.exportPeriod && this.exportPeriod.end) {
        params['end_date'] = this.exportPeriod.end + ' 23:59:59'
      }
      OrderService.receivedExport(params).then((response) => {
        const csvData =
                    'data:text/csv;charset=utf-8,' + encodeURIComponent(response.body)
        const filename = `order-items-${moment().format('YYYYMMDD')}.csv`
        Utils.downloadFile(csvData, filename)
      })
    },

    openShipConfirmModal(item) {
      this.selected_item = item
      this.show_ship_confirm_modal = true
      this.tracking_site = Storage.get(MyCookies.TRACKING_SITE)
    },

    closeShipConfirmModal() {
      this.$refs.valid_tracking_form.reset()
      this.show_ship_confirm_modal = false
    },

    shipItem() {
      if (this.$refs.valid_tracking_form.validate()) {
        const itemId = this.selected_item.id
        const params = {
          tracking_site: this.tracking_site,
          tracking_number: this.tracking_number,
        }
        ItemService.markShipped(itemId, params)
                    .then((response) => {
                      Storage.set(MyCookies.TRACKING_SITE, this.tracking_site)
                      let item
                      _.each(this.orderHistories, (order) => {
                        item = _.find(order.items, { id: itemId })
                        if (item) {
                          return false
                        }
                      })
                      item.status = 'item_shipped'
                      const arr = this.orderHistories.slice()
                      this.orderHistories = arr
                      this.closeShipConfirmModal()
                    })
                    .catch((e) => {
                      this.closeShipConfirmModal()
                    })
      }
    },

    openUnshipConfirmModal(item) {
      this.selected_item = item
      this.show_unship_confirm_modal = true
    },

    closeUnshipConfirmModal() {
      this.show_unship_confirm_modal = false
    },

    unshipItem() {
      const itemId = this.selected_item.id
      ItemService.markUnshipped(itemId)
                .then((response) => {
                  let item
                  _.each(this.orderHistories, (order) => {
                    item = _.find(order.items, { id: itemId })
                    if (item) {
                      return false
                    }
                  })
                  item.status = 'item_ordered'
                  const arr = this.orderHistories.slice()
                  this.orderHistories = arr
                  this.closeUnshipConfirmModal()
                })
                .catch((e) => {
                  this.closeUnshipConfirmModal()
                })
    },

    showMessageDialog(order) {
      this.order_detail = order
      this.showSendMessage = true
    },

    dismissMessageModal() {
      this.showSendMessage = false
    },

    openProductDeleteConfirmDialog(product) {
      this.product = product
      this.product_delete_confirm_dialog = true
    },

    closeProductDeleteConfirmDialog() {
      this.product = {}
      this.product_delete_confirm_dialog = false
    },

    deleteProduct() {
      ProductService.deleteProduct(this.product.id)
                .then((response) => {
                  _.remove(this.products, (item) => {
                    return item.id == this.product.id
                  })
                  const arr = this.products.slice()
                  this.products = arr
                  this.closeProductDeleteConfirmDialog()
                })
                .catch((e) => {
                  this.closeProductDeleteConfirmDialog()
                  this.$store.dispatch(
                        'error/showErrorToast',
                        e.body.errors || [e.body]
                    )
                })
    },

    releaseProduct(product) {
      ProductService.releaseProduct(product.id).then((response) => {
        this.active_tab = 'collaborations'
        this.loadProducts()
      })
    },

    notResponded(product) {
      const collaborator = _.find(product.collaborators, (c) => {
        return c.user_id == this.$store.state.auth.user.id
      })
            // console.log('notResponded', this.$store.state.auth.user.id, collaborator)
      return collaborator && collaborator.status == 'pending'
    },

    acceptCollaboration(product) {
      ProductService.acceptCollaboration(product.id).then((response) => {
        this.loadProducts()
      })
    },

    denyCollaboration(product) {
      ProductService.denyCollaboration(product.id).then((response) => {
        this.loadProducts()
      })
    },

    filterItems(filter) {
      if (this.activeFilter == filter) return

      $('#item_filter .btn__content').html(filter.name + filterArrowDownString)

      switch (filter.id) {
        case 'any':
          this.activeFilter = null
          break
        default:
          this.activeFilter = filter
      }

      const params = {
        page: this.page_index,
        per_page: this.items_per_page,
        status: filter.id,
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      OrderService.getReceivedOrders(params)
                .then((response) => {
                  this.orderHistories = response.body.orders
                  this.$store.dispatch('error/showLoadingActivity', false)
                })
                .catch((e) => {
                  this.$store.dispatch(
                        'error/showErrorToast',
                        e.body.errors || [e.body]
                    )
                  this.$store.dispatch('error/showLoadingActivity', false)
                })
    },
  },
  created() {
    if (!this.currentUser) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    if (
            ['artist', 'brand', 'label'].indexOf(
                this.$store.state.auth.user.user_type
            ) == -1
        ) {
      this.$router.push({ path: '/' })
      return
    }

        // if (this.currentUser.data['sell_page_visited'] !== 1) {
        //   this.openHelpDialog()
        // }

    const tab = this.$route.hash.substr(1)
    this.setTab(tab)

    const lastState = this.$store.getters['navigator/last']
    if (_.get(lastState, 'params.product_id')) {
      ProductService.getProduct(lastState.params.product_id).then(
                (response) => {
                  this.product = response.body
                  this.openProductFinishModal()
                }
            )
    }

    this.isPageReady = false
    this.$store.dispatch('error/showLoadingActivity', true)
    Promise.all([
      OrderService.getReceivedOrders({
        page: this.order_pagination.current_page,
        per_page: this.order_pagination.per_page,
      }),
      ProductService.getProducts(),
    ])
            .then((values) => {
              this.orderHistories = values[0].body.orders
              this.order_pagination = values[0].body.pagination
              this.products = values[1].body
              this.isPageReady = true
              this.$store.dispatch('error/showLoadingActivity', false)
            })
            .catch((reason) => {
              console.log(reason)
              this.$store.dispatch('error/showLoadingActivity', false)
              this.$store.dispatch('error/showErrorToast', reason)
            })
  },
  mounted() { },
}