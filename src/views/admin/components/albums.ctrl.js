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
        console.log('published_pagination handler', this.published_pagination)
        this.loadPublishedAlbums()
      }
    },

    privated_pagination: {
      handler () {
        console.log('privated_pagination handler', this.privated_pagination)
        this.loadPrivatedAlbums()
      }
    },

    product_pagination: {
      handler () {
        console.log('product_pagination handler', this.product_pagination)
        this.loadProducts()
      }
    },       
  }

  /*
  computed: {
    published_albums () {
      return _.filter(this.albums, (album) => { return album.status === 'published' })
    },

    private_albums () {
      return _.filter(this.albums, (album) => { return album.status === 'privated' })
    }
  },

  created () {
    // console.log('admin / albums created')
    // this.$store.dispatch('auth/setTab', 'users')
    this.loadAlbums()
  },

  methods: {
    loadAlbums (filter) {
      this.$store.dispatch('error/showLoadingActivity', true)
      this.isPageReady = true
      AlbumService.getAlbums().then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        // this.albums = this.albums.concat(response.body)
        this.albums = response.body
        // this.page_index = response.body.pagination.current_page
        // this.total_pages = response.body.pagination.total_pages
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    deleteAlbum (album) {
      AlbumService.deleteAlbum(album.id).then(response => {
        _.remove(this.albums, (item) => { return item.id === album.id })
        const arr = this.albums.slice()
        this.albums = arr
        this.hideAlbumDeleteConfirmDialog()
      }).catch(e => {
        this.hideAlbumDeleteConfirmDialog()
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    recommendAlbum (album) {
      AlbumService.recommendAlbum(album.id).then(response => {
        album.recommended = true
        this.$store.dispatch('error/showSuccessToast', ['You just recommended ' + album.name])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    unrecommendAlbum (album) {
      AlbumService.unrecommendAlbum(album.id).then(response => {
        album.recommended = false
        this.$store.dispatch('error/showSuccessToast', ['You just unrecommended ' + album.name])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    loadProducts (filter) {
      this.$store.dispatch('error/showLoadingActivity', true)
      this.isPageReady = true
      const params = {
        page: this.page_index + 1,
        per_page: this.per_page
      }
      ProductService.getProducts().then( response=> {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.merches = this.merches.concat(response.body)
        // this.merches = response.body.products
        // this.page_index = response.body.pagination.current_page
        // this.total_pages = response.body.pagination.total_pages
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    deleteProduct(product) {
      ProductService.deleteProduct(product.id).then(response => {
        _.remove(this.products, (item) => { return item.id === product.id })
        const arr = this.products.slice()
        this.products = arr
        // this.hideAlbumDeleteConfirmDialog()
      }).catch(e => {
        // this.hideAlbumDeleteConfirmDialog()
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    onTab(tab) {
      if (tab === 'merch') {
        this.loadProducts()
      } else {
        this.loadAlbums()
      }
    }
  },

  mounted () {
  }
  */
}
