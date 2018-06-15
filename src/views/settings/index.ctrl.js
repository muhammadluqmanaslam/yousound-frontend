import _ from 'lodash'
import AddressService from '@/services/address'
import AuthService from '@/services/auth'
import UserService from '@/services/user'

import trackCard from '@/components/trackcard'
import profileItem from '@/components/profileitem'

import addressTab from './components/address_tab'
import genreTab from './components/genre_tab'
import priceTab from './components/price_tab'
import verifyTab from './components/verify_tab'

// import { MyEvents } from '@/helper'

export default {
  components: {
    trackCard,
    profileItem,
    addressTab,
    genreTab,
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
        { id: 'genre-filter', title: 'Genre Filter' },
        { id: 'blocked', title: 'Blocked' },
        { id: 'seller-policies', title: 'Seller Policies' },
        { id: 'verify-status', title: 'Verification Status' }
      ],
      tab: 'info',
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
      isPageReady: false
    }
  },

  computed: {
    stripeLink () {
      return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.STRIPE_CONNECT_CLIENT_ID}&scope=read_write&state=${this.$store.state.auth.secret_code}`
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
    if (!this.$store.state.auth.user) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    this.getUserInfo()
    const tab = this.$route.hash.substr(1) || 'info'
    this.$store.dispatch('navigator/goNextState', { page: 'settings', tab: tab })
    this.onTab(tab)
  },

  methods: {
    availableTab (tab) {
      return !(
        (tab.id == 'verify-status' && (this.$store.state.auth.user.user_type != 'listener' || ['artist', 'brand', 'label'].indexOf(this.$store.state.auth.user.request_role) > -1))
        // || (tab.id == 'co-sign' && this.$store.state.auth.user.user_type == 'listener')
      )
    },

    onTab (tab) {
      this.tab = tab
      switch (this.tab) {
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
      const userId = this.$store.state.auth.user.id
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.getUserInfo(userId).then(response => {
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
      // const _user = _.cloneDeep(this.$store.state.auth.user)
      UserService.deleteUser(this.user.id).then(response => {
        AuthService.logout()
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
      const userId = this.$store.state.auth.user.id;
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
        if (e.status === 401) {
        } else {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        }
      })
    },

    viewStripeAccount () {
    },

    disconnetAccount () {
      UserService.disconnectStripe(this.$store.state.auth.user.id).then(response => {
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
        if (e.status === 401) {
        } else {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        }
      })
    },

    updateUser (params) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const userId = this.$store.state.auth.user.id
      UserService.updateUserInfo(userId, params).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', ['Saved'])
        AuthService.setUser(response.body)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (e.status === 401) {
        } else {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        }
      })
    },

    resetProfile() {
      this.profile.image = this.$store.state.auth.user.avatar.url
      this.profile.username = this.$store.state.auth.user.username
      this.profile.display_name = this.$store.state.auth.user.display_name
      this.profile.email = this.$store.state.auth.user.email
      this.profile.contact_url = this.$store.state.auth.user.contact_url
      this.profile.enable_alert = this.$store.state.auth.user.enable_alert
    },

    saveReturnPolicy () {
      const params = {
        user: {
          return_policy: this.user.return_policy
        }
      }
      this.updateUser(params)
    },

    saveShippingPolicy () {
      const params = {
        user: {
          shipping_policy: this.user.shipping_policy
        }
      }
      this.updateUser(params)
    },

    saveSizeChart () {
      const params = {
        user: {
          size_chart: this.user.size_chart
        }
      }
      this.updateUser(params)
    }
  },

  mounted () {
    const vm = this;
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
    });
  }
}
