import merchModal from '@/components/merchmodal'
import productCard from '@/components/productcard'
import profileItem from '@/components/profileitem'
import trackCard from '@/components/trackcard'
import VideoBox from '@/components/video_box'
import CommentService from '@/services/comment'
import AlbumService from '@/services/album'
import shareModal from '@/components/sharemodal'
import Comments from '@/components/comments'
// import videoCard from '@/components/videocard'

export default {
  components: {
    merchModal,
    productCard,
    profileItem,
    trackCard,
    VideoBox,
    shareModal,
    Comments
    // videoCard
  },

  props: {
    user: {
      type: Object,
    },
  },

  data() {
    return {
      comments: [],
      showMerchModal: false,
      show_share_dialog: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
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
    playingIndexId() {
      let listIndex = this.$store.state.player.list[this.$store.state.player.listIndex]

      if (listIndex !== undefined) {
        return listIndex.id
      }
      return null
    },
  },

  created() { },

  methods: {
    setIsPlaying() {},
    repostItem(id) {
      AlbumService.repostAlbum(id)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'You just reposted ' + this.recentItem.assoc.name,
          ])
        })
        .catch((e) => {
          console.log(e)
        })
    },
    showShareDialog() {
      this.show_share_dialog = true
    },
    closeShareDialog() {
      this.show_share_dialog = false
    },
    playSong(index) {
      this.$refs.trackCard[index].playSong()
    },
    pauseSong(index) {
      this.$refs.trackCard[index].pauseSong()
    },
    trackItem(items, index) {
      if (items[index].assoc_type) {
        return items[index].assoc
      } else {
        return items[index]
      }
    },
    productItem(item, index) {
      if (item.assoc_type) {
        return item.assoc
      } else {
        return item
      }
    },
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
          this.show_share_dialog = true
          // this.$router.push({path: 'album/' + this.recentItem.assoc.slug })
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
