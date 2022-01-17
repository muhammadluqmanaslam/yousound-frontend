import AuthService from '@/services/auth.js'
// import UserService from '@/services/user.js'

export default {
  components: {},

  data() {
    return {
      is_username_available: true,
      register_success: false,
      terms: false,
      newsletter_terms: false,
      user: {
        email: '',
        password: '',
        username: '',
        display_name: '',
        avatar_file: null,
      },
    }
  },

  computed: {},

  created() {
    AuthService.clearTokenAndUserInfo()
    this.$store.dispatch('navigator/goNextState', { page: 'register', tab: '' })
  },

  methods: {
    submit() {
      this.$validator
        .validateAll()
        .then((response) => {
          if (response === true) {
            this.$store.dispatch('error/showLoadingActivity', true)
            var formData = new FormData()
            formData.append('user[email]', this.user.email)
            formData.append('user[password]', this.user.password)
            formData.append('user[username]', this.user.username)
            formData.append('user[display_name]', this.user.display_name)
            formData.append('user[avatar]', this.user.avatar_file)
            AuthService.registerAsListener(formData)
              .then((response) => {
                // const userId = response.body.id
                // const params = {
                //   genre_ids: this.$store.state.auth.genreIds
                // }
                // UserService.hiddenUserGenres(userId, params)
                this.$store.dispatch('error/showLoadingActivity', false)
                this.$router.push({
                  path: `/confirm/being?email=${this.user.email}`,
                })
              })
              .catch((e) => {
                this.$store.dispatch('error/showLoadingActivity', false)
                if (e.status === 500) {
                  this.$store.dispatch('error/showErrorToast', [
                    'Failed in seding confirmation email',
                  ])
                  this.$router.push({
                    path: `/confirm/being?email=${this.user.email}&type=0`,
                  })
                } else {
                  this.$store.dispatch('error/showErrorToast', e.body.errors)
                }
              })
          } else {
            this.$store.dispatch('error/showErrorToast', [
              this.errors.items[0].msg,
            ])
          }
        })
        .catch((e) => {
          console.log('error', e)
        })
    },

    onBlur(e) {
      // console.log('onBlur', e)
      const params = {
        username: this.user.username,
      }
      AuthService.isUsernameAvailable(params)
        .then((res) => {
          this.is_username_available = true
        })
        .catch((e) => {
          this.is_username_available = false
        })
    },

    imageChanged(e) {
      if (e.target.files[0].size > 2097152) {
        this.$refs.avatar_file.value = null
        this.$refs.avatar.src = '/static/images/placeholder.png'
        this.$store.dispatch('error/showErrorToast', [
          'You can upload an avatar 2MB in maximum',
        ])
        return
      }
      this.user.avatar_file = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener(
        'load',
        (event) => {
          document.getElementById('avatar').src = event.target.result
        },
        false
      )
      reader.readAsDataURL(this.user.avatar_file)
    },
  },
}
