import _ from 'lodash'
import AttendeeService from '@/services/attendee.js'
import AuthService from '@/services/auth.js'
import UserService from '@/services/user.js'

import genreDialog from '@/components/genre_dialog'

export default {
  components: {
    genreDialog
  },

  data () {
    return {
      show_genre_selector_dialog: false,
      show_additional_info_dialog: false,
      token: '',
      terms: false,
      user: {
        email: '',
        password: '',
        username: '',
        display_name: '',
        avatar_file: null
      },
      main_genres: [],
      attendee: null,
      isPageReady: false
    }
  },

  computed: {
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'register', tab: '' })
    this.token = this.$route.params.token
    this.isPageReady = false
    this.$store.dispatch('error/showLoadingActivity', true)
    const params = {
      token: this.token
    }
    Promise.all([
      AttendeeService.findByToken(params)
    ]).then(values => {
      this.main_genres = this.$store.state.app.genres
      this.attendee = values[0].body
      this.user.display_name = this.attendee.display_name
      this.user.email = this.attendee.email
      this.user.request_role = this.attendee.account_type

      this.show_additional_info_dialog = true

      this.isPageReady = true
      this.$store.dispatch('error/showLoadingActivity', false)
    }).catch(reason => {
      // console.log('reason', reason)
      this.$store.dispatch('error/showErrorToast', reason.body.errors || [reason.body])
      this.$store.dispatch('error/showLoadingActivity', false)
    })
  },

  methods: {
    openGenreSelectorDialog () {
      // this.show_genre_selector_dialog = true
      const formScope = 'main-form'
      this.$validator.validateAll(formScope).then(response => {
        // console.log(this.errors)
        if (response === true) {
          this.show_genre_selector_dialog = true
        } else {
          this.$store.dispatch('error/showErrorToast', [_.find(this.errors.items, (item) => (item.scope == formScope)).msg])
        }
      }).catch(e => {
        console.log('error', e)
      })
    },

    closeGenreSelectorDialog () {
      this.show_genre_selector_dialog = false
      if (this.$store.state.auth.genreIds !== '') {
        this.submit()
      }
    },

    submit () {
      const formScope = 'main-form'
      this.$validator.validateAll(formScope).then(response => {
        // console.log(this.errors)
        if (response === true) {
          // this.$store.dispatch('error/showLoadingActivity', true)
          var formData = new FormData()
          formData.append('user[invitation_token]', this.token)
          formData.append('user[email]', this.user.email)
          formData.append('user[password]', this.user.password)
          formData.append('user[username]', this.user.username)
          formData.append('user[display_name]', this.user.display_name)
          formData.append('user[avatar]', this.user.avatar_file)
          formData.append('user[request_role]', this.user.request_role)
          // formData.append('user[genre_id]', this.user.genre_id)
          // formData.append('user[release_count]', this.user.release_count)
          // formData.append('user[soundcloud_url]', this.user.soundcloud_url)
          // formData.append('user[basecamp_url]', this.user.basecamp_url)
          // formData.append('user[website_url]', this.user.website_url)
          // formData.append('user[history]', this.user.history)

          AuthService.registerAsListener(formData).then(response => {
            const userId = response.body.id
            const params = {
              genre_ids: this.$store.state.auth.genreIds
            }
            UserService.hiddenUserGenres(userId, params)
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$router.push({ path: `/confirm/being?email=${this.user.email}` })
          }).catch(e => {
            this.$store.dispatch('error/showLoadingActivity', false)
            if (e.status === 500) {
              this.$store.dispatch('error/showErrorToast', ['Failed in seding confirmation email'])
              this.$router.push({ path: `/confirm/being?email=${this.user.email}&type=0` })
            } else {
              this.$store.dispatch('error/showErrorToast', e.body.errors)
            }
          })
        } else {
          this.$store.dispatch('error/showErrorToast', [_.find(this.errors.items, (item) => (item.scope == formScope)).msg])
        }
      }).catch(e => {
        console.log('error', e)
      })
    },

    submitAdditionalForm () {
      const formScope = 'additional-form'
      this.$validator.validateAll(formScope).then(response => {
        if (response === true) {
          this.show_additional_info_dialog = false
        } else {
          // console.log(this.errors)
          this.$store.dispatch('error/showErrorToast', [_.find(this.errors.items, (item) => (item.scope == formScope)).msg])
        }
      })
    },

    imageChanged(e) {
      if (e.target.files[0].size > 2097152) {
        this.$refs.avatar_file.value = null
        this.$refs.avatar.src = '/static/images/placeholder.png'
        this.$store.dispatch('error/showErrorToast', ['You can upload an avatar 2MB in maximum'])
        return
      }
      this.user.avatar_file = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener('load', (event) => {
        document.getElementById('avatar').src = event.target.result
      }, false)
      reader.readAsDataURL(this.user.avatar_file)
    }
  },

  mounted () {
    $('#content-view').css('padding-top', '0');
  }
}
