/* global $:true */

import _ from 'lodash'
import AuthService from '@/services/auth'
import SearchService from '@/services/search'

import genreDialog from '@/components/genre_dialog'
import trackCard from '@/components/trackcard'
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
    genreDialog,
    trackCard,
    contentTopHeader,
    discoverNav,
  },

  data() {
    return {
      activeTab: '',
      tabs: [
        { id: 'recommended', title: 'Staff Picks' },
        { id: 'new', title: 'New Releases' },
        { id: 'popular', title: 'Popular' },
        // { id: 'playlist', title: 'Playlists' },
      ],
      seed: '',
      show_genre_selector_dialog: false,
      got_genre_tooltip: false,
      hover_on_genre_button: false,
      hover_on_genre_tooltip: false,
      page_index: 1,
      total_pages: 1,
      items_per_page: 1 * 50,
      genres: [],
      selected_genre: null,
      categories: [],
      selected_category: null,
      feeds: [],
      isPageReady: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    showGenreTooltip() {
      return (
        !this.got_genre_tooltip &&
        (this.hover_on_genre_button || this.hover_on_genre_tooltip)
      )
    },

    selectedGenreName() {
      return _.get(this.selected_genre, 'name', 'All')
    },

    selectedCategoryName() {
      return _.get(this.selected_category, 'name', 'All Categories')
    },

    filtered_feeds() {
      if (this.selected_genre) {
        const feeds = _.filter(this.feeds, (feed) =>
          _.find(feed.genres, (genre) => genre.id === this.selected_genre.id)
        )
        // this will return a a prop limit if available
        return feeds.slice(0, this.listLimit || this.feeds.length)
      } else {
        // this will return a a prop limit if available
        return this.feeds.slice(0, this.listLimit || this.feeds.length)
      }
    },
  },

  watch: {
    $route(toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      this.setTab(tab)
    },
  },

  created() {
    if (!this.currentUser) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    // this.seed = parseInt(Date.now() * Math.random())
    this.seed = Math.random()
    const tab = this.$route.hash.substr(1)
    this.setTab(tab)
  },

  methods: {
    isActiveTab(tab) {
      return this.activeTab === tab
    },

    loadFeeds(tab, page) {
      const vm = this
      if (page === 1) {
        this.isPageReady = false
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      const genre = _.get(this.selected_genre, 'id', 'any')
      const category = _.get(this.selected_category, 'id', 'any')
      const params = {
        filter: tab,
        genre: genre,
        category: category,
        page: page,
        per_page: this.items_per_page,
      }
      if (tab !== 'recommended') {
        params['seed'] = this.seed
      }
      SearchService.searchDiscover(params)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.feeds = this.feeds.concat(response.body.albums)
          const genres = _.chain(this.feeds)
            .map('genres')
            .flatMap()
            .keyBy('id')
            .map((v, k) => {
              return v
            })
            .sortBy('name')
            .value()
          this.genres = [
            // { id: 'go_to_filters', name: 'Set Genre Filters' },
            { id: 'any', name: 'All genre' },
          ].concat(genres)

          this.page_index = response.body.pagination.current_page
          this.total_pages = response.body.pagination.total_pages

          if (page === 1) {
            Promise.all([
              SearchService.searchDiscover(_.extend(params, { page: 2 })),
              SearchService.searchDiscover(_.extend(params, { page: 3 })),
              SearchService.searchDiscover(_.extend(params, { page: 4 })),
            ]).then((values) => {
              vm.feeds = vm.feeds.concat(
                values[0].body.albums,
                values[1].body.albums,
                values[2].body.albums
              )
              const genres = _.chain(vm.feeds)
                .map('genres')
                .flatMap()
                .keyBy('id')
                .map((v, k) => {
                  return v
                })
                .sortBy('name')
                .value()
              vm.genres = [{ id: 'any', name: 'All' }].concat(genres)
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

    openGenreSelectorDialog() {
      this.show_genre_selector_dialog = true
    },

    closeGenreSelectorDialog() {
      this.show_genre_selector_dialog = false
      this.setTab(this.activeTab)
    },

    filterByGenre(genre) {
      $('#genre_selector .btn__content').html(
        genre.name + filterArrowDownString
      )
      switch (genre.id) {
        // case 'go_to_filters':
        //   // this.$router.push({ path: '/settings#genre-filter' })
        //   this.openGenreSelectorDialog()
        //   break
        case 'any':
          this.selected_genre = null
          break
        default:
          this.selected_genre = genre
      }
    },

    filterByCategory(category) {
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
      this.loadFeeds(this.activeTab, 1)
    },

    loadMore() {
      // this.page_index += 1
      this.loadFeeds(this.activeTab, this.page_index + 1)
    },

    hideAlbum(album) {
      _.remove(this.feeds, (item) => {
        return item.id === album.id
      })
      const arr = this.feeds.slice()
      this.feeds = arr
    },

    onTab(tab) {
      if (this.isComp) {
        this.$router.push({name: 'AlbumIndex', params: {filter: tab}})
      } else {
        this.$router.push({
          path: this.$route.path,
          hash: tab,
        })
      }
    },

    setTab(tab) {
      if (!tab) {
        tab = 'recommended'
      }

      const paramFilter = this.$route.params.filter || ''

      if (paramFilter) {
        this.activeTab = paramFilter
      } else {
        this.activeTab = tab
      }

      // console.log(tab, this.activeTab)
      this.page_index = 1
      this.total_pages = 1
      this.feeds = []
      this.selected_genre = null
      this.selected_category = null
      this.$store.dispatch('navigator/goNextState', {
        page: 'album',
        tab: tab,
      })
      $('#genre_selector .btn__content').html(
        'Any genre' + filterArrowDownString
      )
      this.$nextTick(() => {
        this.loadFeeds(this.activeTab, 1)
      })
    },
  },

  mounted() {},
}
