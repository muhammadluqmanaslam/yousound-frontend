import _ from 'lodash'
import { Storage, Countries } from '@/helper'

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
      boolean_options: [
        {id: true, name: 'Yes'},
        {id: false, name: 'No'},
      ],
      main_genres: [],
      sub_genres: [],
      gender_options: ['Male', 'Female'],
      artist_type_type_options: ['Solo artist', 'Brand', 'Producer', 'DJ'],
      released_albums_count_options: [
        {id: 0, name: '0'},
        {id: 1, name: '1-5'},
        {id: 6, name: '6-10'},
        {id: 11, name: '10+'},
      ],
      years_since_first_released_options: [
        {id: 0, name: '0'},
        {id: 1, name: '1-5'},
        {id: 6, name: '6-10'},
        {id: 11, name: '10+'},
      ],
      annual_income_on_merch_sales_options: [
        {id: 0, name: 'None'},
        {id: 1, name: '$1-$4k'},
        {id: 5001, name: '$5k-$10k'},
        {id: 10001, name: '$11k-$50k'},
        {id: 50001, name: '$50k+'},
      ],
      annual_performances_count_options: [
        {id: 0, name: 'None'},
        {id: 1, name: '1-10'},
        {id: 11, name: '11-50'},
        {id: 51, name: '50+'},
      ],
      signed_status_options: ['No', 'Yes, Indie label', 'Yes, major label'],
      performance_rights_organization_options: [
        {id: 'Argentina-SADAIC', name: 'SADAIC'},
        {id: 'Australia-APRA', name: 'Australasian Performing Right Association (APRA)'},
        {id: 'Australia-PPCA', name: 'Phonographic Performance Company of Australia (PPCA)'},
        {id: 'Austria-AKM', name: 'Autoren, Komponisten und Musikverleger (AKM)'},
        {id: 'Belgium-SABAM', name: 'SABAM'},
        {id: 'Bolivia-SENAPI', name: 'Servicio Nacional de Propiedad Intelectual (SENAPI)'},
        {id: 'Brazil-ECAD', name: 'ECAD (Escritório Central de Arrecadação e Distribuição)'},
        {id: 'Bulgaria-MUSICAUTHOR', name: 'MUSICAUTHOR'},
        {id: 'Canada-SOCAN', name: 'Society of Composers, Authors and Music Publishers of Canada (SOCAN)'},
        {id: 'Chile-SCD', name: 'Sociedad Chilena del Derecho de Autor (SCD)'},
        {id: 'Colombia-SAYCO/ACINPRO', name: 'SAYCO/ACINPRO'},
        {id: 'Croatia-HDS', name: 'HDS'},
        {id: 'Czech Republic-OSA', name: 'OSA'},
        {id: 'Denmark-KODA', name: 'KODA'},
        {id: 'Estonia-EAU', name: 'EAU'},
        {id: 'Finland-Teosto', name: 'Teosto'},
        {id: 'France-SACEM', name: 'Société des auteurs, compositeurs et éditeurs de musique (SACEM)'},
        {id: 'Georgia-SAS', name: 'SAS'},
        {id: 'Germany-GEMA', name: 'Gesellschaft für musikalische Aufführungs- und mechanische Vervielfältigungsrechte (GEMA)'},
        {id: 'Greece-AEPI', name: 'AEPI'},
        {id: 'Greece-GEA-GRAMMO', name: 'GEA-GRAMMO, ERATO-APOLLON'},
        {id: 'Hong Kong-CASH', name: 'CASH'},
        {id: 'Hungary-ARTISJUS', name: 'ARTISJUS'},
        {id: 'India-The Indian Performing Right Society Ltd', name: 'The Indian Performing Right Society Ltd'},
        {id: 'Ireland-PPI', name: 'Irish Music Rights Organisation, Phonographic Performance Ireland (PPI)'},
        {id: 'Israel-ACUM', name: 'ACUM'},
        {id: 'Italy-SIAE', name: 'SIAE'},
        {id: 'Japan-JASRAC', name: 'JASRAC'},
        {id: 'Lithuania-LATGA-A', name: 'LATGA-A'},
        {id: 'Malaysia-MACP', name: 'MACP'},
        {id: 'Mexico-SACM', name: 'SACM'},
        {id: 'Nepal-MRCSN', name: 'Music Royalty Collection Society Nepal (MRCSN)'},
        {id: 'Netherlands-BUMA', name: 'BUMA'},
        {id: 'New Zealand-APRA', name: 'APRA'},
        {id: 'Norway-TONO', name: 'TONO'},
        {id: 'Panama-SPAC', name: 'SPAC'},
        {id: 'Peru-APDAYC', name: 'APDAYC'},
        {id: 'Philippines-FILSCAP', name: 'FILSCAP'},
        {id: 'Poland-ZAIKS', name: 'ZAIKS'},
        {id: 'Puerto Rico-ACEMLA', name: 'ACEMLA'},
        {id: 'Romania-UCMR', name: 'UCMR'},
        {id: 'Russia-RAO', name: 'RAO'},
        {id: 'Serbia-SOKOJ', name: 'SOKOJ'},
        {id: 'Singapore-COMPASS', name: 'COMPASS'},
        {id: 'Slovakia-SOZA', name: 'SOZA'},
        {id: 'South Africa-SAMRO', name: 'Southern African Music Rights Organisation (SAMRO)'},
        {id: 'South Korea-KOMCA', name: 'KOMCA, KOSCAP'},
        {id: 'Spain-SGAE', name: 'SGAE'},
        {id: 'Sweden-STIM', name: 'STIM'},
        {id: 'Switzerland-SUISA', name: 'SUISA'},
        {id: 'Taiwan-MUST', name: 'MUST'},
        {id: 'Thailand-MCT', name: 'MCT'},
        {id: 'Trinidad-COTT', name: 'COTT'},
        {id: 'Ukraine-UACRR', name: 'UACRR'},
        {id: 'United Kingdom-PRS', name: 'PRS, PPL'},
        {id: 'United States of America-SPACEM', name: 'ASCAP, BMI, SESAC, ACEMLA (SPACEM)'},
        {id: 'Uruguay-AGADU', name: 'AGADU'},
        {id: 'Venezuela-SACVEN', name: 'SACVEN'},
      ],
      artists_count_options: [
        {id: 0, name: 'None'},
        {id: 1, name: '1-2'},
        {id: 3, name: '3-5'},
        {id: 6, name: '6-10+'},
      ],
      standard_brand_type_options: [
        'Clothing Brand (Streetwear, Luxury)',
        'Service Brand (Mixing/Mastering Engineers, Graphic Designers, Manufacturing)',
        'Lifestyle Brand (Culture, Sports, Promoters, Food & Beverage)',
        'Broadcasting Brand (Podcasts, TV/Movie, Personality)',
        'Technology Brand (Software, Video Game)',
        'Retail Brand (Record Stores, Coffee Shop)'
      ],
      employees_count_options: [
        {id: 1, name: '1-5'},
        {id: 6, name: '6-10'},
        {id: 11, name: '10+'},
      ],
      years_in_business_options: [
        {id: 0, name: '0'},
        {id: 1, name: '1-5'},
        {id: 6, name: '6-10+'},
      ],
      products_count_options: [
        {id: 0, name: 'None'},
        {id: 1, name: '1-10'},
        {id: 11, name: '11-50'},
        {id: 51, name: '50+'},
      ],
      annual_income_options: [
        {id: 0, name: 'None'},
        {id: 5000, name: '$5k-$24k'},
        {id: 25000, name: '$25k-$80k'},
        {id: 80000, name: '$81k-$100k'},
        {id: 100000, name: '$100k-$249k'},
        {id: 250000, name: '$250k-$1m'},
        {id: 1000000, name: '$1m-$10m'},
        {id: 10000000, name: '$10m+'},
      ],
      isPageReady: false
    }
  },

  computed: {
    country_options () {
      return Countries
    },
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
