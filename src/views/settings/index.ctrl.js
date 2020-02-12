import _ from 'lodash'
import AddressService from '@/services/address'
import AuthService from '@/services/auth'
import UserService from '@/services/user'

import trackCard from '@/components/trackcard'
import profileItem from '@/components/profileitem'

import addressTab from './components/address_tab'
import genreTab from './components/genre_tab'
import policyTab from './components/policy_tab'
import priceTab from './components/price_tab'
import verifyTab from './components/verify_tab'

// import { MyEvents } from '@/helper'
// const ActionCable = require('actioncable')

export default {
  components: {
    trackCard,
    profileItem,
    addressTab,
    genreTab,
    policyTab,
    priceTab,
    verifyTab
  },

  data () {
    return {
      dialog: false,
      tabs: [
        { id: 'info', title: 'Profile' },
        { id: 'password', title: 'Password' },
        { id: 'bank-details', title: 'Bank Details' },
        { id: 'repost-price', title: 'Repost Price' },
        { id: 'shipping-address', title: 'Shipping Address' },
        { id: 'blocked', title: 'Blocked' },
        { id: 'seller-policies', title: 'Seller Policies' },
        // { id: 'verify-status', title: 'Verification Status' }
      ],
      active_tab: 'info',
      profile: {
        image: null,
        username: '',
        display_name: '',
        email: '',
        contact_url: '',
        enable_alert: false
      },
      password: {
        current_password: '',
        new_password: '',
        confirmed_password: ''
      },
      stripeDialog: false,
      user: {},
      cable: null,
      notification_subscription: null,
      isPageReady: false
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },

    stripeLink () {
      return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.STRIPE_CONNECT_CLIENT_ID}&scope=read_write&state=${this.$store.state.auth.secret_code}`
    },

    availableTabs () {
      if (['artist', 'brand', 'label'].indexOf(this.currentUser.request_role) > -1) {
        return _.concat(this.tabs, { id: 'verify-status', title: 'Verification Status' })
      } else  {
        return this.tabs
      }
    }
  },

  // watch: {
  //   '$route' (toPath, fromPath) {
  //     console.log('list watch')
  //     console.log(toPath)
  //     console.log(fromPath)
  //   }
  // },

  created () {
    if (!this.currentUser) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    this.getUserInfo()
    const tab = this.$route.hash.substr(1) || 'info'
    this.$store.dispatch('navigator/goNextState', { page: 'settings', tab: tab })
    this.onTab(tab)

    this.$intercom.update({hide_default_launcher: false})
  },

  beforeDestroy () {
    this.$intercom.update({hide_default_launcher: true})
  },

  methods: {
    isActiveTab(tab) {
      return this.active_tab == tab
    },

    availableTab (tab) {
      return tab.id !== 'verify-status' ||
        (this.currentUser.user_type == 'listener' && ['artist', 'brand', 'label'].indexOf(this.currentUser.request_role) > -1)
        // || (tab.id == 'co-sign' && this.currentUser.user_type == 'listener')
    },

    onTab (tab) {
      this.active_tab = tab
      switch (this.active_tab) {
        case 'info':
          this.resetProfile()
          break
        case 'password':
          this.resetPassword()
          break
        // case 'repost-price':
        //   this.resetRepostPrice()
        //   break
        // case 'shipping-address':
        //   this.resetShippingAddress()
        //   break
        // case 'genre-filter':
        //   this.resetGenres()
        //   break
      }
    },

    profileImageChanged (e) {
      this.profile.image = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener('load', (event) => {
        // document.getElementById('profile_image').src = event.target.result
        // document.getElementById('profile_image').style.backgroundImage = event.target.result
        $('#profile_image').css('background-image', 'url(' + event.target.result + ')')
      }, false)
      reader.readAsDataURL(this.profile.image)
    },

    getUserInfo () {
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.getUserInfo(this.currentUser.id).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        AuthService.setUser(response.body)
        this.user = _.cloneDeep(response.body)
        // this.resetProfile()
        // this.resetShippingAddress()
        // this.resetGenres()
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    cancelAccount () {
      this.dialog = false
      // const _user = _.cloneDeep(this.currentUser)
      UserService.deleteUser(this.user.id).then(response => {
        AuthService.signout()
        this.$router.push({ path: '/login' })
        // this.$root.$emit(MyEvents.AUTH_SIGNOUT, _user.stream)
      })
    },

    updateAccount () {
      const params = new FormData()
      if(this.profile.image) {
        params.append('user[avatar]', this.profile.image)
      }
      params.append('user[display_name]', this.profile.display_name)
      params.append('user[email]', this.profile.email)
      params.append('user[contact_url]', this.profile.contact_url)
      params.append('user[enable_alert]', this.profile.enable_alert == true ? 1 : 0)

      this.updateUser(params)
    },

    resetPassword () {
      this.password.current_password = ''
      this.password.new_password = ''
      this.password.confirmed_password = ''
    },

    updatePassword () {
      this.$store.dispatch('error/showLoadingActivity', true)
      const userId = this.currentUser.id;
      const params = new FormData()
      // console.log(this.password)
      params.append('old_password', this.password.current_password)
      params.append('new_password', this.password.new_password)
      params.append('confirmed_password', this.password.confirmed_password)
      UserService.changePassword(userId, params).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', ['Saved'])
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    viewStripeAccount () {
    },

    disconnetAccount () {
      UserService.disconnectStripe(this.currentUser.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['Stripe Disconected!'])
        this.$store.dispatch('auth/setStripeStatus', false)
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    unblockUser (user) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const userId = user.id
      UserService.unblockUser(userId).then(response =>  {
        this.getUserInfo()        
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    updateUser (params) {
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.updateUserInfo(this.currentUser.id, params).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', ['Saved'])
        AuthService.setUser(response.body)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    resetProfile() {
      this.profile.image = this.currentUser.avatar.url
      this.profile.username = this.currentUser.username
      this.profile.display_name = this.currentUser.display_name
      this.profile.email = this.currentUser.email
      this.profile.contact_url = this.currentUser.contact_url
      this.profile.enable_alert = this.currentUser.enable_alert
    }
  },

  mounted () {
    const vm = this
    $.getJSON('../../static/countries.json', function (json) {
      const countries = json.countries
      vm.countries = []
      for(let index in countries) {
        const country = {
          iso: countries[index]['iso_2'],
          name: countries[index]['name']
        }
        vm.countries.push(country)
      }
    })
  }
}
