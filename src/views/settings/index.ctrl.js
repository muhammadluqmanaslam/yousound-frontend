/* global $:true */
import _ from 'lodash'
import MeService from '@/services/me'
import AuthService from '@/services/auth'
import UserService from '@/services/user'
import { MyEvents } from '@/helper'

import trackCard from '@/components/trackcard'
import profileItem from '@/components/profileitem'

import addressTab from './components/address_tab'
import genreTab from './components/genre_tab'
import policyTab from './components/policy_tab'
import priceTab from './components/price_tab'
import verifyTab from './components/verify_tab'
import contentTopHeader from '@/components/contentTopHeader'
import dashboardNav from '@/components/dashboardnav'
import UserTag from '@/components/user_tag'
import { mapState } from 'vuex'
import SubscriptionService from '@/services/subscription.js'
import PaymentCard from "@/components/paymentCard";
import UpgradeModal from "../../views/UpgradeModal"

// import { MyEvents } from '@/helper'
// const ActionCable = require('actioncable')

export default {
  props: {
    isComp: Boolean,
  },
  components: {
    trackCard,
    profileItem,
    addressTab,
    genreTab,
    policyTab,
    priceTab,
    verifyTab,
    contentTopHeader,
    dashboardNav,
    UserTag,
    PaymentCard,
    UpgradeModal
  },

  data() {
    return {
      socialChannel: "",
			socialUsername: "",
      replaceTopMenu: [
        { id: 'settings', title: 'Settings', pathName: 'UserSettings', icon: require('../../../static/images/settings-gear.svg') },
      ],
      dialog: false,
      tabs: [
        { id: 'info', title: 'Account' },
        { id: 'password', title: 'Password' },
        { id: 'bank-details', title: 'Bank Details' },
        // { id: 'repost-price', title: 'Repost Price' },
        { id: 'shipping-address', title: 'Shipping Address' },
        { id: 'blocked', title: 'Blocked' },
        // { id: 'seller-policies', title: 'Seller Policies' },
        // { id: 'verify-status', title: 'Verification Status' }
      ],
      active_tab: 'info',
      profile: {
        image: null,
        username: '',
        display_name: '',
        email: '',
        contact_url: '',
        enable_alert: false,
        first_name: '',
        last_name: '',
      },
      password: {
        current_password: '',
        new_password: '',
        confirmed_password: '',
      },
      show_stripe_disconnect_confirm_dialog: false,
      stripeDialog: false,
      stripeEmail: '',
      user: {},
      cable: null,
      notification_subscription: null,
      isPageReady: false,
      plans: { basic: 'Basic', plus: 'Creator', pro: 'Advanced', },
      subscriptionModal: false,
      initPayment: false,
			selectedPlan: {},
			plansUpgradeModal: false,
			plansList: {'basic': 1, plus: '2', pro: '3'},
			plansName: {'basic': 'Listener', plus: 'Creator', pro: 'Advance'},
			planChangeText: null,
      showGetVerifiedModal: false,
      remainingDaysModal: false,
    }
  },

  computed: {
    ...mapState({
      sideBarWidth: state => state.app.sideBarWidth,
      plansData: (state) => state.app.plansData,
    }),

    socialChannels() {
			return [
				{
					title: "Facebook",
					id: "facebook",
				},
				{
					title: "Instagram",
					id: "instagram",
				},
				{
					title: "Twitter",
					id: "twitter",
				},
				{
					title: "Tik Tok",
					id: "tiktok",
				},
			];
		},

    calcSideBarWidth() {
      const defaultPageMargin = 48;
      const defaultAppPadding = 16;
      return this.sideBarWidth + defaultPageMargin + defaultAppPadding
    },
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentUser() {
      return this.$store.state.auth.user
    },

    stripeLink() {
      return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.STRIPE_CONNECT_CLIENT_ID}&scope=read_write&state=${this.$store.state.auth.secret_code}`
    },

    availableTabs() {
      let tabs = this.tabs.slice()

      if (this.currentUser.user_type === 'listener') {
        tabs = _.filter(tabs, (t) => t.id !== 'seller-policies')
      }

      if (
        ['artist', 'brand', 'label'].indexOf(this.currentUser.request_role) > -1
      ) {
        tabs = _.concat(tabs, {
          id: 'verify-status',
          title: 'Verification Status',
        })
      }

      return tabs
    },
  },

  watch: {
    $route(toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      this.setTab(tab)
    },
  },

  created() {
    if (!this.currentUser) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }
    this.selectedPlan = this.plans[0];

    this.getUserInfo()
    // this.$store.dispatch('navigator/goNextState', {
    //   page: 'settings',
    //   tab: tab,
    // })

    const tab = this.$route.hash.substr(1) || this.$route.params.tab || 'info'
    this.onTab(tab || tab.id)

    MeService.stripeEmail().then((res) => (this.stripeEmail = res.body.email))

    this.$intercom.update({ hide_default_launcher: false })
  },

  beforeDestroy() {
    this.$intercom.update({ hide_default_launcher: true })
  },

  methods: {

    selectedChannel(channel) {
			this.socialChannel = channel;
		},

		hideModal() {
      this.showGetVerifiedModal = false;
    },

    verifiedSocialAttributes() {
      if (this.socialChannel.id == null || this.socialUsername === '') {
        this.$store.dispatch('error/showErrorToast', "Social channel and username cannot be empty")
      } else if(this.selectedPlan == null) {
        this.reRequestForVerification()
      } else {
        let params = { social_provider: this.socialChannel.id, social_user_name: this.socialUsername }
        this.$store.dispatch('error/showLoadingActivity', true)
        UserService.updateUserInfo(this.currentUser.id, params)
          .then((response) => {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('error/showSuccessToast', ['Social Username and channel saved successfully'])
            AuthService.setUser(response.body)
            this.verifyUserType()
          })
          .catch((e) => {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
      }
    },

    openPaymentModal(plan) {
			this.initPayment = true;
			this.selectedPlan = plan;
		},

    verifyPlanType(plan) {
      this.selectedPlan = plan
      if ((this.currentUser.plan == "basic" || this.currentUser.plan == null) && (this.selectedPlan.id !== 'basic' )) {
        this.showGetVerifiedModal = true
      } else {
        this.verifyUserType();
      }
    },

		verifyUserType() {
			let plan = this.selectedPlan
			if (this.currentUser.stripe_customer_id == null) {
				this.openPaymentModal(plan)
			}
			else {
				this.planChangeText = this.plansCategory(this.currentUser.plan, this.plansList[plan.id])
				if (!(this.planChangeText === 'Current Plan' || this.planChangeText === null)) {
					this.plansUpgradeModal = true
				}
			}
		},

		closePaymentModal() {
			this.initPayment = false;
			this.selectedPlan = {};
		},

		plansDescription(plan) {
			if (this.currentUser == null || this.currentUser.plan === null) {
				if (plan == 'basic') {
					return 'Start free 30 day trial'
				} else {
					return 'Get Verified'
				}
			} else {
				return this.plansCategory(this.currentUser.plan, this.plansList[plan])
			}
		},

		plansCategory(userPlan, planCategory) {
			if(this.plansList[userPlan] == planCategory) {
				return 'Current Plan'
			} else if (planCategory <= this.plansList[userPlan]) {
				return 'Downgrade Plan'
			} else {
				return 'Upgrade Plan'
			}
		},

		subscriptionChange() {
			let params = { selectedPlan: this.selectedPlan.id, social_provider: this.socialChannel, social_user_name: this.socialUsername }
			SubscriptionService.subscriptionChange(params)
				.then((response) => {
					this.hidePlanChangeModal()
					this.$store.dispatch('error/showSuccessToast', [response.body.success_response])
					setTimeout(function() {
						window.location.href = '/settings'
					}, 2000);
				})
				.catch((e) => {
					this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
				})
		},

		hidePlanChangeModal() {
			this.plansUpgradeModal = false
			this.planChangeText = null
		},

    isCurrentPlan(plan) {
      return plan.id === this.currentUser.plan
    },
    signOut() {
      AuthService.signout()
      this.$router.push({ path: '/login' })
      this.$root.$emit(MyEvents.AUTH_SIGNOUT)
    },
    isActiveTab(tab) {
      return this.active_tab === tab
    },

    // availableTab (tab) {
    //   return tab.id !== 'verify-status' ||
    //     (this.currentUser.user_type == 'listener' && ['artist', 'brand', 'label'].indexOf(this.currentUser.request_role) > -1)
    // },

    onTab(tab) {
      if (this.active_tab !== tab) {
        // this.$router.push({
        //   path: this.$route.path,
        //   hash: tab,
        // })

        this.setTab(tab)
      }
    },

    setTab(tab) {
      if (!tab) {
        tab = 'info'
      }

      switch (tab) {
        case 'info':
          this.resetProfile()
          break;
        case 'password':
          this.resetPassword();
          break;
        // case 'repost-price':
        //   this.resetRepostPrice()
        //   break
        // case 'shipping-address':
        //   this.resetShippingAddress()
        //   break
        // case 'genre-filter':
        //   this.resetGenres()
        //   break

        default:
          break;
      }

      this.active_tab = tab
    },

    disableSubscriptionModal() {
      this.subscriptionModal = false;
    },

    enableSubscriptionModal() {
      this.subscriptionModal = true
    },

    profileImageChanged(e) {
      this.profile.image = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener(
        'load',
        (event) => {
          // document.getElementById('profile_image').src = event.target.result
          // document.getElementById('profile_image').style.backgroundImage = event.target.result
          $('#profile_image').css(
            'background-image',
            'url(' + event.target.result + ')'
          )
        },
        false
      )
      reader.readAsDataURL(this.profile.image)
    },

    remainingDays() {
      const reRequest = new Date(this.currentUser.re_requested_at)
      const todayDate = new Date()
      const diffTime = Math.abs(todayDate - reRequest);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },

    getUserInfo() {
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.getUserInfo(this.currentUser.id)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          AuthService.setUser(response.body)
          this.user = _.cloneDeep(response.body)

          const permitted_keys = Object.keys(this.profile)
          permitted_keys.forEach(k => {
            if (k == "image") {
              this.profile[k] = response.body.avatar.url
            } else if (permitted_keys.includes(k)) {
              this.profile[k] = response.body[k]
            }
          })

          // this.resetProfile()
          // this.resetShippingAddress()
          // this.resetGenres()
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },


    verifyReRequestStatus() {
      if (this.currentUser.request_status === 'denied' && this.remainingDays() >= 30) {
        this.showGetVerifiedModal = true
      }
       else {
        this.remainingDaysModal = true
       }
    },

    reRequestForVerification() {
      this.$store.dispatch('error/showLoadingActivity', true)
			let params = { social_provider: this.socialChannel, social_user_name: this.socialUsername }

      UserService.creatorReRequest(this.currentUser.id, params)
      .then((response) => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', ['Re Request send Successfully'])
        AuthService.setUser(response.body)
        this.showGetVerifiedModal = false;
      })
      .catch((e) => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    cancelAccount() {
      this.dialog = false
      // const _user = _.cloneDeep(this.currentUser)
      UserService.deleteUser(this.user.id).then((response) => {
        AuthService.signout()
        this.$router.push({ path: '/login' })
        // this.$root.$emit(MyEvents.AUTH_SIGNOUT, _user.stream)
      })
    },

    updateAccount() {
      const params = new FormData()
      if (this.profile.image) {
        params.append('user[avatar]', this.profile.image)
      }
      params.append('user[display_name]', this.profile.display_name)
      params.append('user[email]', this.profile.email)
      params.append('user[contact_url]', this.profile.contact_url)
      params.append(
        'user[enable_alert]',
        this.profile.enable_alert === true ? 1 : 0
      )

      this.updateUser(params)
    },

    async deactivateSubscription() {
      await SubscriptionService.deactivateSubscription()
        .then(response => {
          let user = this.currentUser
          user.deactivate_subscription = true
          AuthService.setUser(user)
          this.subscriptionModal = false
          this.$store.dispatch('error/showSuccessToast', [response.body.success_response])
        })
        .catch(e => {
          this.$store.dispatch(
            'error/showErrorToast', e.body.errors
          )
        })
    },

    resetPassword() {
      this.password.current_password = ''
      this.password.new_password = ''
      this.password.confirmed_password = ''
    },

    updatePassword() {
      this.$store.dispatch('error/showLoadingActivity', true)
      const userId = this.currentUser.id
      const params = new FormData()
      // console.log(this.password)
      params.append('old_password', this.password.current_password)
      params.append('new_password', this.password.new_password)
      params.append('confirmed_password', this.password.confirmed_password)
      UserService.changePassword(userId, params)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showSuccessToast', ['Saved'])
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    viewStripeAccount() { },

    openStripeDisconnectConfirmDialog() {
      this.show_stripe_disconnect_confirm_dialog = true
    },

    closeStripeDisconnectConfirmDialog() {
      this.show_stripe_disconnect_confirm_dialog = false
    },

    disconnetAccount() {
      MeService.disconnectStripe()
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'Stripe Disconected!',
          ])
          this.$store.dispatch('auth/setStripeStatus', false)
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
      this.closeStripeDisconnectConfirmDialog()
    },

    unblockUser(user) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const userId = user.id
      UserService.unblockUser(userId)
        .then((response) => {
          this.getUserInfo()
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    updateUser(params) {
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.updateUserInfo(this.currentUser.id, params)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showSuccessToast', ['Saved'])
          AuthService.setUser(response.body)
        })
        .catch((e) => {
          const errors = e.body.errors
            ? _.map(e.body.errors, (msg) => `Email ${msg.detail}`)
            : [e.body]
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', errors)
        })
    },

    resetProfile() {
      this.profile.image = this.currentUser.avatar.url
      this.profile.username = this.currentUser.username
      this.profile.display_name = this.currentUser.display_name
      this.profile.email = this.currentUser.email
      this.profile.contact_url = this.currentUser.contact_url
      this.profile.enable_alert = this.currentUser.enable_alert
    },

    isSubscriptionAvailable() {
      let trial_end = new Date(this.currentUser.trial_end)
      if (this.currentUser.user_type == 'listener' && this.currentUser.plan && trial_end > new Date) {
        return true
      } else if (this.currentUser.plan && this.currentUser.creator_verified) {
        return true
      }
      return false;
    },
  },

  mounted() {
    const vm = this
    $.getJSON('../../static/countries.json', function (json) {
      const countries = json.countries
      vm.countries = []
      for (let index in countries) {
        const country = {
          iso: countries[index]['iso_2'],
          name: countries[index]['name'],
        }
        vm.countries.push(country)
      }
    })
  },
}
