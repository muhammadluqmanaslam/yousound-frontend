import merchModal from '@/components/merchmodal'
import productCard from '@/components/productcard'
import profileItem from '@/components/profileitem'
import trackCard from '@/components/trackcard'
import VideoBox from '@/components/video_box'
import CommentService from '@/services/comment'
import AlbumService from '@/services/album'
import shareModal from '@/components/sharemodal'
import Comments from '@/components/comments'
import UserTag from '@/components/user_tag'
// import videoCard from '@/components/videocard'

export default {
  components: {
    merchModal,
    productCard,
    profileItem,
    trackCard,
    VideoBox,
    shareModal,
    Comments,
    UserTag,
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
      // commenters: [], replace when data is ready
    }
  },

  computed: {
    attachCover() {
      switch (this.recentItem.type) {
        case 'ShopProduct':
          return this.recentItem.value.covers[0].cover.thumb.url
        case 'Album':
          return this.recentItem.value.cover.thumb.url
        default:
          break;
      }
    },
    commenters() {
      return [
        {
          username: 'user-1',
          avatar: {
            url: 'https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/5/thumb_2c068f2d-5dbf-445e-8715-2f17cf4fd6ce.jpg',
          },
        },
        {
          username: 'user-2',
          avatar: {
            url: 'https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/5/thumb_2c068f2d-5dbf-445e-8715-2f17cf4fd6ce.jpg',
          },
        },
        {
          username: 'user-3',
          avatar: {
            url: 'https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/5/thumb_2c068f2d-5dbf-445e-8715-2f17cf4fd6ce.jpg',
          },
        },
      ].slice(0, 8) // max of 8
    },
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
