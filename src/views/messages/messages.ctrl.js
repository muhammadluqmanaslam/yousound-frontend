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
import paymentModal from '@/components/paymentmodal'
import activityAlbumCard from '@/components/activityalbumcard'
import activityProductCard from '@/components/activityproductcard'

export default {
  components: {
    profileItem,
    Picker,
    activityAlbumCard,
    activityProductCard,
    paymentModal
  },

  mixins: [onClickOutside],

  data () {
    return {
      tab: 'album',
      item_index: -1,
      show_stopPopup: false,
      show_conversation_delete_confirm_dialog: false,
      showEmojiPicker: false,
      showPaymentModal: false,
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
      isPageReady: false,
      timer: null,
      albums: [],
      products: []
    }
  },

  computed: {
    other_name () {
      return _.get(this.conversation, 'other.display_name', '')
    },

    toLocalTimeString () {
      return Utils.toLocalTimeString
    },

    current_repost_price () {
      if (this.conversations[this.selected_index].other.length) {
        return this.conversations[this.selected_index].other[0].repost_price
      } else {
        return this.conversations[this.selected_index].other.repost_price
      }
    }
  },

  created () {
    this.$store.dispatch('navigator/goNextState', {page: 'messages', tab: ''})
    if (this.$store.state.auth.user) {
      if (!this.$store.state.auth.user.message_first_visited_time) {
        this.show_stopPopup = true
      }
      if (['brand'].indexOf(this.$store.state.auth.user.user_type) != -1) {
        this.tab = 'merch'
      }
      this.loadConversations()
      this.loadAlbums()
      this.loadProducts()
    } else {
      this.$root.$emit('showLoginModal')      
    }
    const vm = this
    this.timer = setInterval(function(){ vm.refreshMessages() }, 10000)
  },

  methods: {
    loadConversations() {
      this.$store.dispatch('error/showLoadingActivity', true)
      MessageService.getConversations().then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.conversations = response.body
        if (this.conversations.length) {
          this.selected_index = 0
          this.loadMessages(this.conversations[this.selected_index].id, false)
        }
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (e.status === 401) {
          this.$root.$emit('showLoginModal')
        } else {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        }
      })
    },

    loadMessages(id, loadMore) {
      MessageService.getMessages(id).then(response => {
        if (loadMore) {
          this.conversation.messages = this.conversation.messages.concat(response.body.messages)
        } else {
          this.conversation = response.body
        }
        // this.$forceUpdate()
      }).catch(e => {
        console.log(e)
        // this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    refreshMessages () {
      if(this.conversation && this.conversation.id !== undefined) {
        this.loadMessages(this.conversation.id, false)
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

    blockUser (user) {
      UserService.blockUser(user.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You blocked ' + user.display_name + ', go to settings page to unblock'])
        this.loadConversations()
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
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

    checkMessage () {
      if (this.item_index > -1) {
        this.showPaymentDialog()
      } else {
        this.sendMessage()
      }
    },

    sendMessage (token) {
      this.hidePaymentDialog()
      // const message = this.message.body.replace(' ', '')
      // if(message.length > 0) {
      const params = new FormData()
      params.append('body', this.message.body)
      this.message.body = ''
      params.append('receiver_id', this.conversation.other.id)
      if (this.item_index > -1) {
        if (this.tab === 'album') {
          params.append('attachable_type', 'Album')
          params.append('attachable_id', this.albums[this.item_index].id)
        } else {
          params.append('attachable_type', 'ShopProduct')
          params.append('attachable_id', this.products[this.item_index].id)
        }
      }
      if (token) {
        params.append('payment_token', token.id)
      }
      MessageService.addMessage(params).then(response => {
        this.loadMessages(this.conversation.id, false)
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    selectedConversation(index) {
      this.selected_index = index
      this.conversations[this.selected_index].last_message.is_read = true
      this.loadMessages(this.conversations[this.selected_index].id, false)
    },

    setVisitedTime () {
      this.show_stopPopup=false
      this.$refs.message.focus()
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
      // this.item_index = -1
      // if (tab === 'album') {
      //   this.loadAlbums()
      // } else {
      //   this.loadProducts()
      // }
    },

    hidePaymentDialog () {
      this.showPaymentModal = false
    },

    showPaymentDialog () {
      this.showPaymentModal = true
    },

    selectItemIndex (index) {
      if (this.item_index !== index) {
        this.item_index = index
      } else {
        this.item_index = -1
      }
    },

    acceptRepostRequest (message) {
      MessageService.acceptRepost(message.id).then( response => {
        this.refreshMessages()
        this.$store.dispatch('error/showSuccessToast', ["Accepted a repost request!"])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    denyRepostRequest (message) {
      MessageService.denyRepost(message.id).then( response => {
        this.refreshMessages()
        this.$store.dispatch('error/showErrorToast', ["Denied a repost request!"])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    acceptCollaboration (message) {
      if (message.attachment.attachable_type == 'Album') {
        AlbumService.acceptCollaboration(message.attachment.assoc.id).then(response => {
          this.refreshMessages()
        })
      } else if (message.attachment.attachable_type == 'ShopProduct') {
        ProductService.acceptCollaboration(message.attachment.assoc.id).then(response => {
          this.refreshMessages()
        })
      }
    },

    denyCollaboration (message) {
      if (message.attachment.attachable_type == 'Album') {
        AlbumService.denyCollaboration(message.attachment.assoc.id).then(response => {
          this.refreshMessages()
        })
      } else if (message.attachment.attachable_type == 'ShopProduct') {
        ProductService.denyCollaboration(message.attachment.assoc.id).then(response => {
          this.refreshMessages()
        })
      }
    },

    acceptLabelUser (message) {
      UserService.acceptLabelRequest(message.sender.id).then(response => {
        this.refreshMessages()
      })
    },

    denyLabelUser (message) {
      UserService.denyLabelRequest(message.sender.id).then(response => {
        this.refreshMessages()
      })
    },

    acceptLabelAlbum (message) {
      const params = {
        label_id: message.sender.id
      }
      AlbumService.acceptLabelRequest(message.attachment.assoc.id, params).then(response => {
        this.refreshMessages()
      })
    },

    denyLabelAlbum (message) {
      const params = {
        label_id: message.sender.id
      }
      AlbumService.denyLabelRequest(message.attachment.assoc.id, params).then(response => {
        this.refreshMessages()
      })
    }
  },

  mounted () {
    // this.loadConversations()
    // this.loadAlbums()
  },

  beforeDestroy () {
    clearInterval(this.timer)
  }
}
