import _ from 'lodash'
import { mapActions } from 'vuex'
import AlbumService from '@/services/album'
import CommentService from '@/services/comment'
import UserService from '@/services/user'
import activityItem from '@/components/activityitem'
import profileItem from '@/components/profileitem'
import albumTrackItem from '@/components/albumtrackitem'
import downloadModal from '@/components/downloadmodal'
import merchModal from '@/components/merchmodal'
import promoteModal from '@/components/promotemodal'
import albumFinishModal from '@/components/albumfinishmodal'
import shareModal from '@/components/sharemodal'
import { Picker } from 'emoji-mart-vue'

export default {
  components: {
    Picker,
    downloadModal,
    merchModal,
    promoteModal,
    albumFinishModal,
    shareModal,
    activityItem,
    albumTrackItem,
    profileItem
  },

  data () {
    return {
      showDownloadModal: false,
      showMerchModal: false,
      showPromoteMessage: false,
      showShareModal: false,
      isShowFinishModal: false,
      showEmojiPicker: false,
      slug: null,
      album: null,
      trackIndex: 0,
      comments: [],
      commentString: '',
      buttonHover: false,
      // buttonHover: [],
      dialog: false,
      roles: [],
      isPageReady: false
    }
  },

  computed: {
    showStats () {
      return !_.isEmpty(_.find(this.roles, (user_album) => { return ['creator', 'label', 'collaborator'].indexOf(user_album.user_type) > -1 }))
    },

    coverImageURL () {
      if (this.album.cover) {
        return this.album.cover.large.url
      } else {
        return ''
      }
    },

    coverThumbImageURL () {
      if (this.album.cover) {
        return this.album.cover.thumb.url + '?' + new Date()
      } else {
        return ''
      }
    },

    commentsCount() {
      if (this.comments.length > 0) {
        return this.comments.length
      } else {
        return 'No'
      }
    },

    isPlaying () {
      if (this.$store.state.player.isPlaying) {
        const current_album = this.$store.state.player.list[this.$store.state.player.listIndex]
        if (current_album.id === this.album.id) {
          return true
        }
      }
      return false
    },

    ellipsisString () {
      if (this.album) {
        if (this.album.description.length >= 200) {
          return this.album.description.substr(200) + '...' 
        } else {
          return this.album.description + '...'
        }
      } else {
        return ''
      }
    },

    followButtonText () {
      if (this.album.user.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    },

    genres () {
      return _.map(this.album.genres, 'name').join(', ')
    }
  },

  watch: {
    '$route' (to, from) {
      const toPath = to.path.split('/')
      this.slug = toPath[2]
      this.trackIndex = 0
      this.loadData()
    }
  },

  created () {
    // this.$store.dispatch('navigator/setCurrentState', { page: 'upload', tab: '' })
    this.$store.dispatch('navigator/goNextState', { page: 'album', tab: '' })
    // console.log('current', this.$store.state.navigator.current)
    // console.log('last', this.$store.getters['navigator/last'])

    this.loadData()
  },

  methods: {
    ...mapActions({
      setPlaylist: 'player/setPlaylist',
      setPlaylistIndex: 'player/setListIndex',
      setTrackIndex: 'player/setTrackIndex',
      setPlaying: 'player/setPlayingStatus',
      setPage: 'player/setPage',
      setTab: 'player/setTab'
    }),

    loadData () {
      const vm = this
      this.isPageReady = false
      this.slug = this.$route.params.slug
      Promise.all([
        AlbumService.getAlbum(this.slug),
        AlbumService.myRole(this.slug)
      ]).then(values => {
        this.album = values[0].body
        // for (let index in this.album.tracks) {
        //   this.buttonHover.push(false)
        // }
        if (this.$store.getters['navigator/last'].page === 'upload') {
          this.showFinishDialog()
        }

        this.roles = values[1].body

        if (this.$store.state.auth.user) {
          this.getComments()
        }

        setTimeout(function () {
          vm.changeBackground()
          var height = $('#album_info_page').height() + 230
          var screen_height = $( window ).height()
          if (height > screen_height ) {
            height += 50
          } else {
            height = screen_height
          }
          var canvas = document.getElementById("canvas")
          canvas.height = height
          // $('#back_image').css("cssText", "height: " + height + "px !important;")
        }, 200)

        this.isPageReady = true
      }).catch(reason => { 
        console.log(reason)
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', reason)
      });
      // this.setTrackIndex(0)
      // if (!this.$store.state.player.isPlaying && !this.$store.state.player.isPaused) {
      // }
    },

    convertedHTML(text) {
      var matches = text.match(/@[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*/g)
      for (let index in matches) {
        const match = matches[index]
        const user_name = match.substr(1)
        var reg = new RegExp(match, 'g')
        // text = text.replace(reg, `<a href="/${user_name}">${match}</a>`)
        text = text.replace(reg, `<a href="/${user_name}">${match}</a>`)
      }
      return text
    },

    changeBackground () {
      var canvas = document.getElementById("canvas")
      var cctx = canvas.getContext("2d")
      var buff = document.createElement("canvas")
      buff.width = canvas.width
      buff.height = canvas.height

      var imageObj = new Image()
      // this will make CORS happy because the server is well configured
      imageObj.crossOrigin = 'anonymous'
      // Easiest is to always host your images on your own server
      // imageObj.src = 'https://dl.dropboxusercontent.com/s/8q8sjnqmmto13h5/lionCMYK.jpg'
      imageObj.src = this.coverThumbImageURL
      imageObj.onload = function() {
        // canvas.width = imageObj.height
        // canvas.height = imageObj.height
        cctx.drawImage(imageObj, 0, 0)
        StackBlur.image(imageObj, canvas, 70, false)
        var height = $('#album_info_page').height() + 230
        var screen_height = $( window ).height()
        if (height > screen_height ) {
          height += 50
        } else {
          height = screen_height
        }
        if(canvas) {
          $('#canvas').css("cssText", "height: " + height + "px !important;")
        }
        $('#back_image').css("cssText", "height: " + height + "px !important;")
      }
    },

    followUser (user) {
      if (user.is_following) {
        UserService.unfollowUser(user.id).then(response => {
          this.$store.dispatch('error/showSuccessToast', ['You just unfollowed ' + user.display_name])
          user.is_following = false
          // this.$store.dispatch('player/setUpdatedUser', _.cloneDeep(user))
          this.$root.$emit('follow', false)
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors|| [e.body])
        })
      } else {
        UserService.followUser(user.id).then(response => {
          this.$store.dispatch('error/showSuccessToast', ['You just followed ' + user.display_name])
          user.is_following = true
          // this.$store.dispatch('player/setUpdatedUser', _.cloneDeep(user))
          this.$root.$emit('follow', true)
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors|| [e.body])
        })
      }
    },

    goToAlbumStats (stats) {
      this.$store.dispatch('album/setAlbumStats', stats)
      this.$router.push({ path: '/album/' + this.album.slug + '/stats' })
    },

    showPromoteModal () {
      this.isShowFinishModal = false
      this.showPromoteMessage = true
    },

    dismissPromoteModal () {
      this.showPromoteMessage = false
      this.isShowFinishModal = true
    },

    openDownloadModal() {
      this.showDownloadModal = true
    },

    closeDownloadModal() {
      this.showDownloadModal = false
    },

    openShareModal() {
      this.showShareModal = true
    },

    closeShareModal() {
      this.showShareModal = false
    },

    dismissFinishDialog () {
      this.isShowFinishModal = false
      $('html').css('overflow', 'scroll')
    },

    showFinishDialog () {
      this.isShowFinishModal = true
      $('html').css('overflow', 'hidden')
    },

    saveAndFinish (users) {
      $('html').css('overflow', 'scroll')
      this.showPromoteMessage = false
      this.isShowFinishModal = false
    },

    addEmoji(emoji, event) {
      // console.log('addEmoji')
      this.showEmojiPicker = false
      this.commentString += emoji.native
      this.$refs.comment.focus()
    },

    showEmojiDialog () {
      this.showEmojiPicker = !this.showEmojiPicker
      this.$refs.comment.focus()
    },

    blurMessage () {
      const vm = this
      if (vm.showEmojiPicker) {
        setTimeout(function() {
          // console.log('hide')
          vm.showEmojiPicker = false
        }, 200);
      }
    },

    addComments () {
      const params = new FormData()
      params.append('comment[commentable_type]', 'Album')
      params.append('comment[commentable_id]', this.album.id)
      params.append('comment[body]', this.commentString)
      this.commentString = ''
      CommentService.sendComment(params).then(response => {
        this.getComments()
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    getComments () {
      CommentService.getComments('Album', this.album.id).then(response => {
        this.comments = response.body
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    makePublicComment (comment) {
      CommentService.makePublicComment(comment.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You made a comment public!'])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    makePrivateComment (comment) {
      CommentService.makePrivateComment(comment.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You made a comment private!'])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    blockUser (comment) {
      UserService.blockUser(comment.user.id).then(response =>  {
        _.remove(this.comments, (item) => { return item.user.id == comment.user.id });
        const arr = this.comments.slice();
        this.comments = arr;
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (e.status === 401) {
          this.$root.$emit('showLoginModal')
        } else {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        }
      })
    },

    deleteComment (comment) {
      CommentService.deleteComment(comment.id).then(response => {
        _.remove(this.comments, (item) => { return item.id == comment.id });
        const arr = this.comments.slice();
        this.comments = arr;
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    selectTrack (index) {
      this.trackIndex = index
      if (this.isPlaying) {
        this.setTrackIndex(index)
        this.$root.$emit('skipTo')
      } else {
        this.setPlaylist([this.album])
        this.setPlaylistIndex(0)
        this.setPlaying(true)
        this.setTrackIndex(index)
        this.setPage(this.$store.state.auth.page)
        this.setTab(this.$store.state.auth.tab)
        this.$root.$emit('play')
      }
    },

    playSong () {
      if (this.$store.state.player.isPaused &&
        this.$store.getters['player/currentAlbum'] &&
        this.$store.getters['player/currentAlbum'].id == this.album.id) {
        this.$root.$emit('replay')
      } else {
        this.setPlaylist([_.cloneDeep(this.album)])
        this.setPlaylistIndex(0)
        this.setPlaying(true)
        this.setPage(this.$store.state.auth.page)
        this.setTab(this.$store.state.auth.tab)
        this.$root.$emit('play')
      }
    },

    pauseSong () {
      this.$root.$emit('pause')
    },

    dismissDownloadModal () {
      this.showDownloadModal = false
    },

    repostItem () {
      AlbumService.repostAlbum(this.album.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You just reposted ' + this.album.name])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    // hoverTrackItem (index, status) {
    //   this.buttonHover[index] = status
    //   this.buttonHover = this.buttonHover.slice()
    // },

    goToArtistProfile() {
      this.$router.push({
        path: '/' + this.album.user.slug,
        hash: 'merch'
      })
    },

    showMerchDialog () {
      this.showMerchModal = true
    },

    dimissMerchDialog () {
      this.showMerchModal = false
    }
  },

  mounted () {
    const vm = this
    $( window ).resize(function() {
      var height = $('#album_info_page').height() + 230
      var screen_height = $( window ).height()
      if (height > screen_height ) {
        height += 50
      } else {
        height = screen_height
      }
      var canvas = document.getElementById("canvas")
      if(canvas) {
        $('#canvas').css("cssText", "height: " + height + "px !important;")
      }
      $('#back_image').css("cssText", "height: " + height + "px !important;")
    }).trigger('resize')
  },

  updated () {
  }
}
