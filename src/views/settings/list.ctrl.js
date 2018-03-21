import AddressService from '@/services/address'
import AuthService from '@/services/auth'
import UserService from '@/services/user'

import trackCard from '@/components/trackcard'
import profileItem from '@/components/profileitem'

import genreTab from './components/genre_tab'
import verifyTab from './components/verify_tab'

export default {
  components: {
    trackCard,
    profileItem,
    genreTab,
    verifyTab
  },

  data () {
    return {
      dialog: false,
      tabs: [
        {
          id: 'info',
          title: 'Profile'
        },
        {
          id: 'password',
          title: 'Password'
        },
        {
          id: 'bank-details',
          title: 'Bank Details'
        },
        {
          id: 'repost-price',
          title: 'Repost Price'
        },
        {
          id: 'shipping-address',
          title: 'Shipping Address'
        },
        {
          id: 'genre-filter',
          title: 'Genre Filter'
        },
        {
          id: 'blocked',
          title: 'Blocked'
        },
        {
          id: 'seller-policies',
          title: 'Seller Policies'
        },
        {
          id: 'verify-status',
          title: 'Verification Status'
        }
      ],
      tab: 'info',
      repost_prices: [
        {name: '$1', value: 100},
        {name: '$5', value: 500},
        {name: '$10 Upgrade', value: 1000},
        {name: '$20 Upgrade', value: 2000},
        {name: '$50 Upgrade', value: 5000},
        {name: '$100 Upgrade', value: 10000},
        {name: '$250 Upgrade', value: 25000},
        {name: '$500 Upgrade', value: 50000},
        {name: '$1000 Upgrade', value: 100000}
      ],
      countries: [
        'Australia',
        'Canada',
        'China',
        'France',
        'Germeny',
        'Russia',
        'United Kingdom',
        'United States'
      ],
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
      repost_price: 0,
      stripeDialog: false,
      shipping_address: {
        id: '',
        first_name: '',
        last_name: '',
        street_address: '',
        address_line: '',
        city: '',
        state: '',
        postcode: '',
        country: ''
      },
      user: {},
      isPageReady: false
    }
  },

  computed: {
    stripeLink () {
      return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.STRIPE_CONNECT_CLIENT_ID}&scope=read_only`
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
    if (this.$store.state.auth.user) {
      this.getUserInfo()
      const tab = this.$route.hash.substr(1) || 'info'
      this.$store.dispatch('navigator/goNextState', { page: 'settings', tab: tab })
      this.onTab(tab)
    } else {
      this.$root.$emit('showLoginModal')
    }
  },

  methods: {
    onTab (tab) {
      this.tab = tab
      switch (this.tab) {
        case 'info':
          this.resetProfile()
          break
        case 'password':
          this.resetPassword()
          break
        case 'repost-price':
          this.resetRepostPrice()
          break
        case 'shipping-address':
          this.resetShippingAddress()
          break
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

    resetShippingAddress () {
      const address = this.$store.state.auth.user.default_address;
      if(address) {
        this.shipping_address.id = address.id
        this.shipping_address.first_name = address.first_name
        this.shipping_address.last_name = address.last_name
        this.shipping_address.street_address = address.street_1
        this.shipping_address.address_line = address.street_2
        this.shipping_address.city = address.city
        this.shipping_address.state = address.state
        this.shipping_address.postcode = address.postcode
        this.shipping_address.country = address.country
      }
    },

    cancelAccount () {
      this.dialog = false
      UserService.deleteUser(this.user.id).then(response => {
        AuthService.logout()
        this.$router.push({ path: '/login' })
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
          this.$root.$emit('showLoginModal')
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

    setRepostPrice () {
      const params = new FormData()
      params.append('user[repost_price]', this.repost_price)
      this.updateUser(params)
    },

    saveShippingAddress () {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = new FormData()
      params.append('shop_address[first_name]', this.shipping_address.first_name)
      params.append('shop_address[last_name]', this.shipping_address.last_name)
      params.append('shop_address[street_1]', this.shipping_address.street_address)
      params.append('shop_address[street_2]', this.shipping_address.address_line)
      params.append('shop_address[city]', this.shipping_address.city)
      params.append('shop_address[state]', this.shipping_address.state)
      params.append('shop_address[country]', this.shipping_address.country)
      params.append('shop_address[postcode]', this.shipping_address.postcode)
      params.append('shop_address[set_default]', 1)
      if(this.shipping_address.id === '') {
        AddressService.addAddress(params).then(response => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showSuccessToast', ['Saved'])
          this.getUserInfo()
        }).catch(e => {
          this.$store.dispatch('error/showLoadingActivity', false)
          if (e.status === 401) {
            this.$root.$emit('showLoginModal')
          } else {
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          }
        })
      } else {
        AddressService.updateAddress(this.shipping_address.id, params).then(response => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showSuccessToast', ['Saved'])
          this.getUserInfo()
        }).catch(e => {
          this.$store.dispatch('error/showLoadingActivity', false)
          if (e.status === 401) {
            this.$root.$emit('showLoginModal')
          } else {
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          }
        })
      }
    },

    unblockUser (user) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const userId = user.id
      UserService.unblockUser(userId).then(response =>  {
        this.getUserInfo()        
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (e.status === 401) {
          this.$root.$emit('showLoginModal')
        } else {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        }
      })
    },

    updateUser (params) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const userId = this.$store.state.auth.user.id
      UserService.updateUserInfo(userId, params).then(response =>  {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', ['Saved'])
        AuthService.setUser(response.body)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (e.status === 401) {
          this.$root.$emit('showLoginModal')
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

    resetRepostPrice() {
      this.repost_price = this.$store.state.auth.user.repost_price
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
