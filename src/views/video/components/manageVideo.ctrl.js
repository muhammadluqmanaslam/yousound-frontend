import _ from 'lodash'
import StreamService from '@/services/stream'
import ListVideo from '@/views/video/components/listVideo'
import albumFinishModal from '@/components/albumfinishmodal'

export default {
  props: {
    textBtnToRight: {
      type: Boolean,
    },
  },
  components: {
    ListVideo,
    albumFinishModal
  },

  data() {
    return {
      activeTab: 0,
      pagination: {
        current_page: 1,
        total_pages: 0,
      },
      videos: [],
      show_album_finish_modal: false,
      isPageReady: false,
      items_per_page: 100,
      showReleaseVideoModal: false,
      releaseVideo: null,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
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
    showPromoteModal() {
    },

    dismissFinishDialog() {
      this.showReleaseVideoModal = false
    },
    setVideoFilter(id) {
    //   update status if id is valid
    //   albumTab will be fallback idf id is not valid
    //   id will always be updated in future
      const status = id || this.albumTab

    //   update albumTab with valid instance
    //   this.albumTab = status

    //   const filtered = _.filter(this.albums, (item) => {
    //     return item.status === status
    //   })

    //   console.log(filtered)
    //   return filtered
    },
    loadData(tab, page) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        genre_id: tab,
        only_follows: this.only_follows,
        page: page,
        per_page: this.items_per_page,
        user_id: this.currentUser.id
      }
      StreamService.getStreams(params)
            .then((response) => {
              this.videos = this.videos.concat(response.body.streams)

              // this will return a a prop limit if available
              this.videos = this.videos.slice(0, this.listLimit || this.videos.length)
              // this.videos.filter((v) => )
              // this.videos = [ ...this.videos, ...this.videos]
              // console.log(this.videos)
              this.pagination = response.body.pagination
              this.videoGenres = response.body.genres
              this.$store.dispatch('error/showLoadingActivity', false)
              this.isPageReady = true
            })
            .catch(() => {
              this.$store.dispatch('error/showLoadingActivity', false)
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
    const releaseVideoId = localStorage.getItem("release_video")
    if (releaseVideoId) {
      StreamService.getStream(releaseVideoId).then((response) => {
        this.releaseVideo = response.body
        if (this.releaseVideo) {
          this.showReleaseVideoModal = true
          localStorage.removeItem("release_video")
        }
      }).catch((exception) => {
        console.log(exception)
      })
    }
    const tab = this.$route.hash.substr(1)
    this.setTab(tab)

    const lastState = this.$store.getters['navigator/last']
    // console.log(lastState)

    this.loadData(this.activeTab, this.pagination.current_page)
  },
  mounted() { },
}
