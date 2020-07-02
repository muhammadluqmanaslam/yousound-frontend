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
import Message from '../messages/components/message'

const ActionCable = require('actioncable')

export default {
  components: {
    profileItem,
    activityAlbumCard,
    activityProductCard,
    Message
  },

  data() {
    return {
      user: null,
      item: null,
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
        total_pages: 0
      },
      messages:[],
      message: {
        body: ''
      },
      message_pagination: {
        count: 0,
        current_page: 0,
        per_page: 50,
        total_count: 0,
        total_pages: 0
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
      return _.get(this.conversation, 'other.repost_price', 0)
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
            const messageIndex = _.findIndex(vm.messages, (message) => (message.id == data.id))
            if (messageIndex === -1) {
              vm.messages.push(data)
            } else {
              vm.messages[messageIndex] = data
              // console.log(messageIndex, vm.messages[messageIndex])
            }
            const arr = vm.messages.slice()
            vm.messages = arr
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
    loadConversations(loadMore) {
      this.$store.dispatch('error/showLoadingActivity', true)
      let params
      if (loadMore) {
        params = {
          user_id: this.user.slug,
          page: this.conversation_pagination.current_page + 1,
          per_page: this.conversation_pagination.per_page
        }
      } else {
        params = {
          user_id: this.user.slug,
          page: 1,
          per_page: this.conversation_pagination.per_page
        }
        this.messages = []
      }
      MessageService.getConversations(params).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.conversations = response.body.conversations
        if (this.conversations.length) {
          this.conversation = this.conversations[0]

          this.loadMessages(this.conversation.id, false, true)
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
          // this.messages = this.conversation.concat(response.body.messages)
          this.messages = _.reverse(response.body.messages).concat(this.messages)
        } else {
          this.messages = _.reverse(response.body.messages)
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

    selectedConversation(conv) {
      if (this.conversation.id === conv.id) {
        return
      }

      this.item = null
      this.conversation = conv
      this.conversation.last_message.is_read = true
      this.loadMessages(this.conversation.id, false, true)
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
