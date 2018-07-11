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
        {
          
          id: 'recommended',
          title: 'Recommended'
        },
        {
          id: 'new',
          title: 'Albums'
        },
        {

          id: 'merch',
          title: 'Merch'
        }
        /* Uncomment this when there's more users, also add "Live Video" tab
          id: 'playlist',
          title: 'Playlists'
        } */
      ],
      page_index: 1,
      total_pages: 1,
      items_per_page: 5 * 5,
      genres: [],
      selected_genre: null,
      products:[],
      feeds: [],
      isPageReady: false
    }
  },

  computed: {
    filtered_feeds () {
      if (this.selected_genre) {
        return _.filter(this.feeds, (feed) => (feed.genre_ids.indexOf(this.selected_genre.id) > -1))
      } else {
        return this.feeds
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
        } else {
          const feeds = response.body.albums
          for (let album_index in feeds) {
            const feed = feeds[album_index]
            var genre_ids = []
            for (let new_index in feed.genres) {
              let add_flag = true
              const genre_id = feed.genres[new_index].id
              genre_ids.push(genre_id)
              for (let genre_index in this.genres) {
                if (genre_id === this.genres[genre_index].id) {
                  add_flag = false
                  break
                }
              }
              if (add_flag) {
                this.genres.push(feed.genres[new_index])
              }
            }
            feed.genre_ids = genre_ids.join(',')
            this.feeds.push(feed)
          }
        }
        this.page_index = response.body.pagination.current_page
        this.total_pages = response.body.pagination.total_pages
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (e.status === 401) {
        } else {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        }
      })
    },

    filterByGenres(genre) {
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

    loadMore() {
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
        {
          id: 'go_to_filters',
          name: 'Set Genre Filters'
        },
        {
          id: 'any',
          name: 'Any genre'
        },
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
