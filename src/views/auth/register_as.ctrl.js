import AuthService from '@/services/auth.js'
import TwitterService from '@/services/twitter.js'
import { Storage } from '@/helper'

export default {

  components: {
  },

  data () {
    return {
      user_type: 'artist',
      show_twitter_confirm_dialog: false
    }
  },

  computed: {
  },

  created () {
    this.$store.dispatch('navigator/goNextState', {page: 'register', tab: ''})
    Storage.remove('twitter_info')
    // window.fbAsyncInit = function() {
    //   FB.init({
    //     appId: process.env.FACEBOOK_APP_ID,
    //     autoLogAppEvents: true,
    //     xfbml: true,
    //     version: 'v2.10'
    //   });
    //   FB.AppEvents.logPageView();
    // }
  },

  methods: {
    openTwitterConfirmDialog (user_type) {
      this.show_twitter_confirm_dialog = true
      this.user_type = user_type
    },

    closeTwitterConfirmDialog () {
      this.show_twitter_confirm_dialog = false
    },

    submit () {
      // this.closeTwitterConfirmDialog()
      TwitterService.getRequestToken({ oauth_callback: `${window.location.origin}/_oauth/twitter_callback?user_type=${this.user_type}&code=${this.$store.state.auth.secret_code}` }).then(response => {
        Storage.set('twitter_info', JSON.stringify(response.body))
        location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${response.body.oauth_token}`
      })
      // this.$router.push({ path: '/register/' + this.user_type })
      // const vm = this;
      // this.$store.dispatch('auth/setRegisterRole', this.user_type)
      // FB.login(function(response) {
      //   if (response.authResponse) {
      //     const access_token = response.authResponse.accessToken
      //     FB.api('/me', {fields: 'name,email,picture,first_name,last_name'}, function(response) {
      //       vm.$store.dispatch('error/showLoadingActivity', true)
      //       var params = {
      //         provider: 'facebook',
      //         email: response.email,
      //         user_id: response.id,
      //         user_name: '',
      //         token: access_token,
      //         token_secret: ''
      //       }
      //       AuthService.signinWithSocial(params).then(response => {
      //         // JSON responses are automatically parsed.
      //         vm.$store.dispatch('error/showLoadingActivity', false)
      //         if(response.body.status === 'pending') {
      //           vm.$router.push({ path: '/_oauth/verification' })
      //         } else if(response.body.status === 'verified') {
      //           vm.$store.dispatch('auth/setPendingUser', response.body)
      //           vm.$router.push({ path: `/register/${this.user_type}` })
      //         } else if(response.body.status === 'inactive') {
      //           vm.$router.push({ path: `/confirm/being?email=${response.email}` })
      //         } else if(response.body.status === 'active') {
      //           vm.$router.push({ path: '/login' })
      //         } else {
      //         }
      //       }).catch(e => {
      //         console.log(e.body.errors[0])
      //         vm.$store.dispatch('error/showLoadingActivity', false)
      //         vm.$store.dispatch('error/showErrorToast', e.body.errors)
      //       })
      //    })
      //   } else {
      //    console.log('User cancelled login or did not fully authorize.');
      //   }
      // }, {scope: 'public_profile,email'})
    }
  },

  mounted () {
    $('#content-view').css('padding-top', '0');
  }
}