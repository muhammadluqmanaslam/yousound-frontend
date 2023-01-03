// import { VideoGenres } from '@/helper'
import { MyEvents, Utils } from '@/helper'
import StreamService from '@/services/stream'
import VideoBox from '@/components/video_box'
import contentTopHeader from '@/components/contentTopHeader'
import discoverNav from '@/components/discoverNav'
// import VideoDetailBox from '@/components/video_detail_box'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
// import demoVideo from '../../assets/demo-video.mp4'
import logoutModal from '../../views/LogoutModal'
import UserFollowBtn from "@/components/userFollowBtn";

export default {
  props: {
    isComp: Boolean,
    listLimit: Number,
  },
  components: {
    VideoBox,
    contentTopHeader,
    discoverNav,
    VueSlickCarousel,
    logoutModal,
    UserFollowBtn,
  },

  data() {
    return {
      slickOptions: {
        infinite:false,
        slidesToShow: 4,
        slidesToScroll: 4,
        dots: false,
        cssEase: 'linear',
        arrows: true,
      },
      // demoVideo: demoVideo,
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
      selectedVideo: null,
      viewAllTrendingVideos: false,
      show_logout_modal: false,
      show_modalCard1: false,
      show_modalCard2: false,
      show_modalCard3: false,
      show_modalCard4: false,
      bgDemoImg: require('../../assets/tile-1.jpeg'),
      spotlightVideoSource: null,
      videoLoading: require('../../assets/loading.gif'),
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
    available_genres() {
      let genres = [{ id: 0, name: 'All' }]
      if (this.currentUser != null) {
        this.videoGenres.forEach((vg) => {
          const g = this._.find(this.$store.state.app.genres, { name: vg })
          genres.push({ id: g.id, name: g.name })
        })
      }
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
    beforeDestroy() {
      this.$root.$off(MyEvents.USER_FOLLOW, this.setFollowingStatus)
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
    setFollowingStatus(userId, isFollowing) {
      if (this.mainAlbum.user && this.mainAlbum.user.id === userId) {
        this.mainAlbum.user.is_following = isFollowing
      }
    },
    verifyUser() {
      if (this.currentUser) {
        this.$router.push({name: 'VideoShow', params: { videoId: this.selectedVideo.id }})
      } else {
        StreamService.getSpotlightStream(this.selectedVideo.user.id)
          .then((response) => {
            console.log("response", response)
            this.spotlightVideoSource = response.body.mp_channel_1_ep_1_id
            if (this.currentUser == null) {
              this.show_modalCard3 = true
            } else {
              this.show_modalCard4 = true
            }
          })
          .catch((e) => {
            if (this.currentUser == null) {
              this.show_modalCard1 = true
            } else {
              this.show_modalCard2 = true
            }
          })
      }
    },

    repostItem() {
      StreamService.repostStream(this.selectedVideo.id)
      .then((res) => {
        this.$store.dispatch('error/showSuccessToast', [
          'You just added ' + this.selectedVideo.name + ' stream in your collection.',
        ])
      })
      .catch((e) => {
        this.$store.dispatch(
          'error/showErrorToast',
          e.body.errors || [e.body] || [e.body.error]
        )
      })
    },

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

    changeSelectedVideo(video) {
      this.selectedVideo = video
    },

    displayAllTrendingVideos() {
      this.trendingVideos = this.videos
      this.viewAllTrendingVideos = true
    },

    loadData(tab, page) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        genre_id: tab,
        only_follows: this.only_follows,
        page: page,
        per_page: this.items_per_page,
      }

      const api_response = this.currentUser != null ? StreamService.getStreams(params) : StreamService.getStreamsPublicUsers(params)
      api_response.then((response) => {
        this.videos = this.videos.concat(response.body.streams)

        // this will return a a prop limit if available
        this.videos = this.videos.slice(0, this.listLimit || this.videos.length)
        this.selectedVideo = this.videos[0]
        this.trendingVideos = this.videos.slice(0, 10)
        this.isPageReady = true
        // this.videos.filter((v) => )
        // this.videos = [ ...this.videos, ...this.videos]
        console.log(this.videos)
        this.pagination = response.body.pagination
        this.videoGenres = response.body.genres
        this.$store.dispatch('error/showLoadingActivity', false)
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
    this.$root.$on(MyEvents.USER_FOLLOW, this.setFollowingStatus)

    const paramFilter = this.$route.params.filter || ''

    this.$store.dispatch('navigator/goNextState', { page: 'video', tab: '' })
    this.loadData(this.activeTab, this.pagination.current_page)

    if (paramFilter) {
      this.selectedTab = paramFilter
      this.onTab(this.selectedTab)
    }
    
  },
}
