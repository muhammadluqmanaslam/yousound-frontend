import _ from 'lodash'
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

          formData.append('user[first_name]', this.user.first_name)
          formData.append('user[last_name]', this.user.last_name)
          formData.append('user[year_of_birth]', this.user.year_of_birth)
          formData.append('user[gender]', this.user.gender)
          formData.append('user[country]', this.user.country)
          formData.append('user[city]', this.user.city)

          formData.append('user[genre_id]', this.user.genre_id)
          formData.append('user[artist_type]', this.user.artist_type)
          formData.append('user[released_albums_count]', this.user.released_albums_count)
          formData.append('user[years_since_first_released]', this.user.years_since_first_released)
          formData.append('user[will_run_live_video]', this.user.will_run_live_video)
          formData.append('user[will_sell_products]', this.user.will_sell_products)
          formData.append('user[will_sell_physical_copies]', this.user.will_sell_physical_copies)
          formData.append('user[annual_income_on_merch_sales]', this.user.annual_income_on_merch_sales)
          formData.append('user[annual_performances_count]', this.user.annual_performances_count)
          formData.append('user[signed_status]', this.user.signed_status)
          formData.append('user[performance_rights_organization]', this.user.performance_rights_organization)
          formData.append('user[ipi_cae_number]', this.user.ipi_cae_number)
          formData.append('user[website_1_url]', this.user.website_1_url)
          formData.append('user[website_2_url]', this.user.website_2_url)
          formData.append('user[is_business_registered]', this.user.is_business_registered)
          formData.append('user[artists_count]', this.user.artists_count)
          formData.append('user[standard_brand_type]', this.user.standard_brand_type)
          formData.append('user[customized_brand_type]', this.user.customized_brand_type)
          formData.append('user[employees_count]', this.user.employees_count)
          formData.append('user[years_in_business]', this.user.years_in_business)
          formData.append('user[will_sell_music_related_products]', this.user.will_sell_music_related_products)
          formData.append('user[products_count]', this.user.products_count)
          formData.append('user[annual_income]', this.user.annual_income)
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
