import _ from 'lodash'
import { Utils } from '@/helper'
import MessageService from '@/services/message'
import AuthService from '@/services/auth'
import UserService from '@/services/user'
import AlbumService from '@/services/album'
import ProductService from '@/services/product'

import profileItem from '@/components/profileitem'
import activityAlbumCard from '@/components/activityalbumcard'
import activityProductCard from '@/components/activityproductcard'

const ActionCable = require('actioncable')

export default {
  components: {
    profileItem,
    activityAlbumCard,
    activityProductCard
  },

  data() {
    return {
      user: null,
      item: null,
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
      cable: null,
      message_subscription: null,
      albums: [],
      products: []
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

    this.$store.dispatch('navigator/goNextState', { page: 'direct_messages', tab: '' })
    UserService.getUserInfo(this.$route.params.user).then(response => {
      this.user = response.body
      this.loadConversations()
    })

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
    if (this.message_subscription) {
      this.message_subscription.unsubscribe()
    }
  },

  methods: {
    loadConversations() {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        user_id: this.user.slug
      }
      MessageService.getConversations(params).then(response => {
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
        conversation_id: id,
        user_id: this.user.slug
      }
      MessageService.getMessages(params).then(response => {
        if (loadMore) {
          // this.conversation.messages = this.conversation.messages.concat(response.body.messages)
          this.conversation.messages = _.reverse(response.body.messages).concat(this.conversation.messages.concat)
        } else {
          this.conversation = response.body
          _.reverse(this.conversation.messages)
          if (scrollMove) {
            this.$nextTick(() => {
              // $(".message-list-section").animate({ scrollTop: $(".message-list-section").prop("scrollHeight")}, 1000);
              $(".message-list-section").scrollTop($(".message-list-section").prop("scrollHeight"))
            })
          }
        }
        // this.$forceUpdate()
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
      })
    },

    refreshMessages () {
      if(this.conversation && this.conversation.id !== undefined) {
        this.loadMessages(this.conversation.id, false, false)
      }
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

    selectItem (item) {
      if (this.item === item) {
        this.item = null
      } else {
        this.item = item
      }
    }
  },

  mounted() {
  }
}
