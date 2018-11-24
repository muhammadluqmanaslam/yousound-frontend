import AuthService from '@/services/auth'
import { MyEvents } from '@/helper'

export default {
  data () {
    return {
      keyword: '',
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
