import _ from 'lodash'
import AuthService from '@/services/auth'
import SearchService from '@/services/search'
import productCard from '@/components/productcard'
import trackCard from '@/components/trackcard'

export default {
  components: {
    productCard,
    trackCard
  },

  data() {
    return {
      activeTab: '',
      tabs: [
        { id: 'recommended', title: 'Recommended' },
        { id: 'new', title: 'Albums' },
        { id: 'merch', title: 'Merch' }
      ],
      page_index: 1,
      total_pages: 1,
      items_per_page: 5 * 5,
      genres: [],
      selected_genre: null,
      categories: [],
      selected_category: null,
      products:[],
      feeds: [],
      isPageReady: false
    }
  },

  computed: {
    filtered_feeds () {
      if (this.selected_genre) {
        return _.filter(this.feeds, (feed) => (
          _.find(feed.genres, (genre) => (genre.id == this.selected_genre.id))
        ))
      } else {
        return this.feeds
      }
    },

    filtered_products () {
      if (this.selected_category) {
        return _.filter(this.products, (product) => (
          product.category.id == this.selected_category.id
        ))
      } else {
        return this.products
      }
    }
  },

  watch: {
    '$route' (toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      this.setTab(tab)
    }
  },

  created () {
    if (!this.$store.state.auth.user) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    const tab = this.$route.hash.substr(1)
    this.setTab(tab)
  },

  methods: {
    loadFeeds(tab) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = new FormData()
      params.append('filter', tab)
      params.append('genre', 'any')
      params.append('page', this.page_index)
      params.append('per_page', this.items_per_page)
      SearchService.searchDiscover(params).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (tab === 'merch') {
          this.products = this.products.concat(response.body.products)
          const categories = _.chain(this.products).map('category').keyBy('id').map((v, k) => {return v}).sortBy('name').value()
          this.categories = [
            { id: 'any', name: 'Any category' },
          ].concat(categories)
        } else {
          this.feeds = this.feeds.concat(response.body.albums)
          const genres = _.chain(this.feeds).map('genres').flatMap().keyBy('id').map((v, k) => {return v}).sortBy('name').value()
          this.genres = [
            { id: 'go_to_filters', name: 'Set Genre Filters' },
            { id: 'any', name: 'Any genre' },
          ].concat(genres)
        }
        this.page_index = response.body.pagination.current_page
        this.total_pages = response.body.pagination.total_pages
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    filterByGenres (genre) {
      $('#genre_selector .btn__content').html(genre.name + '<i class="material-icons icon icon--right theme--dark">keyboard_arrow_down</i>')
      switch (genre.id) {
        case 'go_to_filters':
          this.$router.push({ path: '/settings#genre-filter' })
          break
        case 'any':
          this.selected_genre = null
          break
        default:
          this.selected_genre = genre
      }
    },

    filterByCategory (category) {
      $('#category_selector .btn__content').html(category.name + '<i class="material-icons icon icon--right theme--dark">keyboard_arrow_down</i>')
      switch (category.id) {
        case 'any':
          this.selected_category = null
          break
        default:
          this.selected_category = category
      }
    },

    loadMore () {
      this.page_index += 1
      this.loadFeeds(this.$store.state.auth.tab)
    },

    hideAlbum (album) {
      _.remove(this.feeds, (item) => {
        return item.id === album.id
      })
      const arr = this.feeds.slice()
      this.feeds = arr
    },

    onTab (tab) {
      this.$router.push({
        path: this.$route.path,
        hash: tab
      })
    },

    setTab (tab) {
      if (!tab)
        tab = 'recommended'

      // console.log(tab, this.activeTab)
      this.activeTab = tab
      this.page_index = 1
      this.total_pages = 1
      this.products = []
      this.feeds = []
      this.selected_genre = null
      this.genres = [
        { id: 'go_to_filters', name: 'Set Genre Filters' },
        { id: 'any', name: 'Any genre' },
      ]
      if (tab === 'merch') {
        this.$store.dispatch('navigator/goNextState', { page: 'merch', tab: tab })
      } else {
        this.$store.dispatch('navigator/goNextState', { page: 'discover', tab: tab })
        $('#genre_selector .btn__content').html('Any genre' + '<i class="material-icons icon icon--right theme--dark">keyboard_arrow_down</i>')
      }
      // const vm = this
      // setTimeout(function(){
      //   vm.loadFeeds(tab)
      // }, 200)
      this.$nextTick(() => {
        this.loadFeeds(tab)
      })
    }
  },

  mounted() {
  }
}
