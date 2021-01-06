import AuthService from '@/services/auth'
import TwitterService from '@/services/twitter'
import InvitationService from '@/services/invitation'
import { MyEvents, Storage } from '@/helper'

export default {
  data() {
    return {
      keyword: '',
      show_twitter_confirm_dialog: false,
      show_invite_dialog: false,
      link_copied: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    currentPage() {
      return this.$store.state.navigator.current.page
    },
  },

  watch: {
    $route(toPath, fromPath) {
      // console.log('header', toPath.path, fromPath.path)
      const keyword = this.$route.query.q
      if (keyword === undefined) {
        this.keyword = ''
      }
    },
  },

  created() {},

  beforeDestroy() {
    if (this.notification_subscription) {
      this.notification_subscription.unsubscribe()
    }
  },

  methods: {
    openInviteDialog() {
      this.link_copied = false
      this.show_invite_dialog = true
    },

    closeInviteDialog() {
      this.show_invite_dialog = false
    },

    createInvitation() {
      InvitationService.createInvitation()
        .then((res) => {
          // console.log('createInvitation', res.body)
          this.$copyText(res.body.url)
          this.link_copied = true
        })
        .catch((err) => console.log(err))
    },

    goTwitter(request_type) {
      TwitterService.getRequestToken({
        oauth_callback: `${window.location.origin}/_oauth/twitter_callback?user_type=${request_type}&code=${this.$store.state.auth.secret_code}`,
      }).then((response) => {
        Storage.set('twitter_info', JSON.stringify(response.body))
        location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${response.body.oauth_token}`
      })
    },

    choosePage(path) {
      this.$router.push({ path: '/' + path })
    },

    goToSearch() {
      const keyword = this.keyword
      this.$router.push({ path: '/search', query: { q: keyword } })
    },

    goSupport() {
      window.open('//support.yousound.com', '_blank')
    },

    signOut() {
      // const _user = _.cloneDeep(this.$store.state.auth.user)
      AuthService.signout()
      this.$router.push({ path: '/login' })
      this.$root.$emit(MyEvents.AUTH_SIGNOUT)
    },
  },
}
