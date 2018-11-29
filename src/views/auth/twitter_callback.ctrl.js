import _ from 'lodash'
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
  UserAnnualIncomeOptions
} from '@/helper'

// import GenreService from '@/services/genre'
import TwitterService from '@/services/twitter'

export default {
  components: {
  },

  data () {
    return {
      query_string: [],
      twitter_info: null,
      user: {},
      main_genres: [],
      sub_genres: [],
      isPageReady: false
    }
  },

  computed: {
    country_options () {
      return Countries
    },

    boolean_options () {
      return UserBooleanOptions
    },

    gender_options () {
      return UserGenderOptions
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
    this.$store.dispatch('navigator/goNextState', { page: 'register', tab: '' })
    this.twitter_info = JSON.parse(Storage.get('twitter_info'))
    if (this.twitter_info && this.twitter_info.oauth_token === this.$route.query['oauth_token']) {
      const params = {
        oauth_token: this.$route.query['oauth_token'],
        oauth_token_secret: this.twitter_info.oauth_token_secret,
        oauth_verifier: this.$route.query['oauth_verifier']
      }
      TwitterService.getAccessToken(params).then(response => {
        this.twitter_info = response.body
        Storage.remove('twitter_info')
        // Storage.set('twitter_info', JSON.stringify(this.twitter_info))

        this.user = {
          display_name: this.twitter_info.screen_name,
          social_user_id: this.twitter_info.user_id,
          request_role: this.$route.query['user_type'] || 'artist',

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
          annual_income: null
        }

        // console.log(this.$route.query['code'])
        this.$store.dispatch('auth/setSecretCode', this.$route.query['code'])

        this.main_genres = this.$store.state.app.genres
        this.sub_genres = _.flatMap(this.$store.state.app.genres, 'children')
        this.isPageReady = true
      })
    } else {
      Storage.remove('twitter_info')
      this.$router.push('/register')
    }
  },

  methods: {
    submit () {
      const vm = this
      this.$validator.validateAll().then(response => {
        if (response === true) {
          vm.$store.dispatch('auth/setPendingUser', vm.user)
          this.$router.push(`/register/${this.user.request_role}`)
        } else {
          vm.$store.dispatch('error/showErrorToast', [vm.errors.items[0].msg])
        }
      }).catch(e => {
        console.log('error', e)
      })
    }
  },

  mounted () {
    $('#content-view').css('padding-top', '0');
  }
}
