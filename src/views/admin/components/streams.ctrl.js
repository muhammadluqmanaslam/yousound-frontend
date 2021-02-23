import AdminService from '@/services/admin'
import StreamService from '@/services/stream'

export default {
  data() {
    return {
      active_tab: 'all',
      tabs: [
        { id: 'all', title: 'All Users' },
        { id: 'artists', title: 'Artists' },
        { id: 'brands', title: 'Brands' },
      ],
      headers: [
        { text: 'Username', value: 'user.username', align: 'left' },
        { text: 'Title', value: 'name', align: 'left' },
        { text: 'Date', value: 'created_at', align: 'center' },
        { text: 'Broadcast Time', value: 'broadcast_time', align: 'center' },
        { text: 'Total Viewers', value: 'total_viewers', align: 'center' },
        { text: 'Genre', value: 'genre.name', align: 'left' },
        { text: 'Pay Per View', value: 'view_price', align: 'left' },
        { text: '', value: 'status', align: 'left' },
      ],
      show_stream_stop_confirm_dialog: false,
      search_value: '',
      per_page_options: [50, 100, 150],
      items: [],
      item: null,
      pagination: {
        page: 1,
        rowsPerPage: 50,
      },
      total_items: 0,
      isPageReady: true,
    }
  },

  methods: {
    loadItems() {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        q: this.search_value,
        page: this.pagination.page,
        per_page: this.pagination.rowsPerPage,
      }
      AdminService.getStreams(params)
        .then((response) => {
          this.items = response.body.streams
          this.total_items = response.body.pagination.total_count
          this.$store.dispatch('error/showLoadingActivity', false)
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
        })
      return []
    },

    onTab(tab) {
      if (this.active_tab === tab) return

      this.active_tab = tab
      this.pagination = {
        page: 1,
        rowsPerPage: 50,
      }
    },

    openStreamStopConfirmDialog(item) {
      this.item = item
      this.show_stream_stop_confirm_dialog = true
    },

    closeStreamStopConfirmDialog() {
      this.show_stream_stop_confirm_dialog = false
    },

    archiveStream() {
      this.closeStreamDeleteConfirmDialog()
      this.$store.dispatch('error/showLoadingActivity', true)
      StreamService.archiveStream(this.item.id)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.item.status = 'deleted'
          this.item = null
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
          this.item = null
        })
    },
  },

  watch: {
    pagination: {
      handler() {
        this.loadItems()
      },
    },
  },

  created() {},
}
