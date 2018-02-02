import { Storage } from '@/helper'
import GenreService from '@/services/genre'
import TwitterService from '@/services/twitter'

export default {
  components: {
  },

  data () {
    return {
      query_string: [],
      twitter_info: null,
      user: {},
      main_genres: [],
      isPageReady: false
    }
  },

  computed: {
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'register', tab: '' })
    this.twitter_info = JSON.parse(Storage.get('twitter_info'))
    if (this.twitter_info && this.twitter_info.oauth_token === this.$route.query['oauth_token']) {
      const params = {
        oauth_token: this.$route.query['oauth_token'],
        oauth_token_secret: this.twitter_info.oauth_token_secret,
        oauth_verifier: this.$route.query['oauth_verifier']
      }
      TwitterService.getAccessToken(params).then(response => {
        this.twitter_info = response.body
        Storage.remove('twitter_info')
        // Storage.set('twitter_info', JSON.stringify(this.twitter_info))

        this.user = {
          display_name: this.twitter_info.screen_name,
          social_user_id: this.twitter_info.user_id,
          request_role: this.$route.query['user_type'] || 'artist',
          genre_id: null,
          release_count: null,
          soundcloud_url: null,
          basecamp_url: null,
          website_url: null
        }

        this.isPageReady = false
        this.$store.dispatch('error/showLoadingActivity', true)
        Promise.all([
          GenreService.getGenres2()
        ]).then(values => {
          this.main_genres = values[0].body

          this.isPageReady = true
          this.$store.dispatch('error/showLoadingActivity', false)
        }).catch(reason => {
          console.log('reason', reason)
          this.$store.dispatch('error/showLoadingActivity', false)
        })
      })
    } else {
      Storage.remove('twitter_info')
      this.$router.push('/register')
    }
  },

  methods: {
    submit () {
      const vm = this
      this.$validator.validateAll().then(response => {
        if (response === true) {
          vm.$store.dispatch('auth/setPendingUser', vm.user)
          this.$router.push(`/register/${this.user.request_role}`)
        } else {
          vm.$store.dispatch('error/showErrorToast', [vm.errors.items[0].msg])
        }
      }).catch(e => {
        console.log('error', e)
      })
    }
  },

  mounted () {
    $('#content-view').css('padding-top', '0');
  }
}