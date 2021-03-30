import _ from 'lodash'
import moment from 'moment'
import UserService from '@/services/user'
import StreamService from '@/services/stream'
import CommentService from '@/services/comment'
// import ProfileService from '@/services/profile'
import { StreamStatuses } from '@/helper'
import UserTag from '@/components/user_tag'
import Chat from './components/chat'
import UserBox from './components/user_box'
import VideoBox from './components/video_box'
import VideoPlayer from './components/video_player'
import ArtistItem from '@/components/artistitem'
import ShareModal from '@/components/sharemodal'

export default {
  components: {
    ArtistItem,
    Chat,
    ShareModal,
    UserBox,
    UserTag,
    VideoBox,
    VideoPlayer,
  },

  data() {
    return {
      moment: moment,
      stream: {},
      comments: [],
      comments_pagination: {},
      accounts: [],
      videos: [],
      commentText: '',
      buttonHover: false,
      show_share_dialog: false,
      isPageReady: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    user() {
      return _.get(this.stream, 'user', {})
    },

    followButtonText() {
      if (this.user.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    },
  },

  created() {
    this.$store.dispatch('navigator/goNextState', {
      page: 'video',
      tab: 'show',
    })
    this.loadData(this.$route.params.videoId)
  },

  methods: {
    loadData(videoId) {
      this.isPageReady = false
      console.log('loading data...', videoId)
      Promise.all([
        StreamService.getStream(videoId),
        CommentService.getComments({
          commentable_type: 'Stream',
          commentable_id: videoId,
        }),
        StreamService.getSimilarStreams(videoId, {
          page: 1,
          per_page: 10,
        }),
      ])
        .then((values) => {
          if (
            [StreamStatuses.ARCHIVED, StreamStatuses.RUNNING].indexOf(
              values[0].body.status
            ) > -1
          ) {
            this.stream = values[0].body
          } else {
            this.$router.push({ path: '/video' })
          }

          this.comments = values[1].body.comments
          this.comments_pagination = values[1].body.pagination

          this.videos = values[2].body.streams

          this.isPageReady = true
        })
        .catch((e) => {
          console.log('video/show loadData error', e)
        })
    },

    openShareDialog() {
      this.show_share_dialog = true
    },

    closeShareDialog() {
      this.show_share_dialog = false
    },

    addComment() {
      if (this.commentText === '') return

      const params = {
        comment: {
          commentable_type: 'Stream',
          commentable_id: this.stream.id,
          body: this.commentText,
          status: 'published',
        },
      }

      CommentService.sendComment(params)
        .then((res) => {
          this.comments.push(res.body)
          this.commentText = ''
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    repostItem() {
      StreamService.repostStream(this.stream.id)
        .then((res) => {
          this.$store.dispatch('error/showSuccessToast', [
            'You just reposted ' + this.stream.name,
          ])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    followUser() {
      if (this.user.is_following) {
        UserService.unfollowUser(this.user.id)
          .then((res) => {
            this.$store.dispatch('player/updateFollowingStatus', false)
            this.stream.user.is_following = false
          })
          .catch((e) => {
            console.log('unfollowUser error', e)
          })
      } else {
        UserService.followUser(this.user.id)
          .then((res) => {
            this.$store.dispatch('player/updateFollowingStatus', true)
            this.stream.user.is_following = true
          })
          .catch((e) => {
            console.log('followUser error', e)
          })
      }
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
