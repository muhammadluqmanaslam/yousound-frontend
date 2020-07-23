import _ from 'lodash'
import ProductService from '@/services/product'
import ItemService from '@/services/item'
import TicketService from '@/services/ticket'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },

    dismiss: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      tabs: [
        { id: 'items', title: 'Orders' },
        { id: 'open_tickets', title: 'Open Cases' },
        { id: 'closed_tickets', title: 'Closed Cases' },
      ],
      active_tab: 'items',
      items_headers: [
        {
          text: 'Username',
          value: 'username',
          align: 'left',
          sortable: false,
          width: '1%',
        },
        {
          text: 'Date',
          value: 'order.created_at',
          align: 'left',
          sortable: false,
          width: '1%',
        },
        {
          text: 'Price',
          value: 'price',
          align: 'center',
          sortable: false,
          width: '1%',
        },
        {
          text: 'Quantity',
          value: 'quantity',
          align: 'center',
          sortable: false,
          width: '1%',
        },
        {
          text: 'Shipping',
          value: 'shipping_cost',
          align: 'center',
          sortable: false,
          width: '1%',
        },
        {
          text: 'Tax',
          value: 'tax_cost',
          align: 'center',
          sortable: false,
          width: '1%',
        },
        { text: 'Address', value: 'status', align: 'center', sortable: false },
      ],
      open_tickets_headers: [
        { text: 'Username', value: 'username', align: 'left', sortable: false },
        {
          text: 'Date Opened',
          value: 'created_at',
          align: 'left',
          sortable: false,
        },
        { text: 'Reason', value: 'reason', align: 'center', sortable: false },
        {
          text: 'Explanation',
          value: 'description',
          align: 'center',
          sortable: false,
        },
        {
          text: 'Close Case',
          value: 'status',
          align: 'center',
          sortable: false,
        },
      ],
      closed_tickets_headers: [
        { text: 'Username', value: 'username', align: 'left', sortable: false },
        {
          text: 'Date Opened',
          value: 'created_at',
          align: 'left',
          sortable: false,
        },
        {
          text: 'Date Closed',
          value: 'closed_at',
          align: 'left',
          sortable: false,
        },
        { text: 'Reason', value: 'reason', align: 'center', sortable: false },
        {
          text: 'Explanation',
          value: 'description',
          align: 'center',
          sortable: false,
        },
      ],
      searchValue: '',
      product: {},
      user: {
        avatar: {},
      },
      items: [],
      open_tickets: [],
      closed_tickets: [],
      per_page_options: [50, 100, 150],
      items_loading: false,
      open_tickets_loading: false,
      closed_tickets_loading: false,
      total_items: 0,
      total_open_tickets: 0,
      total_closed_tickets: 0,
      items_pagination: {
        page: 1,
        rowsPerPage: 50,
      },
      open_tickets_pagination: {
        page: 1,
        rowsPerPage: 50,
      },
      closed_tickets_pagination: {
        page: 1,
        rowsPerPage: 50,
      },
      // total_items: 0,
      // pagination: {
      //   page: 1,
      //   rowsPerPage: 10
      // },
      isPageReady: true,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
  },

  methods: {
    loadProduct() {
      // ProductService.getProduct(this.item.id)
    },

    loadItems() {
      const params = {
        page: this.items_pagination.page,
        per_page: this.items_pagination.rowsPerPage,
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      ProductService.orderedItems(this.product.id, params)
        .then((response) => {
          this.items = response.body.items
          this.total_items = response.body.pagination.total_count
          this.$store.dispatch('error/showLoadingActivity', false)
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
        })
    },

    loadOpenTickets() {
      const params = {
        status: 'open',
        page: this.open_tickets_pagination.page,
        per_page: this.open_tickets_pagination.rowsPerPage,
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      ProductService.tickets(this.product.id, params)
        .then((response) => {
          this.open_tickets = response.body.tickets
          this.total_open_tickets = response.body.pagination.total_count
          this.$store.dispatch('error/showLoadingActivity', false)
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
        })
    },

    loadClosedTickets() {
      const params = {
        status: 'close',
        page: this.closed_tickets_pagination.page,
        per_page: this.closed_tickets_pagination.rowsPerPage,
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      ProductService.tickets(this.product.id, params)
        .then((response) => {
          this.closed_tickets = response.body.tickets
          this.total_closed_tickets = response.body.pagination.total_count
          this.$store.dispatch('error/showLoadingActivity', false)
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
        })
    },

    fullAddress(address) {
      return `${address.street_1}, ${address.city}, ${address.state}, ${address.country}`
    },

    closeTicket(ticket) {
      // console.log('closeTicket', ticket)
      const params = {
        ticket: {
          closed_user_id: this.currentUser.id,
          status: 'close',
        },
      }
      TicketService.updateTicket(ticket.id, params).then((response) => {
        this.loadOpenTickets()
        this.loadClosedTickets()
      })
    },
  },

  created() {
    this.product = _.cloneDeep(this.item)
    this.user = _.get(this.item, 'merchant', { avatar: {} })
    console.log('product_detail_dialog', this.product)
    ProductService.getProduct(this.item.id).then((response) => {
      this.product = response.body
    })
  },

  watch: {
    items_pagination: {
      handler() {
        this.loadItems()
      },
    },

    open_tickets_pagination: {
      handler() {
        // console.log('open_tickets_pagination', this.open_tickets_pagination)
        this.loadOpenTickets()
      },
    },

    closed_tickets_pagination: {
      handler() {
        this.loadClosedTickets()
      },
    },
  },
}
