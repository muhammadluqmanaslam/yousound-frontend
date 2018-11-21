import _ from 'lodash'
import { mixin as onClickOutside } from 'vue-on-click-outside'
import { Utils } from '@/helper'
import MessageService from '@/services/message'
import AuthService from '@/services/auth'
import UserService from '@/services/user'
import AlbumService from '@/services/album'
import ProductService from '@/services/product'
import profileItem from '@/components/profileitem'
import { Picker } from 'emoji-mart-vue'
import repostPaymentModal from '@/components/repost_payment_modal'
import activityAlbumCard from '@/components/activityalbumcard'
import activityProductCard from '@/components/activityproductcard'

const ActionCable = require('actioncable')

export default {
  components: {
    profileItem,
    Picker,
    activityAlbumCard,
    activityProductCard,
    repostPaymentModal
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
      selected_index: -1,
      conversations: [],
      conversation: {},
      messages:[],
      message: {
        body: ''
      },
      timer: null,
      cable: null,
      message_subscription: null,
      albums: [],
      products: [],
      itemType: {
        'album': 'Album',
        'merch': 'ShopProduct'
      },
      repostedFeeds: [],
      isPageReady: false
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
      if (this.conversations[this.selected_index].other.length) {
        return this.conversations[this.selected_index].other[0].repost_price
      } else {
        return this.conversations[this.selected_index].other.repost_price
      }
    }
  },

  created() {
    if (!this.currentUser) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    this.$store.dispatch('navigator/goNextState', { page: 'messages', tab: '' })
    if (!this.$store.state.auth.user.message_first_visited_time) {
      this.show_stopPopup = true
    }
    if (['brand'].indexOf(this.$store.state.auth.user.user_type) != -1) {
      this.tab = 'merch'
    }
    this.loadConversations()
    this.loadAlbums()
    this.loadProducts()

    const vm = this
    // this.timer = setInterval(function(){ vm.refreshMessages() }, 10000)

    this.cable = ActionCable.createConsumer(`${process.env.SOCKET_BASE_URL}?token=${this.$store.state.auth.token}`)
    this.message_subscription = this.cable.subscriptions.create(
      {
        channel: 'MessagesChannel'
      },
      {
        connected: () => {
          console.log('connected to MessagesChannel')
        },
        received: (data) => {
          console.log('message_subscription')
          const other_id = _.get(vm.conversation, 'other.id', '')
          // console.log(data, data.sender.id, other_id)
          if (data.sender.id == other_id || data.sender.id == vm.currentUser.id) {
            const messageIndex = _.findIndex(vm.conversation.messages, (message) => (message.id == data.id))
            if (messageIndex === -1) {
              vm.conversation.messages.push(data)
            } else {
              vm.conversation.messages[messageIndex] = data
              // console.log(messageIndex, vm.conversation.messages[messageIndex])
            }
            const arr = vm.conversation.messages.slice()
            vm.conversation.messages = arr
            vm.$nextTick(() => {
              $(".message-list-section").scrollTop($(".message-list-section").prop("scrollHeight"))
            })
          }
        },
        disconnected: () => {
          console.log('disconnected to MessagesChannel :(')
        }
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
    loadConversations() {
      this.$store.dispatch('error/showLoadingActivity', true)
      MessageService.getConversations().then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.conversations = response.body
        if (this.conversations.length) {
          this.selected_index = 0
          this.loadMessages(this.conversations[this.selected_index].id, false, true)
        }
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    loadMessages(id, loadMore, scrollMove) {
      if (scrollMove) {
        this.$store.dispatch('error/showLoadingActivity', true)
      }
      const params = {
        conversation_id: id
      }
      MessageService.getMessages(params).then(response => {
        if (loadMore) {
          // this.conversation.messages = this.conversation.messages.concat(response.body.messages)
          this.conversation.messages = _.reverse(response.body.messages).concat(this.conversation.messages.concat)
        } else {
          this.conversation = response.body
          _.reverse(this.conversation.messages)

          UserService.repostedFeeds(this.conversation.other.id).then(response => {
            this.repostedFeeds = response.body
            // console.log('repostedFeeds', this.repostedFeeds)
            // this.$forceUpdate()

            if (scrollMove) {
              this.$nextTick(() => {
                // $(".message-list-section").animate({ scrollTop: $(".message-list-section").prop("scrollHeight")}, 1000);
                $(".message-list-section").scrollTop($(".message-list-section").prop("scrollHeight"))
              })
            }
          })
        }
        // this.$forceUpdate()
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(e => {
        // console.log(e)
        // this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        this.$store.dispatch('error/showLoadingActivity', false)
      })
    },

    refreshMessages () {
      if(this.conversation && this.conversation.id !== undefined) {
        this.loadMessages(this.conversation.id, false, false)
      }
    },

    openConversationDeleteConfirmDialog () {
      this.show_conversation_delete_confirm_dialog = true
    },

    closeConversationDeleteConfirmDialog () {
      this.show_conversation_delete_confirm_dialog = false
    },

    deleteEntireMessage () {
      // console.log('deleteEntireMessage', this.conversation)
      MessageService.deleteConversation({ conversation_id: this.conversation.id }).then(response => {
        this.closeConversationDeleteConfirmDialog()
        // _.remove(this.conversations, (c) => (c.id == conversation.id))
        this.loadConversations()
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    openBlockUserConfirmDialog () {
      this.show_block_user_confirm_dialog = true
    },

    closeBlockUserConfirmDialog () {
      this.show_block_user_confirm_dialog = false
    },

    blockUser () {
      const user = this.conversations[this.selected_index].other
      UserService.blockUser(user.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You blocked ' + user.display_name + ', go to settings page to unblock'])
        this.loadConversations()
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
      this.closeBlockUserConfirmDialog()
    },

    showAllMesssages () {
    },

    showRepostRequests () {
    },

    addEmoji (emoji, event) {
      // console.log('addEmoji')
      this.showEmojiPicker = false
      this.message.body += emoji.native
      // this.$refs.message.focus()
    },

    showEmojiDialog () {
      // console.log('showEmojiDialog')
      this.showEmojiPicker = !this.showEmojiPicker
      // this.$refs.message.focus()
    },

    hideEmojiDialog () {
      // console.log('hideEmojiDialog')
      this.showEmojiPicker = false
    },

    blurMessage () {
      const vm = this
      if (vm.showEmojiPicker) {
        setTimeout(function() {
          // console.log('hide')
          vm.showEmojiPicker = false
        }, 200);
      }
    },

    InBanned (album) {
      return this.InHiddenGenres(album) || this.InReposted(album)
    },

    // true : in hidden genres
    InHiddenGenres (album) {
      if (this.conversation.other) {
        const genreId = _.get(album.genres, '[0].id', '')
        const genre = _.find(this.conversation.other.hidden_genres, (genre) => { return genre.id === genreId })
        // return !(genre === undefined || genre === null)
        return !!genre
      } else {
        return false
      }
    },

    InReposted (item) {
      const feed = _.find(this.repostedFeeds, (f) => {
        return f.assoc_type === this.itemType[this.tab] && f.assoc_id === item.id
      })
      return !!feed
    },

    checkMessage () {
      if (this.item) {
        this.openRepostPaymentModal()
      } else {
        this.sendMessage()
      }
    },

    sendMessage (token) {
      this.closeRepostPaymentModal()
      // this.hidePaymentDialog()
      // const message = this.message.body.replace(' ', '')
      // if (message.length > 0) {
      let params = {
        body: this.message.body
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
      }
      if (token) {
        params['payment_token'] = token.id
      }
      MessageService.addMessage(params).then(response => {
        // this.loadMessages(this.conversation.id, false, true)
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    selectedConversation(index) {
      if (this.selected_index === index) {
        return
      }

      this.item = null
      this.selected_index = index
      this.conversations[this.selected_index].last_message.is_read = true
      this.loadMessages(this.conversations[this.selected_index].id, false, true)
    },

    setVisitedTime () {
      this.show_stopPopup = false
      if (this.$refs.message) this.$refs.message.focus()
      const params = new FormData()
      params.append('user[message_visited]', 1)
      UserService.updateUserInfo(this.$store.state.auth.user.id, params).then(response => {
        AuthService.setUser(response.body)
        this.$store.dispatch('auth/setUser', response.body)
      }).catch(e => {
        console.log(e)
      })
    },

    loadAlbums () {
      const params = {
        statuses: 'published, collaborated',
        user_statuses: 'accepted'
      }
      AlbumService.getAlbums(params).then(response => {
        this.albums = response.body
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    loadProducts () {
      const params = {
        statuses: 'published, collaborated',
        stock_statuses: 'active',
        user_statuses: 'accepted'
      }
      ProductService.getProducts(params).then(response => {
        this.products = response.body
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    onTab (tab) {
      this.tab = tab
      this.item = null
    },

    openRepostPaymentModal () {
      this.show_repost_payment_modal = true
    },

    closeRepostPaymentModal () {
      this.show_repost_payment_modal = false
    },

    selectItem (item) {
      // console.log(this.item === item, this.item, item)
      if (this.item === item) {
        this.item = null
      } else {
        this.item = item
      }
    },

    acceptRepostRequest (message) {
      MessageService.acceptRepost(message.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ["Accepted a repost request!"])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    denyRepostRequest (message) {
      MessageService.denyRepost(message.id).then(response => {
        this.$store.dispatch('error/showErrorToast', ["Denied a repost request!"])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    acceptRepostRequestOnFree (message) {
      MessageService.acceptRepostOnFree(message.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ["Accepted a repost request on free!"])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    // viewPendingCollaboration (message) {
    //   if (message.attachment.attachable_type == 'Album') {
    //     this.$store.dispatch('navigator/setCurrentState', {page: 'messages', tab: '', action: 'view_pending_collaboration'})
    //     this.$router.push({ path: '/albums' })
    //   } else if (message.attachment.attachable_type == 'ShopProduct') {
    //     this.$store.dispatch('navigator/setCurrentState', {page: 'messages', tab: '', action: 'view_pending_collaboration'})
    //     this.$router.push({ path: '/sell' })
    //   }
    // },

    // acceptCollaboration (message) {
    //   if (message.attachment.attachable_type == 'Album') {
    //     AlbumService.acceptCollaboration(message.attachment.assoc.id).then(response => {
    //       this.refreshMessages()
    //     })
    //   } else if (message.attachment.attachable_type == 'ShopProduct') {
    //     ProductService.acceptCollaboration(message.attachment.assoc.id).then(response => {
    //       this.refreshMessages()
    //     })
    //   }
    // },

    // denyCollaboration (message) {
    //   if (message.attachment.attachable_type == 'Album') {
    //     AlbumService.denyCollaboration(message.attachment.assoc.id).then(response => {
    //       this.refreshMessages()
    //     })
    //   } else if (message.attachment.attachable_type == 'ShopProduct') {
    //     ProductService.denyCollaboration(message.attachment.assoc.id).then(response => {
    //       this.refreshMessages()
    //     })
    //   }
    // },

    acceptLabelUser (message) {
      UserService.acceptLabelRequest(message.sender.id)
    },

    denyLabelUser (message) {
      UserService.denyLabelRequest(message.sender.id)
    },

    acceptLabelAlbum (message) {
      const params = {
        label_id: message.sender.id
      }
      AlbumService.acceptLabelRequest(message.attachment.assoc.id, params)
    },

    denyLabelAlbum (message) {
      const params = {
        label_id: message.sender.id
      }
      AlbumService.denyLabelRequest(message.attachment.assoc.id, params)
    }
  },

  mounted() {
  }
}
