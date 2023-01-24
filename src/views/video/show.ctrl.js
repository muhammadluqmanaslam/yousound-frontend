import _ from 'lodash'
import moment from 'moment'
import UserService from '@/services/user'
import StreamService from '@/services/stream'
import CommentService from '@/services/comment'
// import ProfileService from '@/services/profile'
import { StreamStatuses } from '@/helper'
import UserTag from '@/components/user_tag'
import Attach from './components/attach'
import Chat from '@/components/chat'
import UserBox from './components/user_box'
import VideoBox from '@/components/video_box'
import VideoPlayer from './components/video_player'
import ArtistItem from '@/components/artistitem'
import PaymentModal from '@/components/paymentmodal'
import ShareModal from '@/components/sharemodal'
import Comments from '@/components/comments'
import merchModal from '@/components/merchmodal'
import sendLoveModal from '@/components/sendlovemodal'
import mobileComments from '@/views/mobile/components/mobileComments'
import commentInput from '@/components/commentInput'
import UserFollowBtn from '@/components/userFollowBtn';
import { mapActions } from 'vuex'
import CollectionService from '@/services/collection'
import AlbumService from '@/services/album'
import ProductService from '@/services/product'

const ActionCable = require('actioncable')

export default {
  components: {
    ArtistItem,
    Attach,
    Chat,
    PaymentModal,
    ShareModal,
    UserBox,
    UserTag,
    VideoBox,
    VideoPlayer,
    Comments,
    merchModal,
    sendLoveModal,
    mobileComments,
    commentInput,
    UserFollowBtn,
  },

  data() {
    return {
      activePaneTab: 'info',
      paneTabs: [
        {
          name: 'Info',
          id: 'info'
        },
        {
          name: 'Comments',
          id: 'comments'
        },
      ],
      moment: moment,
      showSendLoveModal: false,
      showMoreActive: false,
      showAttachProduct: false,
      selectAttactProduct: 1,
      stream: {},
      stream_assoc: {
        type: 'Album',
        value: null,
      },
      comments: [],
      comments_pagination: {},
      accounts: [],
      videos: [],
      buttonHover: false,
      amount: 1000,
      cable: null,
      stream_subscription: null,
      show_featured_dialog: false,
      show_payment_dialog: false,
      show_share_dialog: false,
      isPageReady: false,
      showMerchModal: false,
      mobileHeaderOptions: {},
      isSubscribed: false,
      albums: [],
      products: [],
      mainItem: null,
    }
  },

  computed: {
    ownItem() {
      return this.currentUser.id === this.user.id;
    },
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentUser() {
      return this.$store.state.auth.user
    },

    user() {
      return _.get(this.stream, 'user', {})
    },

    assocType() {
      return _.get(this.stream, 'assoc_type', '')
    },

    assocImage() {
      // console.log('assocType', this.assocType, this.stream.assoc)
      switch (this.assocType) {
        case 'Album':
          return _.get(this.stream.assoc, 'cover.thumb.url', '')
        case 'ShopProduct':
          return _.get(this.stream.assoc, 'covers[0].cover.thumb.url', '')
        default:
          return ''
      }
    },

    hasDigitalContent() {
      return _.get(this.stream, 'digital_content_url') !== null
    },

    showFeaturedSection() {
      if (this.currentUser.id === this.user.id) {
        return true
      }

      if (this.stream.assoc || this.accounts.length > 0) {
        return true
      }

      return false
    },

    followButtonText() {
      if (this.user.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    },
    initShowMore() {
      return this.stream.description.length >= 138
    },
  },

  created() {
    this.getAttachmentItems()
    this.fetchSubscriptionDetails();
    this.$store.dispatch('navigator/goNextState', {
      page: 'video',
      tab: 'show',
    })

    this.cable = ActionCable.createConsumer(
      `${process.env.SOCKET_BASE_URL}?token=${this.$store.state.auth.token}`
    )

    this.loadData(this.$route.params.videoId)

    // save header option before altering
     this.mobileHeaderOptions = this.$store.state.appMobile.mobileHeaderOptions
     console.log('entry :', this.mobileHeaderOptions);
  },
  
  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    ...mapActions({
      setMobileFooter: 'appMobile/setMobileFooterOptions',
    }),

    reRenderComments() {
      const videoId = this.$route.params.videoId
      CommentService.getComments({
          commentable_type: 'Stream',
          commentable_id: videoId,
        }).then((resp) => {
          this.comments = []
          this.comments = resp.body.comments
          this.comments_pagination = resp.body.pagination
        }).catch((e) => {
          console.log(e)
        })
    },

    getAttachmentItems() {
      Promise.all([
        AlbumService.getAlbums({
          statuses: 'published, collaborated',
          user_statuses: 'accepted',
        }),
        ProductService.getProducts({
          statuses: 'published, collaborated',
          stock_statuses: 'active',
          user_statuses: 'accepted',
        }),
      ])
        .then((values) => {
          this.albums = values[0].body
          this.products = values[1].body
          this.mainItem = this.albums[0]
        })
        .catch((reason) => {
          console.log(reason)
          // this.$store.dispatch('error/showErrorToast', [reason])
        })
    },

    async fetchSubscriptionDetails() {
      await UserService.getSubscriptionDetail(this.currentUser.id)
      .then((response) => {
        if (response.bodyText === "Subscribed") {
          this.isSubscribed = true
        }
      })
      .catch((e) => {
        this.$store.dispatch(
          'error/showErrorToast', ["There was an error on fetching user info "]
        )
      })
    },

    getAssoc(data) {
      this.stream_assoc = data
    },
    showLoveDialog() {
      this.showSendLoveModal = true
    },
    dismissLoveDialog() {
      this.showSendLoveModal = false
    },
    showMerchDialog() {
      this.showMerchModal = true
    },
    dimissMerchDialog() {
      this.showMerchModal = false
    },
    gotoAssoc() {
      const type = this.stream.assoc_type
      const id = this.stream.assoc.id
      const slug = this.stream.assoc.slug || ''

      switch (type) {
        case 'ShopProduct':
          return this.showMerchDialog()
        case 'Album':
          return this.$router.push({ name: 'AlbumDetail', params: { slug } })
        case 'profile':
          return this.$router.push(`/${this.stream.user.slug}`)
        default:
          return ''
      }
    },
    loadData(videoId) {
      const vm = this
      this.unsubscribe()
      this.stream_subscription = this.cable.subscriptions.create(
        {
          channel: 'StreamsChannel',
          stream_id: videoId,
        },
        {
          connected: () => {
            console.log('connected to StreamsChannel')
          },
          received: (data) => {
            console.log('stream_subscription')
            console.log(data)
            if (data.notified) {
              StreamService.getStream(videoId).then((res) => {
                vm.stream = res.body
              })
            } else if (data.assoc_type) {
              vm.stream.assoc_type = data.assoc_type
              vm.stream.assoc = data.assoc
            }
          },
          disconnected: () => {
            console.log('disconnected to StreamsChannel :(')
          },
        }
      )

      this.isPageReady = false
      console.log('loading data...', videoId)
      Promise.all([
        StreamService.getStream(videoId),
        CommentService.getComments({
          commentable_type: 'Stream',
          commentable_id: videoId,
        }),
        StreamService.getSimilarStreams(videoId, {
          page: 1,
          per_page: 10,
        }),
      ])
        .then((values) => {
          if (
            [
              StreamStatuses.ARCHIVED,
              StreamStatuses.RUNNING,
              StreamStatuses.UPLOADING,
            ].indexOf(values[0].body.status) > -1
          ) {
            this.stream = values[0].body

            console.log(this.stream);
            console.log(this.stream.assoc);
          } else {
            this.$router.push({ path: '/video' })
          }

          this.comments = values[1].body.comments
          this.comments_pagination = values[1].body.pagination

          this.videos = values[2].body.streams

          this.isPageReady = true
        })
        .catch((e) => {
          console.log('video/show loadData error', e)
        })
    },

    unsubscribe() {
      if (this.stream_subscription) {
        this.stream_subscription.unsubscribe()
        this.stream_subscription = null
      }
    },

    deleteStream() {
      StreamService.deleteStream(this.stream.id)
        .then(() => {
          this.$router.push({ path: '/video' })
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    updateStream() {
      let params
      if (this.stream_assoc.value && this.stream_assoc.value.id > 0) {
        params = {
          stream: {
            assoc_type: this.stream_assoc.type,
            assoc_id: this.stream_assoc.value.id,
          },
        }
      } else {
        params = {
          stream: {
            assoc_type: '',
            assoc_id: 0,
          },
        }
      }
      StreamService.updateStream(this.stream.id, params).then((res) => {
        this.stream.assoc = res.body.assoc
        this.closeFeaturedDialog()
      })
    },

    addContent() {
      const hours = document.getElementById("showAttachmentHours").textContent
      const minutes = document.getElementById("showAttachmentMinutes").textContent
      const seconds = document.getElementById("showAttachmentSeconds").textContent
      const totalSeconds = (hours*3600 + minutes*60 + seconds).replace(/^0+/, '')
      if (totalSeconds == '' || totalSeconds > this.stream.duration) {
        const errorMsg = totalSeconds == '' ? "Please select a valid duration." :
         "Selected duration is gereater than your stream duration. Please choose below your duration limit."
        this.$store.dispatch(
          'error/showErrorToast', [errorMsg]
        )
      } else {
        let assoc_id = this.mainItem.id
        let assoc_type = this.mainItem.category ? "ShopProduct" : "Album"
        let params = { stream: {show_attachment_at: totalSeconds, assoc_id: assoc_id, assoc_type: assoc_type} }
        StreamService.updateStream(this.stream.id, params).then((res) => {
          this.$store.dispatch('error/showSuccessToast', [
            'Your attachment will be listed in ' + this.stream.name + ' at chosen time for 5 seconds.',
          ])
          this.loadData(this.stream.id)
          this.showAttachProduct = false
        })
      }
    },

    openFeaturedDialog() {
      if (this.stream.assoc && this.stream.assoc.id > 0) {
        this.stream_assoc = {
          type: this.stream.assoc_type,
          value: this.stream.assoc,
        }
      } else {
        this.stream_assoc = {
          type: 'Album',
          value: null,
        }
      }

      this.show_featured_dialog = true
    },

    closeFeaturedDialog() {
      this.show_featured_dialog = false
    },

    openPaymentDialog() {
      this.show_payment_dialog = true
    },

    closePaymentDialog() {
      this.show_payment_dialog = false
    },

    openShareDialog() {
      this.show_share_dialog = true
    },

    closeShareDialog() {
      this.show_share_dialog = false
    },

    payAttachment(token) {
      let params = {
        amount: 0,
      }

      StreamService.payAttachment(this.stream.id, params)
        .then((res) => {
          this.closePaymentDialog()
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    repostItem() {
      StreamService.repostStream(this.stream.id)
        .then((res) => {
          this.$store.dispatch('error/showSuccessToast', [
            'You just added ' + this.stream.name + ' stream in your collection.',
          ])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body] || [e.body.error]
          )
        })
    },
  },

  watch: {
    $route(toPath, fromPath) {
      const videoId = this.$route.params.videoId
      console.log('vidoe/show watch', videoId)
      this.loadData(videoId)
    },
    showMoreActive(val) {
      if (val) {
        document.querySelector('.vid__description').style.height = 'auto'
        console.log(document.querySelector('.vid__description').clientHeight);
      } else {
        document.querySelector('.vid__description').style.height = '20px'
        console.log(document.querySelector('.vid__description').clientHeight);
      }
    },
    activePaneTab(val) {
       if (val === 'comments') {
        this.setMobileFooter({showFooter: false })
      } else {
        this.setMobileFooter({showFooter: true })
       }
     }
  },
  mounted() {
    // console.log('height:', document.querySelector('.vid__description').style.height);
    console.log('Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus explicabo itaque quia deleniti earum odio ut facilis, quod possimus. Quia'.length);
  }
}
