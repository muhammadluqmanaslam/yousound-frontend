import _ from 'lodash'
import AlbumService from '@/services/album'
import albumList from '@/views/album/components/albumList'
import contentTopHeader from '@/components/contentTopHeader'

export default {
  props: {
    textBtnToRight: {
      type: Boolean,
    },
  },
  components: {
    contentTopHeader,
    albumList,
  },

  data() {
    return {
      albumTab: 'published',
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
      albums: [],
      album: {},
      show_album_delete_confirm_dialog: false,
      show_publish_confirm_dialog: false,
      show_private_confirm_dialog: false,
      show_video_only_confirm_dialog: false,
      show_album_finish_modal: false,
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
    published_albums() {
      return _.filter(this.albums, (item) => {
        return item.status === 'published' && !item.is_only_for_live_stream
      })
    },

    private_albums() {
      return _.filter(this.albums, (item) => {
        return item.status === 'privated'
      })
    },
    video_only_albums() {
      return _.filter(this.albums, (item) => {
        return item.status === 'published' && item.is_only_for_live_stream
      })
    },
    pending_albums() {
      return _.filter(this.albums, (item) => {
        return item.status === 'pending'
      })
    },
    collaborated_albums() {
      return _.filter(this.albums, (item) => {
        return item.status === 'collaborated'
      })
    },
    albumStatus() {
      if (
        this.album.status === 'published' &&
        !this.album.is_only_for_live_stream
      ) {
        return 'published'
      }

      if (
        this.album.status === 'published' &&
        this.album.is_only_for_live_stream
      ) {
        return 'video_only'
      }

      return 'privated'
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
    setAlbumFilter(id) {
    //   update status if id is valid
    //   albumTab will be fallback idf id is not valid
    //   id will always be updated in future
      const status = id || this.albumTab

      // this.albums.map((a) => console.log(a.status))
      // this.albums.map((a) => console.log(a.is_only_for_live_stream))

    //   update albumTab with valid instance
      this.albumTab = status

      const filtered = _.filter(this.albums, (item) => {
        return item.status === status
      })

    //   console.log(this.albums)
    // console.log(this.products.filter((p) => p.status == 'published'))
    //   console.log(this.products.map((p) => p.status))
    // console.log(this.products.map((p) => p.collaborators))
      console.log(filtered)
      return filtered
    },
    loadAlbums() {
      this.$store.dispatch('error/showLoadingActivity', true)
      this.isPageReady = false
      AlbumService.getAlbums()
        .then((response) => {
          this.albums = response.body
          console.log(response)
          this.$store.dispatch('error/showLoadingActivity', false)
          this.isPageReady = true
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.isPageReady = true
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    openAlbumDeleteConfirmDialog(album) {
      this.album = album
      this.show_album_delete_confirm_dialog = true
    },
    closeAlbumDeleteConfirmDialog() {
      this.album = {}
      this.show_album_delete_confirm_dialog = false
    },
    deleteAlbum() {
      // console.log('deleteAlbum', this.album)
      AlbumService.deleteAlbum(this.album.id)
        .then((response) => {
          _.remove(this.albums, (item) => {
            return item.id == this.album.id
          })
          const arr = this.albums.slice()
          this.albums = arr
          this.closeAlbumDeleteConfirmDialog()
        })
        .catch((e) => {
          this.closeAlbumDeleteConfirmDialog()
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
    editAlbum(album) {
      // console.log('editAlbum', album)
      this.$router.push(`/album/${album.slug}/edit`)
    },
    openPublishConfirmDialog(album) {
      this.album = album
      this.show_publish_confirm_dialog = true
    },
    openPrivateConfirmDialog(album) {
      this.album = album
      this.show_private_confirm_dialog = true
    },
    closePrivateConfirmDialog() {
      this.album = {}
      this.show_private_confirm_dialog = false
    },
    openVideoOnlyConfirmDialog(album) {
      this.album = album
      this.show_video_only_confirm_dialog = true
    },
    closeVideoOnlyConfirmDialog() {
      this.album = {}
      this.show_video_only_confirm_dialog = false
    },
    privateAlbum() {
      AlbumService.makePrivateAlbum(this.album.id)
        .then((response) => {
          this.album.status = 'privated'
          this.closePrivateConfirmDialog()
        })
        .catch((e) => {
          this.closePrivateConfirmDialog()
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
    videoOnlyAlbum() {
      AlbumService.makeLiveVideoOnlyAlbum(this.album.id)
        .then((response) => {
          this.closeVideoOnlyConfirmDialog()
          this.album.status = 'published'
          this.album.is_only_for_live_stream = true
        })
        .catch((e) => {
          this.closeVideoOnlyConfirmDialog()
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
    acceptAlbum(album) {
      AlbumService.acceptCollaboration(album.id).then((response) => {
        this.loadAlbums()
      })
    },
    denyAlbum(album) {
      AlbumService.denyCollaboration(album.id).then((response) => {
        this.loadAlbums()
      })
    },
    releaseAlbum(album) {
      AlbumService.releaseAlbum(album.id).then((response) => {
        this.active_tab = 'collaborated'
        this.loadAlbums()
      })
    },
    isActiveTab(tab) {
      return this.active_tab === tab
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

    openProductFinishModal() {
      this.show_product_finish_modal = true
    },

    closeProductFinishModal() {
      this.show_product_finish_modal = false
    },

    closeShipConfirmModal() {
      this.$refs.valid_tracking_form.reset()
      this.show_ship_confirm_modal = false
    },
    openUnshipConfirmModal(item) {
      this.selected_item = item
      this.show_unship_confirm_modal = true
    },

    closeUnshipConfirmModal() {
      this.show_unship_confirm_modal = false
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
    notResponded(product) {
      const collaborator = _.find(product.collaborators, (c) => {
        return c.user_id == this.$store.state.auth.user.id
      })
            // console.log('notResponded', this.$store.state.auth.user.id, collaborator)
      return collaborator && collaborator.status == 'pending'
    },
  },
  created() {
    // if (this.$store.state.auth.user.user_type !== 'artist') {
    //   this.$router.push({ path: '/' })
    //   return
    // }

    const tab = this.$route.hash.substr(1)
    this.setTab(tab)

    const lastState = this.$store.getters['navigator/last']
    console.log(lastState)
    if (_.get(lastState, 'params.album_id')) {
      AlbumService.getAlbum(lastState.params.album_id).then((response) => {
        this.album = response.body

        console.log(response.body);
        this.openAlbumFinishModal()
      })
    }
    this.loadAlbums()
  },
  mounted() { },
}
