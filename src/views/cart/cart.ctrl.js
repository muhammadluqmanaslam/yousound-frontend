import _ from 'lodash'

import { Utils } from '@/helper'

import AuthService from '@/services/auth'
import ItemService from '@/services/item'
import OrderService from '@/services/order'
import UserService from '@/services/user'

import activityProductCard from '@/components/activityproductcard'
import profileItem from '@/components/profileitem'
import sendMessage from '@/components/sendmessage'
import ticketNewDialog from './components/ticket_new_dialog'
import trackCard from '@/components/trackcard'
import contentTopHeader from '@/components/contentTopHeader'
import addressTab from '@/views/settings/components/address_tab'
import paymentModal from '@/components/paymentmodal'

export default {
	components: {
		activityProductCard,
		profileItem,
		sendMessage,
		ticketNewDialog,
		trackCard,
		contentTopHeader,
		addressTab,
		paymentModal,
	},

	data() {
		return {
			editDialog: false,
			active_tab: 'cart',
			tabs: [
				{ id: 'cart', title: 'Cart', icon: require('../../../static/images/cart.svg') },
				{ id: 'history', title: 'Order History', icon: require('../../../static/images/time-clock.svg') },
			],
			showSendMessage: false,
			show_address_confirm_dialog: false,
			show_ticket_dialog: false,
			show_tracking_info_dialog: false,
			active_order: null,
			active_item: {},
			cartItems: [],
			orderHistories: [],
			cartCost: {
				total_cost: 0,
				subtotal_cost: 0,
				shipping_cost: 0,
				fee_cost: 0,
			},
			ordersCost: {
				hasDeleted: false,
				shipping_cost: 0,
				tax_cost: 0,
				total_cost: 0,
			},
			page_index: 1,
			total_pages: 1,
			items_per_page: 6 * 5,
			isPageReady: false,
			showPlaceOrderDialog: false,
			showPaymentModal: false,
			show_order_complete_dialog: false,
			shippingAddress: [],
			order_status: {'item_ordered': 'Pending', 'item_shipped': 'Shipped', 'item_refunded': 'Refunded'},
		}
	},

	computed: {
		shipping_address() {
			return this.$store.state.auth.user.default_address
		},
		strippedAddress() {
			const addr = this.shipping_address
			let stripped = {}

			if (addr) {
				stripped.lineOne = addr.first_name + ' ' + addr.last_name
				stripped.lineTwo = addr.address_line
				stripped.lineThree = addr.city + ' ' + addr.state
				stripped.lineFour = addr.postcode
				stripped.lineFive = addr.country
			}

			return stripped || ''
			// return Object.values(stripped).join("\r\n")
		},
		currentUser() {
			return this.$store.state.auth.user
		},

		user() {
			return _.get(this.active_order, 'merchant', { avatar: {} })
		},

		// merchants
		receivers() {
			const merchants = _.chain(this.cartItems)
				.map('product.merchant')
				.uniq('id')
				.value()
			// console.log('receivers', merchants)
			return merchants
		},
	},

	watch: {
		$route(toPath, fromPath) {
			const tab = toPath.hash.substr(1)
			this.init(tab)
		},
	},

	created() {
		const tab = this.$route.hash.substr(1)
		this.init(tab)
		if (this.currentUser.default_address) {
			this.shippingAddress.push(this.currentUser.default_address)
		}
	},

	methods: {
		getItemDay(item) {
			const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
			const date = new Date(item.created_at)
			date.setDate(date.getDate() + 21)
			const day = days[date.getDay()]
			return day
		},

		getItemDate(item) {
			const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
			const date = new Date(item.created_at)
			date.setDate(date.getDate() + 21)
			return date;
		},
		openOrderCompleteDialog() {
			this.show_order_complete_dialog = true
		},

		closeOrderCompleteDialog() {
			this.show_order_complete_dialog = false
		},

		orderDetails() {
			this.$router.push({path: '/cart#history'})
		},

		orderItems(token) {
			if (this.shippingAddress.length > 0) {
				// console.log(token)
				this.$store.dispatch('error/showLoadingActivity', true)
				let params = {
					shipping_address_id: this.shippingAddress[0].id,
				}
				if (token) {
					params['payment_token'] = token.id
				}

				ItemService.orderItems(params)
					.then((response) => {
						this.$store.dispatch('error/showLoadingActivity', false)
						const orders = response.body || []
						this.ordersCost.shipping_cost = this._.sumBy(
							orders,
							'shipping_cost'
						)

						this.ordersCost.tax_cost = this._.sumBy(orders, 'tax_cost')
						this.ordersCost.total_cost = this._.sumBy(orders, 'amount')
						const itemsSize = this._.reduce(
							orders,
							(size, order) => size + (order.items || []).length,
							0
						)
						this.ordersCost.hasDeleted = this.cartItems.length !== itemsSize
						// this.$store.dispatch('error/showSuccessToast', ['Ordered successfully.'])
						// this.$store.dispatch('navigator/goNextState', { page: 'cart', tab: 'history' })
						// this.$router.push({path : '/cart#history'})
						this.openOrderCompleteDialog()
					})
					.catch((e) => {
						this.$store.dispatch('error/showLoadingActivity', false)
						this.$store.dispatch(
							'error/showErrorToast',
							e.body.errors || [e.body]
						)

						ItemService.getShoppingCartItems().then((response) => {
							this.cartItems = response.body
						})
					})
			} else {
				this.$store.dispatch('error/showErrorToast', [
					'Please add Shipping Address.',
				])
			}
		},

		openPaymentDialog() {
			if (this.shippingAddress.length === 0) {
				this.$store.dispatch('error/showErrorToast', [
					'Please add Shipping Address.',
				])
			} else {
				this.showPaymentModal = true
			}
		},

		closePaymentDialog() {
			this.showPaymentModal = false
			this.init(this.active_tab)
		},

		isActiveTab(tab) {
			return this.active_tab === tab
		},

		init(tab) {
			if (!this.currentUser) {
				AuthService.clearTokenAndUserInfo()
				this.$router.push({ path: '/login' })
				return
			}

			this.active_tab = tab || 'cart'
			this.$store.dispatch('navigator/goNextState', {
				page: 'cart',
				tab: this.active_tab,
			})

			let params
			switch (this.active_tab) {
				case 'cart':
					params = {}
					if (this.$store.state.auth.user.default_address) {
						params.country = this.$store.state.auth.user.default_address.country
						params.state = this.$store.state.auth.user.default_address.state
					}

					this.isPageReady = false
					this.$store.dispatch('error/showLoadingActivity', true)
					Promise.all([
						ItemService.getShoppingCartItems(),
						ItemService.calculateCost(params),
					])
						.then((values) => {
							this.cartItems = values[0].body
							this.cartCost = values[1].body

							this.isPageReady = true
							this.$store.dispatch('error/showLoadingActivity', false)
						})
						.catch((reason) => {
							this.$store.dispatch('error/showLoadingActivity', false)
							this.$store.dispatch('error/showErrorToast', reason)
						})
					break
				case 'history':
					params = {
						page: this.page_index,
						per_page: this.items_per_page,
					}
					this.isPageReady = false
					this.$store.dispatch('error/showLoadingActivity', true)
					Promise.all([OrderService.getSentOrders(params)])
						.then((values) => {
							this.orderHistories = values[0].body.orders

							this.isPageReady = true
							this.$store.dispatch('error/showLoadingActivity', false)
						})
						.catch((reason) => {
							this.$store.dispatch('error/showLoadingActivity', false)
							this.$store.dispatch('error/showErrorToast', reason)
						})
					break
			}
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

		isDigitalProduct(item) {
			return _.get(item, 'product.category.is_digital', false)
		},

		isMenuAvailable(order) {
			return true
		},

		isAddressEnabled(order) {
			return order.status === 'order_shipped' && order.enabled_address
		},

		download(item) {
			// console.log(item.product.digital_content_url, item.product.digital_content_name)
			Utils.downloadFile(item.product.digital_content_url)
		},

		submit() {
			this.$store.dispatch('error/showLoadingActivity', true)
			const funcs = (this.receivers || []).map((user) =>
				UserService.checkStripeConnection(user.id).then(
					(value) => ({ status: 'fulfilled', user, value }),
					(reason) => ({ status: 'rejected', user, reason })
				)
			)
			Promise.all(funcs).then((values) => {
				const error = this._.find(values, (v) => v.status === 'rejected')

				this.loading = false
				this.$store.dispatch('error/showLoadingActivity', false)
				if (error) {
					this.receiver = error.user
					this.show_error_dialog = true
				} else {
					this.cartItems = []
					this.openPaymentDialog()
				}
			})
		},

		showMessageDialog(order) {
			this.active_order = order
			this.showSendMessage = true
		},

		dismissMessageModal() {
			this.showSendMessage = false
		},

		openTicketDialog(order, item) {
			this.active_order = order
			this.active_item = item
			this.show_ticket_dialog = true
		},

		closeTicketDialog() {
			this.show_ticket_dialog = false
		},

		openTrackingInfoDialog(item) {
			console.log('openTicketDialog', item)
			this.active_item = item
			this.show_tracking_info_dialog = true
		},

		openAddressConfimDialog(order) {
			this.active_order = order
			this.show_address_confirm_dialog = true
		},

		closeAddressConfimDialog() {
			this.show_address_confirm_dialog = false
		},

		removeMyAddress() {
			this.closeAddressConfimDialog()
			OrderService.hideMyAddress(this.active_order.id).then((response) => {
				this.init(this.active_tab)
			})
		},

		productStatus(item) {
			if (this.isDigitalProduct(item)) {
				return {
					text: 'digital content',
					style: 'success',
				}
			} else if (
				['published', 'collaborated'].indexOf(item.product.status) === -1 ||
				item.product.stock_status !== 'active'
			) {
				return {
					text: 'out of stock',
					style: 'error',
				}
			} else if (item.quantity > item.product_variant.quantity) {
				return {
					text: 'limited stock',
					style: 'warning',
				}
			} else {
				return {
					text: 'in stock',
					style: 'success',
				}
			}
		},

		productStatusStyle(item) {
			return this.productStatus(item).style
		},

		productStatusText(item) {
			return this.productStatus(item).text
		},

		addQuantity(item) {
			ItemService.updateCartItem(item.id, { quantity: item.quantity + 1 })
				.then((response) => {
					item.quantity += 1
					this.cartCost = response.body
				})
				.catch((e) => {
					this.$store.dispatch(
						'error/showErrorToast',
						e.body.errors || [e.body]
					)
				})
		},

		removeQuantity(item) {
			if (item.quantity > 1) {
				ItemService.updateCartItem(item.id, { quantity: item.quantity - 1 })
					.then((response) => {
						item.quantity -= 1
						this.cartCost = response.body
					})
					.catch((e) => {
						this.$store.dispatch(
							'error/showErrorToast',
							e.body.errors || [e.body]
						)
					})
			}
		},

		removeCartItem(cartItem) {
			ItemService.deleteCartItem(cartItem.id)
				.then((response) => {
					this.$store.dispatch('error/showSuccessToast', [
						`deleted ${cartItem.product.name} successfully.`,
					])
					this.cartCost = response.body
					_.remove(this.cartItems, (item) => {
						return item.id === cartItem.id
					})
					const arr = this.cartItems.slice()
					this.cartItems = arr
				})
				.catch((e) => {
					this.$store.dispatch(
						'error/showErrorToast',
						e.body.errors || [e.body]
					)
				})
		},
	},

	mounted() {},
}
