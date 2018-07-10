import _ from 'lodash'
import AuthService from '@/services/auth.js'
import UserService from '@/services/user.js'

import appFooter from '@/components/footer'
import genreDialog from '@/components/genre_dialog'

export default {
  components: {
    appFooter,
    genreDialog
  },

  data () {
    return {
      show_genre_selector_dialog: false,
      terms: false,
      user: {
        email: '',
        password: '',
        username: '',
        display_name: '',
        social_user_id: '',
        avatar_file: null
      }
    }
  },

  computed: {
  },

  created () {
    this.$store.dispatch('navigator/goNextState', {page: 'register', tab: ''})
    const pendingUser = this.$store.state.auth.pendingUser
    if (!pendingUser) {
      this.$router.push({ path: '/register' })
    } else {
      _.assignIn(this.user, pendingUser)
      // console.log('created', this.user)
    }
  },

  methods: {
    openGenreSelectorDialog () {
      this.$validator.validateAll().then(response => {
        if (response === true) {
          this.show_genre_selector_dialog = true
        } else {
          this.$store.dispatch('error/showErrorToast', [this.errors.items[0].msg])
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
      this.$validator.validateAll().then(response => {
        if (response === true) {
          this.$store.dispatch('error/showLoadingActivity', true)
          // console.log('registering', this.user)
          var formData = new FormData();
          formData.append('user[email]', this.user.email);
          formData.append('user[password]', this.user.password);
          formData.append('user[username]', this.user.username);
          formData.append('user[display_name]', this.user.display_name)
          formData.append('user[avatar]', this.user.avatar_file)

          formData.append('user[request_role]', this.user.request_role)
          formData.append('user[social_user_id]', this.user.social_user_id)
          formData.append('user[genre_id]', this.user.genre_id)
          formData.append('user[release_count]', this.user.release_count)
          formData.append('user[soundcloud_url]', this.user.soundcloud_url)
          formData.append('user[basecamp_url]', this.user.basecamp_url)
          formData.append('user[website_url]', this.user.website_url)
          formData.append('user[history]', this.user.history)

          AuthService.registerAsListener(formData).then(response => {
            const userId = response.body.id
            const params = {
              genre_ids: this.$store.state.auth.genreIds
            }
            UserService.hiddenUserGenres(userId, params)
            // JSON responses are automatically parsed.
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$router.push({ path: `/confirm/being?email=${this.user.email}` })
          }).catch(e => {
            this.$store.dispatch('error/showLoadingActivity', false)
            if (e.status === 500) {
              this.$store.dispatch('error/showErrorToast', ['Failed in seding confirmation email'])
              this.$router.push({ path: `/confirm/being?email=${this.user.email}` })
            } else {
              this.$store.dispatch('error/showErrorToast', e.body.errors)
            }
          })
        } else {
          this.$store.dispatch('error/showErrorToast', [this.errors.items[0].msg])
        }
      }).catch(e => {
        console.log('error', e)
      })
    },

    imageChanged (e) {
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
