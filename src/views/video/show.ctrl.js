import _ from 'lodash'
import moment from 'moment'
import UserService from '@/services/user'
import StreamService from '@/services/stream'
import CommentService from '@/services/comment'
// import ProfileService from '@/services/profile'
import { StreamStatuses } from '@/helper'
import UserTag from '@/components/user_tag'
import Attach from './components/attach'
import Chat from './components/chat'
import UserBox from './components/user_box'
import VideoBox from './components/video_box'
import VideoPlayer from './components/video_player'
import ArtistItem from '@/components/artistitem'
import PaymentModal from '@/components/paymentmodal'
import ShareModal from '@/components/sharemodal'

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
  },

  data() {
    return {
      moment: moment,
      stream: {},
      stream_assoc: {
        type: 'Album',
        value: null,
      },
      comments: [],
      comments_pagination: {},
      accounts: [],
      videos: [],
      commentText: '',
      buttonHover: false,
      amount: 1000,
      cable: null,
      stream_subscription: null,
      show_featured_dialog: false,
      show_payment_dialog: false,
      show_share_dialog: false,
      isPageReady: false,
    }
  },

  computed: {
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

    followButtonText() {
      if (this.user.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    },
  },

  created() {
    this.$store.dispatch('navigator/goNextState', {
      page: 'video',
      tab: 'show',
    })

    this.cable = ActionCable.createConsumer(
      `${process.env.SOCKET_BASE_URL}?token=${this.$store.state.auth.token}`
    )

    this.loadData(this.$route.params.videoId)
  },

  beforeDestroy() {
    this.unsubscribe()
  },

  methods: {
    loadData(videoId) {
      const vm = this
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
          } else {
            this.$router.push({ path: '/video' })
          }

          this.comments = values[1].body.comments
          this.comments_pagination = values[1].body.pagination

          this.videos = values[2].body.streams

          this.unsubscribe()
          this.stream_subscription = this.cable.subscriptions.create(
            {
              channel: 'StreamsChannel',
              stream_id: vm.stream.id,
            },
            {
              connected: () => {
                console.log('connected to StreamsChannel')
              },
              received: (data) => {
                console.log('stream_subscription')
                console.log(data)
                if (data.notified) {
                  StreamService.getStream(vm.stream.id).then((res) => {
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

    addComment() {
      if (this.commentText === '') return

      const params = {
        comment: {
          commentable_type: 'Stream',
          commentable_id: this.stream.id,
          body: this.commentText,
          status: 'published',
        },
      }

      CommentService.sendComment(params)
        .then((res) => {
          this.comments.push(res.body)
          this.commentText = ''
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
            'You just reposted ' + this.stream.name,
          ])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    followUser() {
      if (this.user.is_following) {
        UserService.unfollowUser(this.user.id)
          .then((res) => {
            this.$store.dispatch('player/updateFollowingStatus', false)
            this.stream.user.is_following = false
          })
          .catch((e) => {
            console.log('unfollowUser error', e)
          })
      } else {
        UserService.followUser(this.user.id)
          .then((res) => {
            this.$store.dispatch('player/updateFollowingStatus', true)
            this.stream.user.is_following = true
          })
          .catch((e) => {
            console.log('followUser error', e)
          })
      }
    },
  },

  watch: {
    $route(toPath, fromPath) {
      const videoId = this.$route.params.videoId
      console.log('vidoe/show watch', videoId)
      this.loadData(videoId)
    },
  },
}
