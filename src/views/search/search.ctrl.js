import SearchService from '@/services/search'

import artistItem from '@/components/artistitem'
import trackCard from '@/components/trackcard'
import productCard from '@/components/productcard'
import videoCard from '@/components/videocard'

export default {
  components: {
    artistItem,
    trackCard,
    productCard,
    videoCard
  },

  data() {
    return {
      active_tab: 'albums',
      tabs: [
        { id: 'albums', title: 'Albums' },
        // { id: 'playlists', title: 'Playlists' },
        { id: 'products', title: 'Products' },
        { id: 'live_video', title: 'Live Videos' },
        { id: 'users', title: 'Users' }
      ],
      page_index: 1,
      total_pages: 1,
      items_per_page: 6 * 4,
      genres: [],
      selected_genre: null,
      keyword: '',
      result: {
        users: [],
        albums: [],
        playlists: [],
        products: [],
        streams: []
      },
      isPageReady: false
    }
  },

  computed: {
    filtered_feeds () {
      if (this.selected_genre) {
        return _.filter(this.albums, (album) => (album.genre_ids.indexOf(this.selected_genre.id) > -1))
      } else {
        return this.albums
      }
    }
  },

  watch: {
    '$route' (to, from) {
      this.keyword = this.$route.query.q
      this.init()
    }
  },

  created() {
    this.$store.dispatch('navigator/goNextState', { page: 'search', tab: this.active_tab })
    this.keyword = this.$route.query.q
    this.init()
  },

  methods: {
    isActiveTab(tab) {
      return this.active_tab == tab
    },

    searchResultCount(tab) {
      switch (tab) {
        case 'albums':
          return this.result.albums.length
        case 'playlists':
          return this.result.playlists.length
        case 'products':
          return this.result.products.length
        case 'live_video':
          return this.result.streams.length
        case 'users':
          return this.result.users.length
        default:
          return 0
      }
    },

    init () {
      this.page_index = 1
      this.total_pages = 1
      this.items_per_page = 6 * 5
      this.genres = [{
        id: 'any',
        name: 'Any genre'
      }]
      this.selected_genre = null
      this.users = []
      this.albums = []
      this.products = []
      this.search()
    },

    // search () {
    //   let tab = 'albums'
    //   SearchService.searchGlobal({ q: this.keyword }).then(response => {
    //     this.users = response.body.users || []
    //     this.products = response.body.products || []
    //     const albums = response.body.albums
    //     for (let album_index in albums) {
    //       const album = albums[album_index]
    //       var genre_ids = []
    //       for (let new_index in album.genres) {
    //         let add_flag = true
    //         const genre_id = album.genres[new_index].id
    //         genre_ids.push(genre_id)
    //         for (let genre_index in this.genres) {
    //           if (genre_id === this.genres[genre_index].id) {
    //             add_flag = false
    //             break
    //           }
    //         }
    //         if (add_flag) {
    //           this.genres.push(album.genres[new_index])
    //         }
    //       }
    //       album.genre_ids = genre_ids.join(',')
    //       this.albums.push(album)
    //     }
    //     if (this.albums.length === 0 && this.users.length > 0) {
    //       tab = 'users'
    //     }
    //     this.onTab(tab)
    //   }).catch(e => {
    //     this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
    //   })
    // },

    search () {
      this.$store.dispatch('error/showLoadingActivity', true)
      SearchService.searchGlobal({ q: this.keyword }).then(response => {
        this.result = response.body
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    filterByGenres (genre) {
      $('#genre_selector .btn__content').html(genre.name + '<i class="material-icons icon theme--dark">keyboard_arrow_down</i>')
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

    loadMore () {
      this.page_index += 1
      this.loadFeeds(this.$store.state.navigator.current.tab)
    },

    onTab (tab) {
      this.active_tab = tab
      this.$store.dispatch('navigator/goNextState', { page: 'search', tab: this.active_tab })
      // if (tab === 'albums') {
      //   $('#genre_selector').show()
      // } else {
      //   $('#genre_selector').hide()
      // }
      // console.log('onTab', this.active_tab, this.users)
    }
  },

  mounted () {
  }
}
