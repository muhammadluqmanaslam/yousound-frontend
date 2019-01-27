import debounce from 'lodash/debounce'

import SearchService from '@/services/search'
import albumCard from './components/album_card'
import playlistCard from './components/playlist_card'
import productCard from './components/product_card'
import videoCard from './components/video_card'

export default {
  components: {
    albumCard,
    playlistCard,
    productCard,
    videoCard
  },

  data () {
    return {
      seed: 0,
      page: 0,
      per_page: 5,
      no_more_results: false,
      result: {
        albums: [],
        playlists: [],
        products: [],
        streams: []
      }
    }
  },

  computed: {
    isLoading () {
      return this.$store.state.error.isLoading
    }
  },

  created () {
    if (this.$store) {
      this.$store.dispatch('navigator/goNextState', { page: 'main_landing', tab: '' })
      this.no_more_results = false
      this.seed = Math.random()
      this.page = 0
      this.loadMore()
    }
  },

  methods: {
    loadMore () {
      if (this.no_more_results || this.isLoading) {
        return
      }

      this.$store.dispatch('error/showLoadingActivity', true)
      this.page = this.page + 1
      const params = {
        seed: this.seed,
        page: this.page,
        per_page: this.per_page
      }
      SearchService.searchLanding(params).then(response => {
        this.result.albums = this.result.albums.concat(response.body.albums)
        this.result.playlists = this.result.playlists.concat(response.body.playlists)
        this.result.products = this.result.products.concat(response.body.products)
        this.result.streams = this.result.streams.concat(response.body.streams)

        if (!response.body.albums.length && !response.body.playlists.length && !response.body.products.length && !response.body.streams.length) {
          this.no_more_results = true
        }

        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  },

  mounted () {
    const vm = this
    let showMainHeader = true
    const mainHeader = $('.main__header')
    let panelHeader = $('.panel__header')
    // const scrollHeight = $(document).height() - $(window).height()

    $(window).scroll(function (event) {
      var _curTop = $(window).scrollTop()
      // console.log(scrollHeight, _curTop)
      if (_curTop < 120) {
        // toggleMainHeader(true)
        panelHeader.removeClass('fixed')
        mainHeader.css({height: '120px'})
      } else {
        // toggleMainHeader(false)
        panelHeader.addClass('fixed')
        panelHeader.css({width: mainHeader.width() + 'px'})
        mainHeader.css({height: '0px'})
      }

      if (_curTop > $(document).height() - $(window).height() - 30) {
        vm.loadMore()
      }
    })
  }
}
