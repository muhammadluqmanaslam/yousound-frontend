// import { VideoGenres } from '@/helper'
import StreamService from '@/services/stream'
import VideoBox from '@/components/video_box'
import contentTopHeader from '@/components/contentTopHeader'
import discoverNav from '@/components/discoverNav'
// import VideoDetailBox from '@/components/video_detail_box'

export default {
  props: {
    isComp: Boolean,
    listLimit: Number,
  },
  components: {
    VideoBox,
    contentTopHeader,
    discoverNav,
  },

  data() {
    return {
      selectedTab: 0,
      activeTab: 0,
      only_follows: false,
      videos: [],
      items_per_page: 1 * 50,
      pagination: {
        current_page: 1,
        total_pages: 0,
      },
      videoGenres: [],
      isPageReady: false,
      tabs: [
        { id: 'new', title: 'New' },
        { id: 'popular', title: 'Popular' },
        { id: 'live', title: 'Live' },
      ],
    }
  },

  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    available_genres() {
      let genres = [{ id: 0, name: 'All' }]
      this.videoGenres.forEach((vg) => {
        const g = this._.find(this.$store.state.app.genres, { name: vg })
        genres.push({ id: g.id, name: g.name })
      })
      // const genres = this._.filter(this.$store.state.app.genres, (g) => (VideoGenres.indexOf(g.name) > -1))
      // console.log('available_genres', genres)
      return genres
    },

    selected_genre() {
      const genre =
        this._.find(this.available_genres, { id: this.activeTab }) ||
        this._.find(this.available_genres, { id: 0 })
      // console.log('selected_genre', this.available_genres, genre)
      return genre
    },

    currentUser() {
      return this.$store.state.auth.user
    },
  },

  watch: {
    $route(toPath, fromPath) {
      this.only_follows = toPath.hash.substr(1) === 'follows'
        // console.log('$route', this.only_follows)
      this.setTab(-1)
    },
  },

  methods: {
    isActiveTab(tab) {
      return this.selectedTab === tab
    },

    onTab(tab) {
      if (this.isComp) {
        this.$router.push({name: 'VideoIndex', params: {filter: tab}})
      } else {
        this.selectedTab = tab
        this.filterVideos(tab)
      }
    },

    filterVideos(filter) {
      console.log(filter)
    },

    loadData(tab, page) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        genre_id: tab,
        only_follows: this.only_follows,
        page: page,
        per_page: this.items_per_page,
      }
      StreamService.getStreams(params)
        .then((response) => {
          this.videos = this.videos.concat(response.body.streams)

          // this will return a a prop limit if available
          this.videos = this.videos.slice(0, this.listLimit || this.videos.length)

          // this.videos.filter((v) => )
          // this.videos = [ ...this.videos, ...this.videos]
          console.log(this.videos)
          this.pagination = response.body.pagination
          this.videoGenres = response.body.genres
          this.$store.dispatch('error/showLoadingActivity', false)
          this.isPageReady = true
        })
        .catch(() => {
          this.$store.dispatch('error/showLoadingActivity', false)
        })
    },

    loadMore() {
      this.loadData(this.pagination.current_page + 1)
    },

    setTab(tab) {
      if (this.activeTab !== tab) {
        this.activeTab = tab < 0 ? 0 : tab
        this.videos.length = 0
        this.pagination.current_page = 0
        this.loadData(this.activeTab, this.pagination.current_page)
      }
    },
  },

  created() {
    const paramFilter = this.$route.params.filter || ''

    this.$store.dispatch('navigator/goNextState', { page: 'video', tab: '' })
    this.loadData(this.activeTab, this.pagination.current_page)

    if (paramFilter) {
      this.selectedTab = paramFilter
      this.onTab(this.selectedTab)
    }
    
  },
}
