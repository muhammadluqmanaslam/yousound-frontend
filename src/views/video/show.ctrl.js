import StreamService from '@/services/stream'
import CommentService from '@/services/comment'
import { StreamStatuses } from '@/helper'

export default {
  components: {},

  data() {
    return {
      stream: {},
      comments: [],
      isPageReady: false,
    }
  },

  computed: {},

  created() {
    this.$store.dispatch('navigator/goNextState', {
      page: 'video',
      tab: 'show',
    })
    this.loadData(this.$route.params.videoId)
  },

  methods: {
    loadData(videoId) {
      console.log('loading data...')
      Promise.all([
        StreamService.getStream(videoId),
        CommentService.getComments({
          commentable_type: 'Stream',
          commentable_id: videoId,
        }),
      ])
        .then((values) => {
          if (values[0].body.status === StreamStatuses.ARCHIVED) {
            this.stream = values[0].body
          } else {
            this.$router.push({ path: '/video' })
          }

          this.comments = values[1].body
        })
        .catch((e) => {
          console.log('video/show loadData error', e)
        })
    },
  },

  watch: {
    $route(toPath, fromPath) {
      const videoId = this.$route.params.videoId
      console.log('vidoe/show watch', videoId)
      this.loadData(videoId)
    },
  },
}
