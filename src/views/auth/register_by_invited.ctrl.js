import _ from 'lodash'
import { UserTypeOptions } from '@/helper'

import InvitationService from '@/services/invitation'
import AuthService from '@/services/auth'
// import UserService from '@/services/user'

import GenreDialog from '@/components/genre_dialog'
import UserTag from '@/components/user_tag'

export default {
  components: {
    GenreDialog,
    UserTag,
  },

  data() {
    return {
      UserTypeOptions: UserTypeOptions,
      token: '',
      terms: false,
      user: {
        email: '',
        password: '',
        username: '',
        display_name: '',
        avatar_file: null,

        genre_id: null,
        social_user_name: '',
        request_role: null,
      },
      inviter: {},
      show_register_success_dialog: false,
      isPageReady: false,
    }
  },

  computed: {
    main_genres() {
      return this.$store.state.app.genres
    },
  },

  created() {
    AuthService.clearTokenAndUserInfo()
    this.$store.dispatch('navigator/goNextState', { page: 'register', tab: '' })

    this.token = this.$route.params.token
    this.isPageReady = false
    this.$store.dispatch('error/showLoadingActivity', true)
    const params = {
      token: this.token,
    }
    InvitationService.findByToken(params)
      .then((res) => {
        this.inviter = res.body
        this.isPageReady = true
        this.$store.dispatch('error/showLoadingActivity', false)
      })
      .catch((err) => {
        this.$store.dispatch(
          'error/showErrorToast',
          err.body.errors || [err.body]
        )
        this.$router.push({ path: '/' })
        this.$store.dispatch('error/showLoadingActivity', false)
      })
    // this.show_register_success_dialog = true
  },

  methods: {
    submit() {
      this.$validator
        .validateAll()
        .then((res) => {
          // console.log(this.errors)
          if (res === true) {
            var formData = new FormData()
            formData.append('user[invitation_token]', this.token)
            formData.append('user[email]', this.user.email)
            formData.append('user[password]', this.user.password)
            formData.append('user[username]', this.user.username)
            formData.append('user[display_name]', this.user.display_name)
            formData.append('user[avatar]', this.user.avatar_file)
            formData.append('user[genre_id]', this.user.genre_id)
            formData.append('user[request_role]', this.user.request_role)
            formData.append(
              'user[social_user_name]',
              this.user.social_user_name
            )
            AuthService.registerAsListener(formData)
              .then((res) => {
                this.$store.dispatch('error/showLoadingActivity', false)
                this.show_register_success_dialog = true
                // this.$router.push({
                //   path: `/confirm/being?email=${this.user.email}`,
                // })
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
