// import _ from 'lodash'
import AuthService from '@/services/auth'
import { MyEvents } from '@/helper'

const ActionCable = require('actioncable')

export default {
  data () {
    return {
      keyword: '',
      cable: null,
      notification_subscription: null
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },

    currentPage () {
      return this.$store.state.navigator.current.page
    }
  },

  watch: {
    '$route' (toPath, fromPath) {
      // console.log('header', toPath.path, fromPath.path)
      const keyword = this.$route.query.q
      if (keyword === undefined) {
        this.keyword = ''
      }
    }
  },

  created () {
    const vm = this
    this.cable = ActionCable.createConsumer(`${process.env.SOCKET_BASE_URL}?token=${this.$store.state.auth.token}`)
    this.notification_subscription = this.cable.subscriptions.create(
      {
        channel: 'NotificationsChannel'
      },
      {
        connected: () => {
          console.log('connected to NotificationsChannel')
        },
        received: (data) => {
          console.log('notification_subscription')
          console.log(data)
          vm.$store.dispatch('activity/addBadge', data)
        },
        disconnected: () => {
          console.log('disconnected to NotificationsChannel :(')
        }
      }
    )
  },

  beforeDestroy () {
    if (this.notification_subscription) {
      this.notification_subscription.unsubscribe()
    }
  },

  methods: {
    choosePage (path) {
      this.$router.push({ path: '/' + path })
    },

    goToSearch () {
      const keyword = this.keyword
      this.$router.push({ path: '/search', query: { q: keyword } })
    },

    signOut () {
      // const _user = _.cloneDeep(this.$store.state.auth.user)
      AuthService.signout()
      this.$router.push({ path: '/login' })
      this.$root.$emit(MyEvents.AUTH_SIGNOUT)
    }
  }
}
