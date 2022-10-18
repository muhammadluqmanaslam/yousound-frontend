import _ from 'lodash'
import moment from 'moment'
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
  UserAnnualIncomeOptions,
} from '@/helper'

import profileItem from '@/components/profileitem'

export default {
  components: {
    profileItem,
  },

  props: {
    item: {
      type: Object,
      required: true,
    },

    dismiss: {
      type: Function,
      required: true,
    },

    approveButtonAction: {
      type: Function,
      required: true,
    },

    denyButtonAction: {
      type: Function,
      required: true,
    },
    activeTab: null,
  },

  data() {
    return {
      main_genres: [],
      sub_genres: [],
    }
  },

  computed: {
    country_options() {
      return Countries
    },

    boolean_options() {
      return UserBooleanOptions
    },

    userMainGenreName() {
      return _.get(this.item, 'genre.name')
    },

    userSubGenreName() {
      const sub_genre_id = _.get(this.item, 'sub_genre_id')
      if (sub_genre_id) {
        const sub_genre = _.find(this.sub_genres, (g) => {
          return g.id == sub_genre_id
        })
        return _.get(sub_genre, 'name', '')
      } else {
        return ''
      }
    },

    userReleasedAlbumsCount() {
      return this.getNameById(
        UserReleasedAlbumsCountOptions,
        this.item.released_albums_count
      )
    },

    userYearsSinceFirstReleased() {
      return this.getNameById(
        UserYearsInBusinessOptions,
        this.item.years_since_first_released
      )
    },

    userAnnualIncomeOnMerchSales() {
      return this.getNameById(
        UserAnnualIncomeOnMerchSalesOptions,
        this.item.annual_income_on_merch_sales
      )
    },

    userAnnualPerformancesCount() {
      return this.getNameById(
        UserAnnualPerformancesCountOptions,
        this.item.annual_performances_count
      )
    },

    userPerformanceRightsOrganization() {
      return this.getNameById(
        UserPerformanceRightsOrganizationOptions,
        this.item.performance_rights_organization
      )
    },

    userArtistsCount() {
      return this.getNameById(UserArtistsCountOptions, this.item.artists_count)
    },

    userEmployeesCount() {
      return this.getNameById(
        UserEmployeesCountOptions,
        this.item.employees_count
      )
    },

    userYearsInBusiness() {
      return this.getNameById(
        UserYearsInBusinessOptions,
        this.item.years_in_business
      )
    },

    userProductsCount() {
      return this.getNameById(
        UserProductsCountOptions,
        this.item.products_count
      )
    },

    userAnnualIncome() {
      return this.getNameById(UserAnnualIncomeOptions, this.item.annual_income)
    },

    userFullName() {
      return `${_.get(this.item, 'first_name', '')}, ${_.get(
        this.item,
        'last_name',
        ''
      )}`
    },

    userAge() {
      const y = parseInt(_.get(this.item, 'year_of_birth', ''))
      return y > 0 ? moment().year() - y : '--'
    },

    userFullAddress() {
      return `${_.get(this.item, 'city', '')}, ${_.get(
        this.item,
        'country',
        ''
      )}`
    },
  },

  created() {
    this.main_genres = this.$store.state.app.genres
    this.sub_genres = _.flatMap(this.$store.state.app.genres, 'children')
  },

  methods: {
    getNameById(options, id) {
      return _.get(
        _.find(options, (o) => o.id == id),
        'name',
        ''
      )
    },
  },
}
