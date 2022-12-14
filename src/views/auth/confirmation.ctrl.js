import AuthService from '@/services/auth.js'
import { MyEvents } from '@/helper'

export default {
  components: {},

  data() {
    return {
      token: '',
      email: '',
      user_type: 0,
      message: '',
      isActivated: false,
      isLoading: false,
      isPageReady: false,
      user: {
        email: '',
        password: ''
      },
      remember: false,
    }
  },

  computed: {},

  async created() {
    this.$store.dispatch('navigator/goNextState', { page: 'register', tab: '' })
    this.token = this.$route.params.token
    this.email = this.$route.query['email']
    this.user_type = this.$route.query['type'] || 1
    if (this.token === 'being') {
      if (!this.email) {
        this.$router.push('/')
      }
    } else {
      this.isPageReady = false
      // this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        confirmation_token: this.token,
      }
      // AuthService.activeAccount(params).then(response => {
      //   this.isPageReady = true
      //   this.$store.dispatch('error/showLoadingActivity', false)
      //   this.$store.dispatch('error/showSuccessToast', ['Your account has been activated.'])
      // }).catch(e => {
      //   this.$store.dispatch('error/showLoadingActivity', false)
      //   if (e.body.status === 500) {
      //     this.$store.dispatch('error/showErrorToast', ['Failed in seding confirmation email'])
      //   } else if (e.body.errors[0].detail === 'was already confirmed, please try signing in') {
      //     this.isPageReady = true
      //     this.$store.dispatch('error/showSuccessToast', ['Your account was already activated!'])
      //   } else {
      //     this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      //   }
      // })
      this.user.email = localStorage.getItem("user_email")
      this.user.password = localStorage.getItem("user_pass")

      let myAlert
      await AuthService.activeAccount(params)
        .then((response) => {
          myAlert = {
            type: 'success',
            messages: ['Your account has been activated.'],
          }
          if(this.user.email !== '' && this.user.password !== '') {
            AuthService.login(this.user)
            .then((response) => {
              if (this.remember) {
                AuthService.saveCredential(this.user)
              }
              AuthService.setTokenAndUserInfo(response.body)

              if (response.body.sign_in_count <= 1) {
                this.$store.dispatch('auth/setFirstVisit', true)
              }

              this.$root.$emit(MyEvents.AUTH_SIGNIN)

              this.$store.dispatch('error/showLoadingActivity', false)
              this.$router.push({ name: 'AlbumIndex' })
              localStorage.removeItem("user_email")
              localStorage.removeItem("user_pass")
            })
            .catch((e) => {
              this.$store.dispatch('error/showLoadingActivity', false)
              this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body]
              )
            })
          } else {
            this.$router.push({
              path: '/login',
              query: { alert: btoa(JSON.stringify(myAlert)) },
            })
          }
        })
        .catch((e) => {
          if (e.body.status === 500) {
            myAlert = {
              type: 'error',
              messages: ['Failed in sending confirmation email'],
            }
          } else if (
            e.body.errors[0].detail ===
            'was already confirmed, please try signing in'
          ) {
            myAlert = {
              type: 'success',
              messages: ['Your account was already activated!'],
            }
          } else {
            myAlert = {
              type: 'error',
              messages: ['Invalid confirmation token'],
              // messages: e.body.errors || [e.body]
            }
          }
          this.$router.push({
            path: '/login',
            query: { alert: btoa(JSON.stringify(myAlert)) },
          })
        })
    }
  },

  methods: {
    sendConfirmEmail() {
      const params = {
        email: this.email,
      }
      AuthService.sendConfirmEmail(params)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'Resent a confirmation email',
          ])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },
}
