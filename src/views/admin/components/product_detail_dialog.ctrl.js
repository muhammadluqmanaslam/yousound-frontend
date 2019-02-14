import _ from 'lodash'

export default {
  props: {
    product: {
      type: Object,
      required: true
    },

    dismiss: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      tabs: [
        { id: 'orders', title: 'Orders' },
        { id: 'open_cases', title: 'Open Cases' },
        { id: 'closed_cases', title: 'Closed Cases' }
      ],
      active_tab: 'orders',
      orders_headers: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'Date', value: 'publisher_name', align: 'left' },
        { text: 'Price', value: 'played', align: 'center' },
        { text: 'Quantity', value: 'downloaded', align: 'center' },
        { text: 'Shipping', value: 'reposted', align: 'center' },
        { text: 'Tax', value: 'recommended', align: 'center' },
        { text: 'Address', value: 'recommended', align: 'center' }
      ],
      open_cases_headers: [
        { text: 'Username', value: 'name', align: 'left' },
        { text: 'Date Opened', value: 'publisher_name', align: 'left' },
        { text: 'Reason', value: 'played', align: 'center' },
        { text: 'Explanation', value: 'downloaded', align: 'center' },
        { text: 'Close Case', value: 'status', align: 'center' }
      ],
      closed_cases_headers: [
        { text: 'Username', value: 'name', align: 'left' },
        { text: 'Date Opened', value: 'publisher_name', align: 'left' },
        { text: 'Date Closed', value: 'publisher_name', align: 'left' },
        { text: 'Reason', value: 'played', align: 'center' },
        { text: 'Explanation', value: 'downloaded', align: 'center' }
      ],
      searchValue: '',
      user: {
        avatar: {}
      },
      orders: [],
      open_cases: [],
      closed_cases: [],
      per_page_options: [50, 100, 150],
      orders_loading: false,
      open_cases_loading: false,
      closed_cases_loading: false,
      total_orders: 0,
      total_open_cases: 0,
      total_closed_cases: 0,
      orders_pagination: {
        page: 1,
        rowsPerPage: 100
      },
      open_cases_pagination: {
        page: 1,
        rowsPerPage: 100
      },
      closed_cases_pagination: {
        page: 1,
        rowsPerPage: 100
      },
      isPageReady: true
    }
  },

  computed: {
  },

  created () {
    this.user = _.get(this.product, 'merchant', {avatar: {}})
  },

  watch: {
    orders_pagination: {
      handler () {
        console.log('orders_pagination')
      }
    },

    open_cases_pagination: {
      handler () {
        console.log('open_cases_pagination')
      }
    },

    closed_cases_pagination: {
      handler () {
        console.log('closed_cases_pagination')
      }
    }
  }
}
