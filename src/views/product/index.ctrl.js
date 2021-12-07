/* global $:true */

import _ from 'lodash'
import AuthService from '@/services/auth'
import SearchService from '@/services/search'

import productCard from '@/components/productcard'
import contentTopHeader from '@/components/contentTopHeader'
import discoverNav from '@/components/discoverNav'

const filterArrowDownString =
  '<i class="material-icons icon icon--right theme--dark">keyboard_arrow_down</i>'

export default {
  props: {
    isComp: Boolean,
    listLimit: Number,
  },
  components: {
    productCard,
    contentTopHeader,
    discoverNav,
  },

  data() {
    return {
      selectedTab: 'any',
      activeTab: '',
      seed: '',
      page_index: 1,
      total_pages: 1,
      items_per_page: 1 * 50,
      categories: [],
      selected_category: null,
      products: [],
      feeds: [],
      isPageReady: false,
      tabs: [
        { id: 'new', title: 'New Arrivals' },
      ],
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    filtered_feeds() {
      return this.feeds
    },
  },

  created() {
    if (!this.currentUser) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    this.$store.dispatch('navigator/goNextState', {
      page: 'product',
      tab: '',
    })
    // this.seed = parseInt(Date.now() * Math.random())
    this.seed = Math.random()
    this.loadFeeds(1)

    // set active tab
    if (this.pageName) {
      this.activeTab = this.pageName
    }

    const paramFilter = this.$route.params.filter || ''
    if (paramFilter) {
      this.activeTab = paramFilter
      this.onTab(this.activeTab)
    }

    this.filterByCategory(this.selectedTab)
  },

  methods: {
    isActiveTab(tab) {
      return this.activeTab === tab
    },

    onTab(tab) {
      if (this.isComp) {
        this.$router.push({ name: 'ProductIndex', params: { filter: tab } })
      } else {
        this.$router.push({
          path: this.$route.path,
          hash: tab,
        })
      }
    },

    filterVideos(filter) {
      console.log(filter)
    },

    isActiveCategory(category) {
      return _.get(this.selected_category, 'id', 'any') === category.id
    },

    loadFeeds(page) {
      const vm = this
      if (page === 1) {
        this.isPageReady = false
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      const genre = _.get(this.selected_genre, 'id', 'any')
      const category = _.get(this.selected_category, 'id', 'any')
      const params = {
        genre: genre,
        category: category,
        page: page,
        per_page: this.items_per_page,
        seed: this.seed,
      }

      SearchService.searchDiscover(params)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.products = this.products.concat(response.body.products)

          // this will return a a prop limit if available
          this.products = this.products.slice(0, this.listLimit || this.products.length)

          // const categories = _.chain(this.products).map('category').keyBy('id').map((v, k) => {return v}).sortBy('name').value()
          const categories = response.body.categories.map((c) => ({
            id: c,
            name: c,
          }))
          this.categories = [{ id: 'any', name: 'All' }].concat(categories)

          this.page_index = response.body.pagination.current_page
          this.total_pages = response.body.pagination.total_pages

          if (page === 1) {
            Promise.all([
              SearchService.searchDiscover(_.extend(params, { page: 2 })),
              SearchService.searchDiscover(_.extend(params, { page: 3 })),
              SearchService.searchDiscover(_.extend(params, { page: 4 })),
            ]).then((values) => {
              vm.products = vm.products.concat(
                values[0].body.products,
                values[1].body.products,
                values[2].body.products
              )

              // this will return a a prop limit if available
              vm.products = this.products.slice(0, this.listLimit || this.products.length)

              vm.page_index =
                values[2].body.pagination.total_pages > 4
                  ? 4
                  : values[2].body.pagination.total_pages

              vm.isPageReady = true
            })
          }
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          // this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          console.log('discover error', e)
        })
    },

    filterByCategory(category) {
      console.log(category)
      if (this.selected_category === category) return

      $('#category_selector .btn__content').html(
        category.name + filterArrowDownString
      )
      switch (category.id) {
        case 'any':
          this.selected_category = null
          break
        default:
          this.selected_category = category
      }

      // this.page_index = 1
      this.total_pages = 1
      this.products = []
      this.loadFeeds(1)
    },

    loadMore() {
      // this.page_index += 1
      this.loadFeeds(this.page_index + 1)
    },
  },

  mounted() {},
}
