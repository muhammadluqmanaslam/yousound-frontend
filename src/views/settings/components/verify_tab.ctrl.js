import moment from 'moment'
import AuthService from '@/services/auth'
import UserService from '@/services/user'
import {
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
  UserAnnualIncomeOptions
} from '@/helper'

export default {
  components: {
  },

  data () {
    return {
      user: {},
      main_genres: [],
      sub_genres: [],
      year_of_birth_options: [],
      isPageReady: false
    }
  },

  computed: {
    enabledForm () {
      return this.user.request_status == 'denied'
    },

    gotApproved () {
      return this.user.request_status == 'accepted'
    },

    country_options () {
      return Countries
    },

    gender_options () {
      return UserGenderOptions
    },

    boolean_options () {
      return UserBooleanOptions
    },

    artist_type_options () {
      return UserArtistTypeOptions
    },

    released_albums_count_options () {
      return UserReleasedAlbumsCountOptions
    },

    years_since_first_released_options () {
      return UserYearsSinceFirstReleasedOptions
    },

    annual_income_on_merch_sales_options () {
      return UserAnnualIncomeOnMerchSalesOptions
    },

    annual_performances_count_options () {
      return UserAnnualPerformancesCountOptions
    },

    signed_status_options () {
      return UserSignedStatusOptions
    },

    performance_rights_organization_options () {
      return UserPerformanceRightsOrganizationOptions
    },

    artists_count_options () {
      return UserArtistsCountOptions
    },

    standard_brand_type_options () {
      return UserStandardBrandTypeOptions
    },

    employees_count_options () {
      return UserEmployeesCountOptions
    },

    years_in_business_options () {
      return UserYearsInBusinessOptions
    },

    products_count_options () {
      return UserProductsCountOptions
    },

    annual_income_options () {
      return UserAnnualIncomeOptions
    }
  },

  created () {
    this.isPageReady = false
    this.$store.dispatch('error/showLoadingActivity', true)
    Promise.all([
      UserService.getUserInfo(this.$store.state.auth.user.id)
    ]).then(values => {
      this.user = values[0].body

      this.main_genres = this.$store.state.app.genres
      this.sub_genres = _.flatMap(this.$store.state.app.genres, 'children')

      const current_year = moment().year()
      for (let i = 1900; i < current_year; i++) {
        this.year_of_birth_options.push(i)
      }

      this.isPageReady = true
      this.$store.dispatch('error/showLoadingActivity', false)
    }).catch(reason => {
      console.log('reason', reason)
      this.$store.dispatch('error/showLoadingActivity', false)
    })
  },

  methods: {
    submit () {
      const vm = this
      this.$validator.validateAll().then(response => {
        if (response === true) {
          const params = {
            user: {
              first_name: vm.user.first_name,
              last_name: vm.user.last_name,
              year_of_birth: vm.user.year_of_birth,
              gender: vm.user.gender,
              country: vm.user.country,
              city: vm.user.city,

              genre_id: vm.user.genre_id,
              artist_type: vm.user.artist_type,
              released_albums_count: vm.user.released_albums_count,
              years_since_first_released: vm.user.years_since_first_released,
              will_run_live_video: vm.user.will_run_live_video,
              will_sell_products: vm.user.will_sell_products,
              will_sell_physical_copies: vm.user.will_sell_physical_copies,
              annual_income_on_merch_sales: vm.user.annual_income_on_merch_sales,
              annual_performances_count: vm.user.annual_performances_count,
              signed_status: vm.user.signed_status,
              performance_rights_organization: vm.user.performance_rights_organization,
              ipi_cae_number: vm.user.ipi_cae_number,
              website_1_url: vm.user.website_1_url,
              website_2_url: vm.user.website_2_url,
              history: vm.user.history,

              sub_genre_id: vm.user.sub_genre_id,
              is_business_registered: vm.user.is_business_registered,
              artists_count: vm.user.artists_count,

              standard_brand_type: vm.user.standard_brand_type,
              customized_brand_type: vm.user.customized_brand_type,
              employees_count: vm.user.employees_count,
              years_in_business: vm.user.years_in_business,
              will_sell_music_related_products: vm.user.will_sell_music_related_products,
              products_count: vm.user.products_count,
              annual_income: vm.user.annual_income,

              request_resend: true
            }
          }
          UserService.updateUserInfo(vm.user.id, params).then(response => {
            vm.user = response.body
          }).catch(e => {
            vm.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        } else {
          vm.$store.dispatch('error/showErrorToast', [vm.errors.items[0].msg])
        }
      }).catch(e => {
        console.log('error', e)
      })
    }
  }
}
