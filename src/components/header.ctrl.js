import AuthService from '@/services/auth'
import TwitterService from '@/services/twitter.js'
import { MyEvents } from '@/helper'

export default {
  data () {
    return {
      keyword: '',
      show_twitter_confirm_dialog: false
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
  },

  beforeDestroy () {
    if (this.notification_subscription) {
      this.notification_subscription.unsubscribe()
    }
  },

  methods: {
    openTwitterConfirmDialog (user_type) {
      this.show_twitter_confirm_dialog = true
      // this.user_type = user_type
    },

    closeTwitterConfirmDialog () {
      this.show_twitter_confirm_dialog = false
    },

    goTwitter () {
      TwitterService.getRequestToken({ oauth_callback: `${window.location.origin}/_oauth/twitter_callback?user_type=${this.currentUser.user_type}&code=${this.$store.state.auth.secret_code}` }).then(response => {
        Storage.set('twitter_info', JSON.stringify(response.body))
        location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${response.body.oauth_token}`
      })
    },

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
