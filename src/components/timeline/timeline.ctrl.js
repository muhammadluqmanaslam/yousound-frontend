import merchModal from '@/components/merchmodal'
import productCard from '@/components/productcard'
import profileItem from '@/components/profileitem'
import trackCard from '@/components/trackcard'
import VideoBox from '@/components/video_box'
import CommentService from '@/services/comment'
// import videoCard from '@/components/videocard'

export default {
  components: {
    merchModal,
    productCard,
    profileItem,
    trackCard,
    VideoBox,
// videoCard
  },

  props: {
    user: {
      type: Object,
    },
  },

  data() {
    return {
      showMerchModal: false,
    }
  },

  computed: {
    recentItem() {
      return this.user.recent_items[0] || { }
    },

    actionText() {
      let _text = ''
      switch (this.recentItem.feed_type) {
        case 'release':
          if (this.recentItem.assoc_type === 'Stream') {
            _text = 'broadcasted'
          } else if (
            this.recentItem.assoc_type === 'Album' &&
            this.recentItem.assoc.album_type === 'playlist'
          ) {
            _text = 'created playlist'
          } else {
            _text = 'released'
          }
          break
        case 'repost':
          _text = 'reposted'
          break
        case 'unrepost':
          _text = 'unreposted'
          break
        case 'follow':
          _text = 'followed'
          break
        case 'unfollow':
          _text = 'unfollowed'
          break
        case 'download':
          _text = 'downloaded'
          break
    // case 'play':
    //   _text = 'played'
    //   break
        default:
          _text = this.recentItem.feed_type
          break
      }
      return _text
    },
  },

  created() { },

  methods: {
    loadComments() {
      const params = {
        commentable_type: 'Stream',
        commentable_id: this.album.id,
        page: this.comment_pagination.current_page + 1,
        per_page: this.comment_pagination.per_page,
      }

      CommentService.getComments(params)
        .then((response) => {
          this.comments = this.comments.concat(response.body.comments)
          this.comment_pagination = response.body.pagination
        })
    },
    doAction() {
      switch (this.recentItem.assoc_type) {
        case 'ShopProduct':
          this.showMerchModal = true
          break
        case 'Album':
          this.$router.push({path: 'album/' + this.recentItem.assoc.slug })
          break
      }
    },

    dimissMerchModal() {
      this.showMerchModal = false
    },
  },
  mounted() {
    console.log(this.user)
  },
}
