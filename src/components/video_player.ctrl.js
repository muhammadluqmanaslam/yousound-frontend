/* global $:true */

import _ from 'lodash'
import Vue from 'vue'
import moment from 'moment'
import SocketManager from '@/services/chat'
import AuthService from '@/services/auth'

import ActivityService from '@/services/activity'
import AlbumService from '@/services/album'
import ItemService from '@/services/item'
import ProductService from '@/services/product'
import StreamService from '@/services/stream'
import UserService from '@/services/user'

import activityAlbumCard from '@/components/activityalbumcard'
import activityProductCard from '@/components/activityproductcard'
import activityUserCard from '@/components/activityusercard'
import downloadModal from '@/components/downloadmodal'
import merchModal from '@/components/merchmodal'
import paymentModal from '@/components/paymentmodal'
import shareModal from '@/components/sharemodal'

import { MyEvents } from '@/helper'

const LATENCY_TIME = 3
const ActionCable = require('actioncable')
const linkRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/

export default {
  components: {
    activityAlbumCard,
    activityProductCard,
    activityUserCard,
    downloadModal,
    merchModal,
    paymentModal,
    shareModal,
  },

  data() {
    return {
      can_view: false,
      exceed_capacity: false,
      player: null,
      time: 0,
      latency_time: LATENCY_TIME,
      watching_interval: null,
      latency_time_interval: null,
      show_payment_dialog: false,
      show_streaming_confirm_dialog: false,
      show_stream_delete_confirm_dialog: false,
      show_album_merch_popup: false,
      show_download_modal: false,
      show_merch_modal: false,
      show_share_dialog: false,
      request_tab: 'Album',
      userSearchKeyword: '',
      assoc: {},
      albums: [],
      products: [],
      users: [],
      buttonHover: false,
      cable: null,
      stream_subscription: null,
      chat_socket: null,
      moment: moment,
      room: {
        settings: {
          links: false,
          charLimitBool: false,
          charLimit: 100,
          attachments: true,
        },
        online: [],
        idle: [],
      },
      message: '',
      messages: [],
      albumLinks: {},
      merchLinks: {},
      userLinks: {},
      notAttachments: [],
      isPageReady: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    stream() {
      return this.$store.state.videoPlayer.stream
    },

    streamGenreName() {
      return _.get(this.stream, 'genre.name', '')
    },

    // #TODO change user -> streamingUser
    user() {
      return _.get(this.stream, 'user', null)
    },

    album() {
      // return this.albums[0]
      return _.get(this.stream, 'assoc')
    },

    product() {
      // return this.products[0]
      return _.get(this.stream, 'assoc')
    },

    reverseMessages() {
      return this.messages.slice(0, 3).reverse()
    },

    isInCart() {
      if (this.stream.assoc_type !== 'ShopProduct') {
        return false
      }

      const item = _.find(this.$store.state.user.cartItems, (item) => {
        return item.product_id === this.stream.assoc.id
      })

      return !!item
    },

    showAttachButton() {
      return (
        this.stream &&
        ['Album', 'ShopProduct', 'User'].indexOf(this.stream.assoc_type) === -1
      )
    },

    /* add latency on playing video confirmation dialog */
    enabledPlaying() {
      return this.latency_time <= 0
    },

    latencyTime() {
      return this.enabledPlaying ? '' : ` (${this.latency_time})`
    },

    followButtonText() {
      if (this.user.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    },
  },

  watch: {
    $route(toPath, fromPath) {
      // console.log('video-player', toPath.path, fromPath.path)
      this.show_payment_dialog = false
      this.show_streaming_confirm_dialog = false
    },

    message: function (newVal, oldVal) {
      // console.log('message', newVal, oldVal)
      if (newVal === '') {
        $('#my_video').removeClass('is-chatting')
      } else {
        $('#my_video').addClass('is-chatting')
      }
    },

    show_streaming_confirm_dialog: function (val) {
      if (!val) {
        if (this.latency_time_interval) {
          clearInterval(this.latency_time_interval)
          this.latency_time_interval = null
        }
      }
    },
  },

  created() {
    // console.log('video-player created')
    // this.$root.$on(MyEvents.AUTH_SIGNOUT, this.deleteStream)
    this.$root.$on(MyEvents.AUDIO_PLAYER_PLAY, this.mutePlayer)
    this.$root.$on(MyEvents.AUDIO_PLAYER_REPLAY, this.mutePlayer)
    this.$root.$on(MyEvents.AUDIO_PLAYER_PAUSE, this.unmutePlayer)
    this.$root.$on(MyEvents.VIDEO_PLAYER_INIT, this.init)
    this.$root.$on(MyEvents.VIDEO_PLAYER_SHUTDOWN, this.closePlayer)
    this.$root.$on(MyEvents.USER_FOLLOW, this.setFollowingStatus)

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
      })
      .catch((reason) => {
        console.log(reason)
        // this.$store.dispatch('error/showErrorToast', [reason])
      })

    this.cable = ActionCable.createConsumer(
      `${process.env.SOCKET_BASE_URL}?token=${this.$store.state.auth.token}`
    )
  },

  beforeDestroy() {
    // console.log('video-player beforeDestroy')
    // this.$root.$off(MyEvents.AUTH_SIGNOUT, this.deleteStream)
    this.$root.$off(MyEvents.AUDIO_PLAYER_PLAY, this.mutePlayer)
    this.$root.$off(MyEvents.AUDIO_PLAYER_REPLAY, this.mutePlayer)
    this.$root.$off(MyEvents.AUDIO_PLAYER_PAUSE, this.unmutePlayer)
    this.$root.$off(MyEvents.VIDEO_PLAYER_INIT, this.init)
    this.$root.$off(MyEvents.VIDEO_PLAYER_SHUTDOWN, this.closePlayer)
    this.$root.$off(MyEvents.USER_FOLLOW, this.setFollowingStatus)
    this.closePlayer()
  },

  methods: {
    init() {
      console.log('video-player initializing...')
      // this.player.load('https://edge.flowplayer.org/functional.m3u8')
      // this.initPlayer('https://edge.flowplayer.org/functional.m3u8')
      // this.openStreamingConfirmDialog()
      this.can_view = false
      this.exceed_capacity = false
      StreamService.canViewStream(this.stream.id).then((response) => {
        if (response.body.code) {
          // console.log(1, response.body.code)
          this.can_view = true
          this.openStreamingConfirmDialog()
        } else if (response.body.amount > 0) {
          // console.log(2, response.body.amount)
          this.openStreamingConfirmDialog()
          // this.openPaymentDialog()
        } else if (response.body.amount === 0) {
          this.exceed_capacity = true
          this.show_streaming_confirm_dialog = true
        } else {
          // console.log(3, response.body.message)
          this.$store.dispatch('error/showErrorToast', [response.body.message])
        }
      })
    },

    initPlayer(url) {
      const vm = this

      window.videojs(
        'my_video',
        {
          autoplay: true,
          sources: [
            {
              type: 'application/x-mpegURL',
              src: url,
            },
          ],
        },
        function () {
          console.log('video_player ready', this)
          vm.player = this

          vm.$store.dispatch('videoPlayer/setStatus', 'active')
          vm.player.requestFullscreen()

          console.log(vm.$refs.myVideo)
          // document
          //   .querySelector(vm.$refs.myVideo)
          //   .appendChild(vm.$refs.closeButton)
          // $('.close-btn').appendTo($('#my_video'))
          // $('.my_overlay').appendTo($('#my_video'))

          vm.player.on('fullscreenchange', () => {
            if (vm.player.isFullscreen()) {
              console.log('video_player fullscreen')
              vm.$store.dispatch('videoPlayer/setFrameMode', 'full')
              vm.$root.$emit(MyEvents.VIDEO_PLAYER_FULLSCREEN_ENTER)
              vm.player.muted(false)
              vm.player.volume(1.0)
            } else {
              console.log('video_player fullscreen-exit')
              vm.$store.dispatch('videoPlayer/setFrameMode', 'normal')
              if (
                vm.$store.state.player.isPlaying &&
                !vm.$store.state.player.isPaused
              ) {
                vm.player.muted(false)
              }
            }
          })

          vm.player.on('dispose', () => {
            vm.$root.$emit(
              MyEvents.VIDEO_PLAYER_EXIT,
              _.get(vm.$store.state.videoPlayer.stream, 'user.username', '')
            )
            vm.$store.commit('videoPlayer/reset')
          })
        }
      )

      this.stream_subscription = this.cable.subscriptions.create(
        {
          channel: 'StreamsChannel',
          stream_id: vm.$store.state.videoPlayer.stream.id,
        },
        {
          connected: () => {
            console.log('connected to StreamsChannel')
          },
          received: (data) => {
            console.log('stream_subscription')
            console.log(data)
            if (data.assoc_type) {
              vm.$store.dispatch('videoPlayer/updateStreamAssoc', data)
            } else if (data.notified) {
              console.log('signal comming')
            } else {
              vm.$store.dispatch('videoPlayer/addStats', data)
            }
          },
          disconnected: () => {
            console.log('disconnected to StreamsChannel :(')
          },
        }
      )

      this.watching_interval = setInterval(() => {
        StreamService.watchingStream(this.stream.id)
      }, 60000)

      /*
      this.chat_socket = new SocketManager(
        process.env.CHAT_SERVER_URL,
        this.user.slug,
        AuthService.getToken(),
        () => {
          this.chat_socket.onDisconnect = () => {
            console.log('videoPlayer onDisconnect')
          }

          this.chat_socket.onMessage = function (message) {
            // console.log('videoPlayer onMessage', message)
            if (!message) return

            // look up the username in message.from to get image, etc.
            if (message.from === vm.currentUser.username) {
              message.me = true
              message.fromUser = vm.currentUser
              vm.messages.unshift(message)
            } else {
              UserService.getUserInfo(message.from).then((response) => {
                message.fromUser = response.body
                if (vm.messages.length) {
                  if (vm.messages[0].localId !== message.localId) {
                    vm.messages.unshift(message)
                  }
                }
              })
            }

            if (vm.isAlbumLink(message.text)) {
              vm.getAlbumFromLink(message.text)
            }

            if (vm.isMerchLink(message.text)) {
              vm.getMerchFromLink(message.text)
            }

            if (vm.isUserLink(message.text)) {
              vm.getUserFromLink(message.text)
            }
          }

          // this.chat_socket.onUserInfo = function (user) {
          //   console.log('videoPlayer onUserInfo')
          //   vm.user = user
          // }

          this.chat_socket.onRoomInfo = async (room) => {
            console.log('videoPlayer onRoomInfo', room)
            // Vue.set(vm, 'room', room)
            vm.room = room
          }

          this.chat_socket.onLoadMessages = function (loadMessageObj) {
            // console.log('videoPlayer onLoadMessages')
            // loadMessageObj is an object {chunk: <chunk number>, data: <array of messages in chunk>, last: <if it's the last chunk>}
            for (
              var i = loadMessageObj.chunk * 500;
              i < (loadMessageObj.chunk + 1) * 500;
              i++
            ) {
              var nextMessage =
                loadMessageObj.data[i - loadMessageObj.chunk * 500]
              if (nextMessage) {
                Vue.set(vm.messages, i, nextMessage)
              }
            }
            vm.messages.map((message) => {
              if (message) {
                if (vm.isAlbumLink(message.text)) {
                  vm.getAlbumFromLink(message.text)
                }
                if (vm.isMerchLink(message.text)) {
                  vm.getMerchFromLink(message.text)
                }
                if (vm.isUserLink(message.text)) {
                  vm.getUserFromLink(message.text)
                }
                if (message.from === vm.currentUser.username) {
                  message.me = true
                }
                UserService.getUserInfo(message.from).then((response) => {
                  Vue.set(message, 'fromUser', response.body)
                })
                return message
              }
            })
          }
        }
      )*/
    },

    getMetrics() {
      if (this.user.id !== this.currentUser.id) {
        return
      }

      const params = {
        page_track: `Stream: ${this.stream.id}`,
      }
      ActivityService.getMetrics(params)
        .then((response) => {
          // console.log('getMetrics', response.body)
          this.$store.dispatch('videoPlayer/setStats', response.body)
        })
        .catch((e) => {
          console.log('getMetrics', e.body.errors || [e.body])
        })
    },

    onRequestTab(tab) {
      if (this.request_tab === tab) {
        return
      }

      this.request_tab = tab
      if (this.request_tab === 'User') {
        this.loadUsers()
      }
    },

    loadUsers() {
      var params = {
        page: 1,
        per_page: 10,
      }
      if (this.userSearchKeyword.length) {
        params['q'] = this.userSearchKeyword
      }
      UserService.searchUsers(params)
        .then((response) => {
          this.users = response.body.users
          console.log('loadUser', this.assoc)
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    selectItem(assoc_type, assoc) {
      // console.log(assoc_type, assoc)
      this.show_album_merch_popup = false
      if (assoc.id !== this.assoc.id) {
        this.assoc = assoc
        const params = {
          stream: {
            assoc_type: assoc_type,
            assoc_id: assoc.id,
          },
        }
        StreamService.updateStream(this.stream.id, params)
          .then((response) => {})
          .catch((e) => {
            this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
            )
          })
      }
    },

    removeItem() {
      this.assoc = {}
      const params = {
        stream: {
          assoc_type: '',
          assoc_id: 0,
        },
      }
      StreamService.updateStream(this.stream.id, params)
        .then((response) => {})
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    removeProductFromCart() {
      const item = _.find(this.$store.state.user.cartItems, (item) => {
        return item.product_id === this.stream.assoc.id
      })

      if (item) {
        ItemService.deleteCartItem(item.id)
      }
    },

    choosePage(path) {
      this.player.exitFullscreen()
      this.$router.push({ path: '/' + path })
    },

    openPaymentDialog() {
      this.show_payment_dialog = true
    },

    closePaymentDialog() {
      this.show_payment_dialog = false
    },

    openDownloadModal() {
      this.show_download_modal = true
    },

    closeDownloadModal() {
      this.show_download_modal = false
    },

    openMerchModal() {
      this.show_merch_modal = true
    },

    closeMerchModal() {
      this.show_merch_modal = false
    },

    openAlbumMerchPopup() {
      this.show_album_merch_popup = true
    },

    closeAlbumMerchPopup() {
      this.show_album_merch_popup = false
    },

    openStreamingConfirmDialog() {
      this.latency_time = LATENCY_TIME
      this.show_streaming_confirm_dialog = true

      const vm = this
      vm.latency_time_interval = setInterval(() => {
        vm.latency_time--
        if (vm.enabledPlaying) {
          clearInterval(vm.latency_time_interval)
          vm.latency_time_interval = null
        }
      }, 1000)
    },

    closeStreamingConfirmDialog() {
      this.show_streaming_confirm_dialog = false
    },

    openStreamDeleteConfirmDialog() {
      this.show_stream_delete_confirm_dialog = true
    },

    closeStreamDeleteConfirmDialog() {
      this.show_stream_delete_confirm_dialog = false
    },

    openShareDialog() {
      this.show_share_dialog = true
    },

    closeShareDialog() {
      this.show_share_dialog = false
    },

    downloadAlbum() {
      // this.openShareDialog()
      const params = {
        page_track: `Stream: ${this.stream.id}`,
      }
      AlbumService.downloadAlbum(this.stream.assoc.id, params)
        .then((response) => {
          var a = document.createElement('A')
          a.href = response.body.url
          a.target = '_blank'
          a.download = ''
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    visitProfile() {
      this.player.exitFullscreen()
      this.$router.push({ path: `/${this.stream.assoc.slug}` })
    },

    deleteStream() {
      console.log('deleteStream', this.user)
      this.closePlayer()
      if (this.stream) {
        StreamService.deleteStream(this.stream.id)
          .then((response) => {
            this.$store.dispatch('auth/setStream', null)
            this.$router.push({ path: '/' })
          })
          .catch((e) => {
            this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
            )
          })
      }
    },

    repostStream() {
      StreamService.repostStream(this.stream.id)
        .then((response) => {
          this.$store.commit('videoPlayer/repostStream')
          this.$store.dispatch('error/showSuccessToast', [
            'You just reposted this live stream',
          ])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    payViewStream(token) {
      let params = {
        amount: this.stream.view_price,
      }
      if (token) {
        params['payment_token'] = token.id
      }
      StreamService.payViewStream(this.stream.id, params)
        .then((response) => {
          this.closePaymentDialog()
          // this.openStreamingConfirmDialog()
          this.can_view = true
          this.onClick()
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    viewStream() {
      StreamService.viewStream(this.stream.id).then((response) => {
        this.getMetrics()
      })
    },

    followUser() {
      if (this.user.is_following) {
        UserService.unfollowUser(this.user.id)
          .then((response) => {
            // this.user.is_following = false
            // this.$store.dispatch('player/setUpdatedUser', _.cloneDeep(this.user))
            this.$root.$emit(MyEvents.USER_FOLLOW, this.user.id, false)
          })
          .catch((e) => {
            // this.$store.dispatch('error/showErrorToast', e.body.errors|| [e.body])
          })
      } else {
        const params = {
          page_track: `Stream: ${this.stream.id}`,
        }
        UserService.followUser(this.user.id, params)
          .then((response) => {
            // this.$store.dispatch('error/showSuccessToast', ['You just followed ' + this.user.display_name])
            // this.user.is_following = true
            // this.$store.dispatch('player/setUpdatedUser', _.cloneDeep(this.user))
            this.$root.$emit(MyEvents.USER_FOLLOW, this.user.id, true)
          })
          .catch((e) => {
            // this.$store.dispatch('error/showErrorToast', e.body.errors|| [e.body])
          })
      }
    },

    setFollowingStatus(userId, isFollowing) {
      if (this.user && this.user.id === userId) {
        this.$store.dispatch('videoPlayer/updateFollowingStatus', isFollowing)
      }
    },

    closeSocket() {
      if (this.stream_subscription) {
        this.stream_subscription.unsubscribe()
        this.stream_subscription = null
      }

      if (this.chat_socket) {
        this.chat_socket.close()
        this.chat_socket = null
      }
    },

    closePlayer() {
      if (this.player) {
        this.player.dispose()
      }

      if (this.latency_time_interval) {
        clearInterval(this.latency_time_interval)
        this.latency_time_interval = null
      }

      if (this.watching_interval) {
        clearInterval(this.watching_interval)
        this.watching_interval = null
      }

      this.closeSocket()
    },

    mutePlayer() {
      if (this.player) {
        this.player.muted(true)
      }
    },

    unmutePlayer() {
      if (this.player) {
        this.player.muted(false)
      }
    },

    isAttachmentLink(string) {
      // const attachmentRegex = /\/((album)|(merch)\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12})|user\/\w+/g
      const attachmentRegex = /\/((album)|(merch)\/\d+)|user\/\w+/g
      return (
        this.notAttachments.indexOf(string) < 0 && attachmentRegex.test(string)
      )
    },

    isAlbumLink(string) {
      // const albumLinkRegex = /\/album\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
      const albumLinkRegex = /\/album\/\d+/g
      return albumLinkRegex.test(string)
    },

    isMerchLink(string) {
      // const merchLinkRegex = /\/merch\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g
      const merchLinkRegex = /\/merch\/\d+/g
      return merchLinkRegex.test(string)
    },

    isUserLink(string) {
      const userLinkRegex = /\/user\/\w+/g
      return this.isAttachmentLink(string) && userLinkRegex.test(string)
    },

    getAlbumFromLink(string) {
      const albumId = string.split('/')[2]
      AlbumService.getAlbum(albumId)
        .then((res) => {
          if (res.ok) {
            Vue.set(this.albumLinks, string, res.body)
          } else {
            this.notAttachments.push(string)
          }
        })
        .catch(() => {
          this.notAttachments.push(string)
        })
    },

    getMerchFromLink(string) {
      const merchId = string.split('/')[2]
      ProductService.getProduct(merchId)
        .then((res) => {
          if (res.ok) {
            Vue.set(this.merchLinks, string, res.body)
          } else {
            this.notAttachments.push(string)
          }
        })
        .catch(() => {
          this.notAttachments.push(string)
        })
    },

    getUserFromLink(string) {
      const userId = string.split('/')[2]
      UserService.getUserInfo(userId)
        .then((res) => {
          if (res && res.ok) {
            Vue.set(this.userLinks, string, res.body)
          } else {
            this.notAttachments.push(string)
          }
        })
        .catch(() => {
          this.notAttachments.push(string)
        })
    },

    sendMessage(messageText) {
      if (
        this.room.settings.charLimitBool &&
        this.message.length > this.room.settings.charLimit
      ) {
        return false
      }
      if (!this.room.settings.links && linkRegex.test(this.message)) return // TODO error instead of returning
      this.chat_socket.sendMessage(messageText, this.currentUser.username)
      this.message = '' // clear textbox
      $('#msg-container').scrollTop = $('#msg-container').scrollHeight
      return false
    },

    onClick: function (e) {
      this.closeStreamingConfirmDialog()

      if (!this.can_view) {
        this.openPaymentDialog()
        return
      }

      this.closeSocket()
      // this.initPlayer('https://edge.flowplayer.org/functional.m3u8')
      // this.initPlayer('https://edge.flowplayer.org/FlowplayerHTML5forWordPress.m3u8')
      // this.getMetrics()
      // console.log('this.stream.assoc_type', this.stream.assoc_type)
      this.viewStream()
      this.initPlayer(this.stream.mp_channel_1_ep_1_url)
    },
  },

  mounted() {},
}
