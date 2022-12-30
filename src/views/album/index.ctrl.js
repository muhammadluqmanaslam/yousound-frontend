/* global $:true */

import _ from 'lodash'
import AuthService from '@/services/auth'
import { mapActions } from 'vuex'
import { MyEvents, Utils } from '@/helper'
import AlbumService from '@/services/album'

import SearchService from '@/services/search'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

import genreDialog from '@/components/genre_dialog'
import trackCard from '@/components/trackcard'
import contentTopHeader from '@/components/contentTopHeader'
import discoverNav from '@/components/discoverNav'
import UserFollowBtn from "@/components/userFollowBtn";

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
    VueSlickCarousel,
    UserFollowBtn
  },

  data() {
    return {
      slickOptions: {
      infinite:false,
      slidesToShow: 5,
      slidesToScroll: 5,
      dots: false,
      cssEase: 'linear',
      arrows: true,
      nextArrow: `<button class="slider-move-icons next-icon"> ${filterArrowDownString} </button>`,
      prevArrow: `<button class="slider-move-icons next-icon"> ${filterArrowDownString} </button>`,
      //autoplay: true,
      //autoplaySpeed: 6000,
    },
      activeGenre: 'any',
      activeTab: '',
      tabs: [
        { id: 'recommended', title: 'Trending' },
        { id: 'new', title: 'New' },
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
      albumData: [],
      recommendedAlbums: [],
      newAlbums: [],
      popularAlbums: [],
      mainAlbum: {},
      viewAllNew: false,
      viewAllPopular: false,
      viewAllTrending: false,
      chosenGenres: [],
      buttonHover: false,
    }
  },

  computed: {
    followButtonText() {
      if (this.mainAlbum.user.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    },

    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentUser() {
      if (this.$store.state.auth.user) {
        this.fetchGenres()
      }
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
  	this.$root.$on(MyEvents.USER_FOLLOW, this.setFollowingStatus)
    // if (!this.currentUser) {
    //   AuthService.clearTokenAndUserInfo()
    //   this.$router.push({ path: '/login' })
    //   return
    // }

    // this.seed = parseInt(Date.now() * Math.random())
    this.seed = Math.random()
    const tab = this.$route.hash.substr(1)
    this.setTab(tab)
    // this.filterByGenre({id: 'any', name: 'All'})

  },

  beforeDestroy() {
    this.$root.$off(MyEvents.USER_FOLLOW, this.setFollowingStatus)
  },

  methods: {
    ...mapActions({
      setPlaylist: 'player/setPlaylist',
      setPlaylistIndex: 'player/setListIndex',
      setTrackIndex: 'player/setTrackIndex',
      setPlaying: 'player/setPlayingStatus',
    }),

    setFollowingStatus(userId, isFollowing) {
      if (this.mainAlbum.user && this.mainAlbum.user.id === userId) {
        this.mainAlbum.user.is_following = isFollowing
      }
    },

    fetchGenres() {
      this.chosenGenres = []
      const genres = _.cloneDeep(this.$store.state.app.genres)
      let hiddenGenres = _.keyBy(this.$store.state.auth.user.hidden_genres, 'id')

      _.each(genres, (genre) => {
        _.each(genre.children, (child) => {
          if (hiddenGenres[child.id]) {
            if (!(this.chosenGenres.includes(genre))) {
              this.chosenGenres.push(genre)
            }
          }
        })
      })
    },

    displayNewTracks() {
      this.viewAllNew = true
      this.viewAllPopular = false
      this.viewAllTrending = false
      this.newAlbums = []
      if (this.currentUser) {
        let genre_ids = this.currentUser.hidden_genres.map(genre => genre.id)

        if (genre_ids.length > 0) {
          _.each(this.albumData.new, (newAlbum) => {
            if (newAlbum.genres.length > 0 && genre_ids.includes(newAlbum.genres[0].id)) {
              this.newAlbums.push(newAlbum)
            }
          })
        } else {
          this.newAlbums = this.albumData.new
        }
      } else {
        this.newAlbums = this.albumData.new
      }
    },

    displayPopularTracks() {
      this.viewAllNew = false
      this.viewAllPopular = true
      this.viewAllTrending = false
      this.popularAlbums = []
      if (this.currentUser) {
        let genre_ids = this.currentUser.hidden_genres.map(genre => genre.id)
        if (genre_ids.length > 0) {
          _.each(this.albumData.popular, (popularAlbum) => {
            if (popularAlbum.genres.length > 0 && genre_ids.includes(popularAlbum.genres[0].id)) {
              this.popularAlbums.push(popularAlbum)
            }
          })
        } else {
          this.popularAlbums = this.albumData.popular
        }
      } else {
        this.popularAlbums = this.albumData.popular
      }
    },

    displayTrendingTracks() {
      this.viewAllNew = false
      this.viewAllPopular = false
      this.viewAllTrending = true
      this.recommendedAlbums = []
      if (this.currentUser) {
        let genre_ids = this.currentUser.hidden_genres.map(genre => genre.id)
        if (genre_ids.length > 0) {
          _.each(this.albumData.recommended, (recommendedAlbum) => {
            if (recommendedAlbum.genres.length > 0 && genre_ids.includes(recommendedAlbum.genres[0].id)) {
              this.recommendedAlbums.push(recommendedAlbum)
            }
          })
        } else {
          this.recommendedAlbums = this.albumData.recommended
        }
      } else {
        this.recommendedAlbums = this.albumData.recommended
      }
    },

    isActiveTab(tab) {
      return this.activeTab === tab
    },

    changeMainAlbum(selectedAlbum) {
      this.mainAlbum = selectedAlbum
    },

    repostAlbum() {
      AlbumService.repostAlbum(this.mainAlbum.id)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'You added ' + this.mainAlbum.name + ' album in your collection.',
          ])
        })
        .catch((e) => {
          console.log(e)
          this.$store.dispatch(
            "error/showErrorToast",
            e.body.errors || [e.body]
          );
        })
    },

    isPlaying() {
      return (
        this.$store.state.player.isPlaying &&
        _.get(
          this.$store.state.player.list[this.$store.state.player.listIndex],
          'id'
        ) === this.mainAlbum.id
      )
    },

    pauseSong() {
      this.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
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
      const api_response = this.currentUser != null ? SearchService.searchDiscover(params) : SearchService.searchDiscoverPublicUser(params)
      api_response.then((response) => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.feeds = this.feeds.concat(response.body.new)
        this.albumData = response.body
        this.recommendedAlbums = response.body.recommended.slice(0, 10)
        this.mainAlbum = this.recommendedAlbums[0]
        this.newAlbums = response.body.new.slice(0,10);
        this.popularAlbums = response.body.popular.slice(0, 10);
        this.isPageReady = true
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
          { id: 'any', name: 'All' },
        ].concat(genres)

        this.page_index = response.body.pagination.current_page
        this.total_pages = response.body.pagination.total_pages

        if (page === 1) {
          Promise.all([
            this.currentUser != null ? SearchService.searchDiscover(_.extend(params, { page: 2 })) : SearchService.searchDiscoverPublicUser(_.extend(params, { page: 2 })),
            this.currentUser != null ? SearchService.searchDiscover(_.extend(params, { page: 3 })) : SearchService.searchDiscoverPublicUser(_.extend(params, { page: 3 })),
            this.currentUser != null ? SearchService.searchDiscover(_.extend(params, { page: 4 })) : SearchService.searchDiscoverPublicUser(_.extend(params, { page: 4 })),
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
        console.log("======================", this.isPageReady)
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

    playSong() {
      if (
        this.$store.state.player.isPaused &&
        this.$store.getters['player/currentAlbum'] &&
        this.$store.getters['player/currentAlbum'].id == this.mainAlbum.id
      ) {
        this.$root.$emit(MyEvents.AUDIO_PLAYER_REPLAY)
      } else {
        this.setPlaylist([_.cloneDeep(this.mainAlbum)])
        this.setPlaylistIndex(0)
        this.setPlaying(true)
        this.$root.$emit(MyEvents.AUDIO_PLAYER_PLAY)
      }
    },
  },

  mounted() {},
}
