import _ from 'lodash'

import AdminService from '@/services/admin'
import AlbumService from '@/services/album'
import ProductService from '@/services/product'

import albumDetailDialog from './album_detail_dialog'
import productDetailDialog from './product_detail_dialog'

export default {
  components: {
    albumDetailDialog,
    productDetailDialog
  },

  data () {
    return {
      albums_tabs: [
        { id: 'published', title: 'Published Albums' },
        { id: 'privated', title: 'Privated Albums' },
        { id: 'product', title: 'Products' }
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
      per_page_options: [50, 100, 150],
      show_album_detail_dialog: false,
      show_product_detail_dialog: false,
      show_album_delete_confirm_modal: false,
      show_product_delete_confirm_modal: false,
      album: {},
      product: {},
      published_albums: [],
      privated_albums: [],
      products: [],
      published_pagination: {
        page: 1,
        rowsPerPage: 100
      },
      privated_pagination: {
        page: 1,
        rowsPerPage: 100
      },
      product_pagination: {
        page: 1,
        rowsPerPage: 100
      },
      total_published_albums: 0,
      total_privated_albums: 0,
      total_products: 0,
      published_loading: false,
      privated_loading: false,
      product_loading: false,
      isPageReady: true
    }
  },

  created() {
  },

  methods: {
    loadPublishedAlbums() {
      const params = {
        q: this.searchValue,
        statuses: 'published, collaborated',
        page: this.published_pagination.page,
        per_page: this.published_pagination.rowsPerPage
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      AdminService.getAlbums(params).then(response => {
        this.published_albums = response.body.albums
        this.total_published_albums = response.body.pagination.total_count
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
      })
    },

    loadPrivatedAlbums() {
      const params = {
        q: this.searchValue,
        statuses: 'privated',
        page: this.privated_pagination.page,
        per_page: this.privated_pagination.rowsPerPage
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      AdminService.getAlbums(params).then(response => {
        this.privated_albums = response.body.albums
        this.total_privated_albums = response.body.pagination.total_count
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
      })
    },

    loadProducts() {
      const params = {
        statuses: 'published',
        page: this.product_pagination.page,
        per_page: this.product_pagination.rowsPerPage
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      AdminService.getProducts(params).then(response => {
        this.products = response.body.products
        this.total_products = response.body.pagination.total_count
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
      })
    },

    onTab(tab) {
      this.albums_tab = tab
    },

    onKeyEnter(e) {
      // console.log('onKeyEnter', this.albums_tab, this.searchValue, e)
      switch (this.albums_tab) {
        case 'published':
          this.loadPublishedAlbums()
          break
        case 'privated':
          this.loadPrivatedAlbums()
          break
        case 'product':
          break
      }
    },

    openAlbumDeleteConfirmModal (album) {
      this.album = album
      this.show_album_delete_confirm_modal = true
    },

    closeAlbumDeleteConfirmModal () {
      this.show_album_delete_confirm_modal = false
    },

    deleteAlbum (album) {
      this.closeAlbumDeleteConfirmModal()
      AlbumService.deleteAlbum(album.id).then(res => {
        let arr
        switch (this.albums_tab) {
          case 'published':
            _.remove(this.published_albums, (item) => { return item.id == album.id })
            arr = this.published_albums.slice()
            this.published_albums = arr
            break
          case 'privated':
            _.remove(this.privated_albums, (item) => { return item.id == album.id })
            arr = this.privated_albums.slice()
            this.privated_albums = arr
            break
        }
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    recommendAlbum (album) {
      AlbumService.recommendAlbum(album.id).then(response => {
        let arr
        switch (this.albums_tab) {
          case 'published':
            _.each(this.published_albums, (item) => { if (item.id == album.id) item.recommended = true })
            arr = this.published_albums.slice()
            this.published_albums = arr
            break
          case 'privated':
            _.remove(this.privated_albums, (item) => { if (item.id == album.id) item.recommended = true })
            arr = this.privated_albums.slice()
            this.privated_albums = arr
            break
        }
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    unrecommendAlbum (album) {
      AlbumService.unrecommendAlbum(album.id).then(response => {
        switch (this.albums_tab) {
          case 'published':
            _.each(this.published_albums, (item) => { if (item.id == album.id) item.recommended = false })
            arr = this.published_albums.slice()
            this.published_albums = arr
            break
          case 'privated':
            _.remove(this.privated_albums, (item) => { if (item.id == album.id) item.recommended = false })
            arr = this.privated_albums.slice()
            this.privated_albums = arr
            break
        }
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    openAlbumDetailDialog (album) {
      this.album = album
      this.show_album_detail_dialog = true
    },

    closeAlbumDetailDialog () {
      this.show_album_detail_dialog = false
    },

    openProductDetailDialog (product) {
      this.product = product
      this.show_product_detail_dialog = true
    },

    closeProductDetailDialog () {
      this.show_product_detail_dialog = false
    },

    openProductDeleteConfirmModal (product) {
      this.product = product
      this.show_product_delete_confirm_modal = true
    },

    closeProductDeleteConfirmModal () {
      this.show_product_delete_confirm_modal = false
    },

    deleteProduct (product) {
      this.closeProductDeleteConfirmModal()
      ProductService.deleteProduct(this.product.id).then(response => {
        _.remove(this.products, (item) => { return item.id == product.id })
        const arr = this.products.slice()
        this.products = arr
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
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
