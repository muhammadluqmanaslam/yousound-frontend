import _ from 'lodash'
import { mixin as onClickOutside } from 'vue-on-click-outside'
import { Utils } from '@/helper'

import AlbumService from '@/services/album'
import AuthService from '@/services/auth'
import MessageService from '@/services/message'
import UserService from '@/services/user'
import ProductService from '@/services/product'

import profileItem from '@/components/profileitem'
import { Picker } from 'emoji-mart-vue'
import repostPaymentModal from '@/components/repost_payment_modal'
import message from './components/message'

const ActionCable = require('actioncable')
const DefaultRepostMessage = 'Hi, if you like this please repost it, thank you.'

export default {
  components: {
    profileItem,
    Picker,
    message,
    repostPaymentModal,
  },

  mixins: [onClickOutside],

  data() {
    return {
      tab: 'album',
      item: null,
      show_stopPopup: false,
      show_conversation_delete_confirm_dialog: false,
      show_block_user_confirm_dialog: false,
      show_repost_payment_modal: false,
      showEmojiPicker: false,
      page_index: 0,
      total_pages: 1,
      items_per_page: 5 * 5,
      conversations: [],
      conversation: {},
      conversation_pagination: {
        count: 0,
        current_page: 0,
        per_page: 50,
        total_count: 0,
        total_pages: 0,
      },
      messages: [],
      message: {
        body: '',
      },
      message_pagination: {
        count: 0,
        current_page: 0,
        per_page: 50,
        total_count: 0,
        total_pages: 0,
      },
      timer: null,
      cable: null,
      message_subscription: null,
      albums: [],
      products: [],
      itemType: {
        album: 'Album',
        merch: 'ShopProduct',
      },
      repostedFeeds: [],
      isPageReady: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    other_name() {
      return _.get(this.conversation, 'other.display_name', '')
    },

    toLocalTimeString() {
      return Utils.toLocalTimeString
    },

    current_repost_price() {
      return _.get(this.conversation, 'other.repost_price', 0)
    },
  },

  created() {
    if (!this.currentUser) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    this.$store.dispatch('navigator/goNextState', { page: 'messages', tab: '' })

    // if (this.currentUser.data['message_page_visited'] !== 1) {
    //   this.show_stopPopup = true
    // }

    if (['brand'].indexOf(this.currentUser.user_type) != -1) {
      this.tab = 'merch'
    }
    this.loadConversations()
    this.loadAlbums()
    this.loadProducts()

    const vm = this
    // this.timer = setInterval(function(){ vm.refreshMessages() }, 10000)

    this.cable = ActionCable.createConsumer(
      `${process.env.SOCKET_BASE_URL}?token=${this.$store.state.auth.token}`
    )
    this.message_subscription = this.cable.subscriptions.create(
      {
        channel: 'MessagesChannel',
      },
      {
        connected: () => {
          console.log('connected to MessagesChannel')
        },
        received: (data) => {
          console.log('message_subscription')
          const other_id = _.get(vm.conversation, 'other.id', '')
          // console.log(data, data.sender.id, other_id)
          if (
            data.sender.id == other_id ||
            data.sender.id == vm.currentUser.id
          ) {
            const messageIndex = _.findIndex(
              vm.messages,
              (message) => message.id == data.id
            )
            if (messageIndex === -1) {
              vm.messages.push(data)
            } else {
              vm.messages[messageIndex] = data
              // console.log(messageIndex, vm.conversation.messages[messageIndex])
            }
            const arr = vm.messages.slice()
            vm.messages = arr
            vm.$nextTick(() => {
              $('.message-list-section').scrollTop(
                $('.message-list-section').prop('scrollHeight')
              )
            })
          }
        },
        disconnected: () => {
          console.log('disconnected to MessagesChannel :(')
        },
      }
    )
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }

    if (this.message_subscription) {
      this.message_subscription.unsubscribe()
    }
  },

  methods: {
    loadConversations(loadMore) {
      this.$store.dispatch('error/showLoadingActivity', true)
      let params
      if (loadMore) {
        params = {
          page: this.conversation_pagination.current_page + 1,
          per_page: this.conversation_pagination.per_page,
        }
      } else {
        params = {
          page: 1,
          per_page: this.conversation_pagination.per_page,
        }
        this.messages = []
      }
      MessageService.getConversations(params)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.conversations = response.body.conversations
          if (this.conversations.length) {
            this.conversation = this.conversations[0]

            UserService.repostedFeeds(this.conversation.other.id).then(
              (response) => {
                this.repostedFeeds = response.body
                // console.log('repostedFeeds', this.repostedFeeds)
                // this.$forceUpdate()
              }
            )

            this.loadMessages(this.conversation.id, false, true)
          }
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    loadMessages(id, loadMore, scrollMove) {
      if (scrollMove) {
        this.$store.dispatch('error/showLoadingActivity', true)
      }
      const params = {
        conversation_id: id,
      }
      MessageService.getMessages(params)
        .then((response) => {
          if (loadMore) {
            // this.messages = this.conversation.concat(response.body.messages)
            this.messages = _.reverse(response.body.messages).concat(
              this.messages
            )
          } else {
            // this.conversation = response.body
            this.messages = _.reverse(response.body.messages)

            if (scrollMove) {
              this.$nextTick(() => {
                // $(".message-list-section").animate({ scrollTop: $(".message-list-section").prop("scrollHeight")}, 1000);
                $('.message-list-section').scrollTop(
                  $('.message-list-section').prop('scrollHeight')
                )
              })
            }
          }
          // this.$forceUpdate()
          this.$store.dispatch('error/showLoadingActivity', false)
        })
        .catch((e) => {
          // console.log(e)
          // this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          this.$store.dispatch('error/showLoadingActivity', false)
        })
    },

    refreshMessages() {
      if (this.conversation && this.conversation.id !== undefined) {
        this.loadMessages(this.conversation.id, false, false)
      }
    },

    openConversationDeleteConfirmDialog() {
      this.show_conversation_delete_confirm_dialog = true
    },

    closeConversationDeleteConfirmDialog() {
      this.show_conversation_delete_confirm_dialog = false
    },

    deleteEntireMessage() {
      // console.log('deleteEntireMessage', this.conversation)
      MessageService.deleteConversation({
        conversation_id: this.conversation.id,
      })
        .then((response) => {
          this.closeConversationDeleteConfirmDialog()
          // _.remove(this.conversations, (c) => (c.id == conversation.id))
          this.loadConversations()
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    openBlockUserConfirmDialog() {
      this.show_block_user_confirm_dialog = true
    },

    closeBlockUserConfirmDialog() {
      this.show_block_user_confirm_dialog = false
    },

    blockUser() {
      const user = this.conversation.other
      UserService.blockUser(user.id)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'You blocked ' +
              user.display_name +
              ', go to settings page to unblock',
          ])
          this.loadConversations()
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
      this.closeBlockUserConfirmDialog()
    },

    showAllMessages() {},

    showRepostRequests() {},

    addEmoji(emoji, event) {
      // console.log('addEmoji')
      this.showEmojiPicker = false
      this.message.body += emoji.native
      // this.$refs.message.focus()
    },

    showEmojiDialog() {
      // console.log('showEmojiDialog')
      this.showEmojiPicker = !this.showEmojiPicker
      // this.$refs.message.focus()
    },

    hideEmojiDialog() {
      // console.log('hideEmojiDialog')
      this.showEmojiPicker = false
    },

    blurMessage() {
      const vm = this
      if (vm.showEmojiPicker) {
        setTimeout(function () {
          // console.log('hide')
          vm.showEmojiPicker = false
        }, 200)
      }
    },

    InBanned(album) {
      return this.InHiddenGenres(album) || this.InReposted(album)
    },

    // true : in hidden genres
    InHiddenGenres(album) {
      if (this.conversation.other) {
        const genreId = _.get(album.genres, '[0].id', '')
        const genre = _.find(this.conversation.other.hidden_genres, (genre) => {
          return genre.id === genreId
        })
        // return !(genre === undefined || genre === null)
        return !!genre
      } else {
        return false
      }
    },

    InReposted(item) {
      const feed = _.find(this.repostedFeeds, (f) => {
        return (
          f.assoc_type === this.itemType[this.tab] && f.assoc_id === item.id
        )
      })
      return !!feed
    },

    checkMessage() {
      if (this.item) {
        this.openRepostPaymentModal()
      } else {
        this.sendMessage()
      }
    },

    sendMessage(token) {
      this.closeRepostPaymentModal()
      // this.hidePaymentDialog()
      // const message = this.message.body.replace(' ', '')
      // if (message.length > 0) {
      let params = {
        body: this.message.body,
      }
      this.message.body = ''
      params['receiver_id'] = this.conversation.other.id
      if (this.item) {
        if (this.tab === 'album') {
          params['attachable_type'] = 'Album'
          params['attachable_id'] = this.item.id
        } else {
          params['attachable_type'] = 'ShopProduct'
          params['attachable_id'] = this.item.id
        }
        this.item = null
      }
      if (token) {
        params['payment_token'] = token.id
      }
      MessageService.addMessage(params)
        .then((response) => {
          // this.loadMessages(this.conversation.id, false, true)
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    selectedConversation(conv) {
      if (this.conversation.id === conv.id) {
        return
      }

      this.item = null
      this.conversation = conv
      this.conversation.last_message.is_read = true
      this.loadMessages(this.conversation.id, false, true)
    },

    setVisitedTime() {
      this.show_stopPopup = false
      if (this.$refs.message) this.$refs.message.focus()
      const params = {
        user: {
          message_page_visited: 1,
        },
      }
      UserService.updateUserInfo(this.currentUser.id, params)
        .then((response) => {
          AuthService.setUser(response.body)
          this.$store.dispatch('auth/setUser', response.body)
        })
        .catch((e) => {
          console.log(e)
        })
    },

    loadAlbums() {
      const params = {
        statuses: 'published, collaborated',
        user_statuses: 'accepted',
      }
      AlbumService.getAlbums(params)
        .then((response) => {
          this.albums = response.body
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    loadProducts() {
      const params = {
        statuses: 'published, collaborated',
        stock_statuses: 'active',
        user_statuses: 'accepted',
      }
      ProductService.getProducts(params)
        .then((response) => {
          this.products = response.body
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    onTab(tab) {
      this.tab = tab
      this.item = null
    },

    openRepostPaymentModal() {
      this.show_repost_payment_modal = true
    },

    closeRepostPaymentModal() {
      this.show_repost_payment_modal = false
    },

    selectItem(item) {
      // console.log(this.item === item, this.item, item)
      if (this.item === item) {
        this.item = null
        if (this.message.body === DefaultRepostMessage) {
          this.message.body = ''
        }
      } else {
        this.item = item
        if (this.message.body === '') {
          this.message.body = DefaultRepostMessage
        }
      }
    },
  },

  mounted() {},
}
