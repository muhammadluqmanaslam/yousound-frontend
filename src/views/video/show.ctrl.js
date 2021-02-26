import StreamService from '@/services/stream'
import { StreamStatuses } from '@/helper'

export default {
  components: {},

  data() {
    return {
      stream: {},
      isPageReady: false,
    }
  },

  computed: {},

  // watch: {
  //   '$route' (toPath, fromPath) {
  //   }
  // },

  created() {
    this.$store.dispatch('navigator/goNextState', {
      page: 'video',
      tab: 'show',
    })
  },

  methods: {
    loadVideo(videoId) {
      StreamService.getStream(videoId)
        .then((res) => {
          if (res.body.status === StreamStatuses.ARCHIVED) {
            this.stream = res.body
          } else {
            this.$router.push({ path: '/video' })
          }
        })
        .catch((e) => {
          console.log('getStream', e)
        })
    },
  },

  watch: {
    $route(toPath, fromPath) {
      const videoId = this.$route.params.videoId
      console.log('vidoe/show watch', videoId)
      this.loadVideo(videoId)
    },
  },
}
