import _ from 'lodash'
import moment from 'moment'
import UserService from '@/services/user'
import StreamService from '@/services/stream'
import CommentService from '@/services/comment'
import ProfileService from '@/services/profile'
import { StreamStatuses } from '@/helper'
import UserTag from '@/components/user_tag'
import Chat from './components/chat'
import UserBox from './components/user_box'
import VideoBox from './components/video_box'
import VideoPlayer from './components/video_player'
import ArtistItem from '@/components/artistitem'

export default {
  components: {
    ArtistItem,
    Chat,
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
      buttonHover: false,
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
      console.log('loading data...')
      Promise.all([
        StreamService.getStream(videoId),
        CommentService.getComments({
          // commentable_type: 'Stream',
          // commentable_id: videoId,
          commentable_type: 'Album',
          commentable_id: 66,
        }),
        ProfileService.getItems(this.currentUser.id, 'followers', {
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

          this.accounts = values[2].body.users

          this.videos.push(values[0].body)
          this.videos.push(values[0].body)
          this.videos.push(values[0].body)
          this.videos.push(values[0].body)
          this.videos.push(values[0].body)
          this.videos.push(values[0].body)
          this.isPageReady = true
        })
        .catch((e) => {
          console.log('video/show loadData error', e)
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
