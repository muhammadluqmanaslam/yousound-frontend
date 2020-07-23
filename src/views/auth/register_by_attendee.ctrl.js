import _ from 'lodash'
import moment from 'moment'
import {
  Storage,
  Countries,
  UserBooleanOptions,
  UserGenderOptions,
  UserArtistTypeOptions,
  UserReleasedAlbumsCountOptions,
  UserYearsSinceFirstReleasedOptions,
  UserAnnualIncomeOnMerchSalesOptions,
  UserAnnualPerformancesCountOptions,
  UserSignedStatusOptions,
  UserPerformanceRightsOrganizationOptions,
  UserArtistsCountOptions,
  UserStandardBrandTypeOptions,
  UserEmployeesCountOptions,
  UserYearsInBusinessOptions,
  UserProductsCountOptions,
  UserAnnualIncomeOptions,
} from '@/helper'

import AttendeeService from '@/services/attendee.js'
import AuthService from '@/services/auth.js'
import UserService from '@/services/user.js'

import genreDialog from '@/components/genre_dialog'

export default {
  components: {
    genreDialog,
  },

  data() {
    return {
      show_genre_selector_dialog: false,
      show_additional_info_dialog: false,
      token: '',
      terms: false,
      year_of_birth_options: [],
      user: {
        email: '',
        password: '',
        username: '',
        display_name: '',
        avatar_file: null,

        first_name: null,
        last_name: null,
        year_of_birth: null,
        gender: null,
        country: null,
        city: null,

        genre_id: null,
        artist_type: null,
        released_albums_count: null,
        years_since_first_released: null,
        will_run_live_video: null,
        will_sell_products: null,
        will_sell_physical_copies: null,
        annual_income_on_merch_sales: null,
        annual_performances_count: null,
        signed_status: null,
        performance_rights_organization: null,
        ipi_cae_number: null,
        website_1_url: null,
        website_2_url: null,
        history: null,

        sub_genre_id: null,
        is_business_registered: null,
        artists_count: null,

        standard_brand_type: null,
        customized_brand_type: null,
        employees_count: null,
        years_in_business: null,
        will_sell_music_related_products: null,
        products_count: null,
        annual_income: null,
      },
      attendee: null,
      isPageReady: false,
    }
  },

  computed: {
    main_genres() {
      return this.$store.state.app.genres
    },

    sub_genres() {
      return _.flatMap(this.$store.state.app.genres, 'children')
    },

    country_options() {
      return Countries
    },

    boolean_options() {
      return UserBooleanOptions
    },

    gender_options() {
      return UserGenderOptions
    },

    artist_type_options() {
      return UserArtistTypeOptions
    },

    released_albums_count_options() {
      return UserReleasedAlbumsCountOptions
    },

    years_since_first_released_options() {
      return UserYearsSinceFirstReleasedOptions
    },

    annual_income_on_merch_sales_options() {
      return UserAnnualIncomeOnMerchSalesOptions
    },

    annual_performances_count_options() {
      return UserAnnualPerformancesCountOptions
    },

    signed_status_options() {
      return UserSignedStatusOptions
    },

    performance_rights_organization_options() {
      return UserPerformanceRightsOrganizationOptions
    },

    artists_count_options() {
      return UserArtistsCountOptions
    },

    standard_brand_type_options() {
      return UserStandardBrandTypeOptions
    },

    employees_count_options() {
      return UserEmployeesCountOptions
    },

    years_in_business_options() {
      return UserYearsInBusinessOptions
    },

    products_count_options() {
      return UserProductsCountOptions
    },

    annual_income_options() {
      return UserAnnualIncomeOptions
    },
  },

  created() {
    this.$store.dispatch('navigator/goNextState', { page: 'register', tab: '' })

    const current_year = moment().year()
    for (let i = 1900; i < current_year; i++) {
      this.year_of_birth_options.push(i)
    }

    this.token = this.$route.params.token
    this.isPageReady = false
    this.$store.dispatch('error/showLoadingActivity', true)
    const params = {
      token: this.token,
    }
    Promise.all([AttendeeService.findByToken(params)])
      .then((values) => {
        this.attendee = values[0].body
        this.user.display_name = this.attendee.display_name
        this.user.email = this.attendee.email
        this.user.request_role = this.attendee.account_type

        this.show_additional_info_dialog = true

        this.isPageReady = true
        this.$store.dispatch('error/showLoadingActivity', false)
      })
      .catch((reason) => {
        // console.log('reason', reason)
        this.$store.dispatch(
          'error/showErrorToast',
          reason.body.errors || [reason.body]
        )
        this.$store.dispatch('error/showLoadingActivity', false)
      })
  },

  methods: {
    openGenreSelectorDialog() {
      // this.show_genre_selector_dialog = true
      const formScope = 'main-form'
      this.$validator
        .validateAll(formScope)
        .then((response) => {
          // console.log(this.errors)
          if (response === true) {
            this.show_genre_selector_dialog = true
          } else {
            this.$store.dispatch('error/showErrorToast', [
              _.find(this.errors.items, (item) => item.scope == formScope).msg,
            ])
          }
        })
        .catch((e) => {
          console.log('error', e)
        })
    },

    closeGenreSelectorDialog() {
      this.show_genre_selector_dialog = false
      if (this.$store.state.auth.genreIds !== '') {
        this.submit()
      }
    },

    submit() {
      const formScope = 'main-form'
      this.$validator
        .validateAll(formScope)
        .then((response) => {
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

            formData.append('user[first_name]', this.user.first_name)
            formData.append('user[last_name]', this.user.last_name)
            formData.append('user[year_of_birth]', this.user.year_of_birth)
            formData.append('user[gender]', this.user.gender)
            formData.append('user[country]', this.user.country)
            formData.append('user[city]', this.user.city)

            formData.append('user[genre_id]', this.user.genre_id)
            formData.append('user[artist_type]', this.user.artist_type)
            formData.append(
              'user[released_albums_count]',
              this.user.released_albums_count
            )
            formData.append(
              'user[years_since_first_released]',
              this.user.years_since_first_released
            )
            formData.append(
              'user[will_run_live_video]',
              this.user.will_run_live_video
            )
            formData.append(
              'user[will_sell_products]',
              this.user.will_sell_products
            )
            formData.append(
              'user[will_sell_physical_copies]',
              this.user.will_sell_physical_copies
            )
            formData.append(
              'user[annual_income_on_merch_sales]',
              this.user.annual_income_on_merch_sales
            )
            formData.append(
              'user[annual_performances_count]',
              this.user.annual_performances_count
            )
            formData.append('user[signed_status]', this.user.signed_status)
            formData.append(
              'user[performance_rights_organization]',
              this.user.performance_rights_organization
            )
            formData.append('user[ipi_cae_number]', this.user.ipi_cae_number)
            formData.append('user[website_1_url]', this.user.website_1_url)
            formData.append('user[website_2_url]', this.user.website_2_url)
            formData.append('user[history]', this.user.history)

            formData.append('user[sub_genre_id]', this.user.sub_genre_id)
            formData.append(
              'user[is_business_registered]',
              this.user.is_business_registered
            )
            formData.append('user[artists_count]', this.user.artists_count)

            formData.append(
              'user[standard_brand_type]',
              this.user.standard_brand_type
            )
            formData.append(
              'user[customized_brand_type]',
              this.user.customized_brand_type
            )
            formData.append('user[employees_count]', this.user.employees_count)
            formData.append(
              'user[years_in_business]',
              this.user.years_in_business
            )
            formData.append(
              'user[will_sell_music_related_products]',
              this.user.will_sell_music_related_products
            )
            formData.append('user[products_count]', this.user.products_count)
            formData.append('user[annual_income]', this.user.annual_income)

            AuthService.registerAsListener(formData)
              .then((response) => {
                const userId = response.body.id
                const params = {
                  genre_ids: this.$store.state.auth.genreIds,
                }
                UserService.hiddenUserGenres(userId, params)
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
              _.find(this.errors.items, (item) => item.scope == formScope).msg,
            ])
          }
        })
        .catch((e) => {
          console.log('error', e)
        })
    },

    submitAdditionalForm() {
      const formScope = 'additional-form'
      this.$validator.validateAll(formScope).then((response) => {
        if (response === true) {
          this.show_additional_info_dialog = false
        } else {
          // console.log(this.errors)
          this.$store.dispatch('error/showErrorToast', [
            _.find(this.errors.items, (item) => item.scope == formScope).msg,
          ])
        }
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
