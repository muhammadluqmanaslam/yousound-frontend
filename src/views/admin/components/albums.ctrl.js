import AdminService from '@/services/admin'
import AlbumService from '@/services/album'
import ProductService from '@/services/product'

export default {
  components: {
  },

  data () {
    return {
      albums_tabs: [
        {
          id: 'published',
          title: 'Published Albums'
        },
        {
          id: 'privated',
          title: 'Privated Albums'
        },
        {
          id: 'product',
          title: 'Merch'
        }
      ],
      albums_tab: 'published',
      album_headers: [
        { text: 'Title', value: 'name', align: 'left' },
        { text: 'Artist Name', value: 'publisher_name', align: 'left' },
        { text: '# of Plays', value: 'played', align: 'center' },
        { text: '# of Downloads', value: 'downloaded', align: 'center' },
        { text: '# of Reposts', value: 'reposted', align: 'center' },
        { text: 'Recommended?', value: 'recommended', align: 'center' },
      ],
      product_headers: [
        { text: 'Title', value: 'name', align: 'left' },
        { text: 'Vendor Name', value: 'vendor_name', align: 'left' },
        { text: 'Sales', value: 'sales', align: 'center' },
        { text: 'Date Listed', value: 'listed_date', align: 'center' },
        { text: '# of Reposts', value: 'reposted', align: 'center' },
        { text: 'Recommended?', value: 'recommended', align: 'center' },
      ],
      searchValue: '',
      per_page_options: [5, 15, 25],
      published_albums: [],
      privated_albums: [],
      products: [],
      published_pagination: {
        page: 1,
        rowsPerPage: 5
      },
      privated_pagination: {
        page: 1,
        rowsPerPage: 5
      },
      product_pagination: {
        page: 1,
        rowsPerPage: 5
      },
      total_published_albums: 0,
      total_privated_albums: 0,
      total_products: 0,
      isPageReady: true
    }
  },

  created() {
  },

  methods: {
    loadPublishedAlbums() {
      const params = {
        statuses: 'published',
        page: this.published_pagination.page,
        per_page: this.published_pagination.rowsPerPage
      }
      AdminService.getAlbums(params).then(response => {
        this.published_albums = response.body.albums
        this.total_published_albums = response.body.pagination.total_count
      })
    },

    loadPrivatedAlbums() {
      const params = {
        statuses: 'privated',
        page: this.privated_pagination.page,
        per_page: this.privated_pagination.rowsPerPage
      }
      AdminService.getAlbums(params).then(response => {
        this.privated_albums = response.body.albums
        this.total_privated_albums = response.body.pagination.total_count
      })
    },

    loadProducts() {
      const params = {
        statuses: 'published',
        page: this.product_pagination.page,
        per_page: this.product_pagination.rowsPerPage
      }
      AdminService.getProducts(params).then(response => {
        this.products = response.body.products
        this.total_products = response.body.pagination.total_count
      })
    },

    onTab(tab) {
      this.albums_tab = tab
      switch (tab) {
        case 'published':
          console.log('onTab', tab)
          break
        case 'privated':
          console.log('onTab', tab)
          break
        case 'product':
          console.log('onTab', tab)
          break
      }
    }
  },

  watch: {
    published_pagination: {
      handler () {
        this.loadPublishedAlbums()
      }
    },

    privated_pagination: {
      handler () {
        this.loadPrivatedAlbums()
      }
    },

    product_pagination: {
      handler () {
        this.loadProducts()
      }
    },       
  }
}
