import { mapActions } from 'vuex'
import AlbumService from '@/services/album'
import PlaylistService from '@/services/playlist'
import CommentService from '@/services/comment'
import UserService from '@/services/user'
import activityItem from '@/components/activityitem'
import profileItem from '@/components/profileitem'
import albumTrackItem from '@/components/albumtrackitem'
import downloadModal from '@/components/downloadmodal'
import { Picker } from 'emoji-mart-vue'
import draggable from 'vuedraggable'

export default {
  components: {
    Picker,
    downloadModal,
    activityItem,
    albumTrackItem,
    profileItem,
    draggable
  },

  data () {
    return {
      showDownloadModal: false,
      showEmojiPicker: false,
      slug: null,
      playlist: null,
      selectedImage: null,
      playlist_dialog: false,
      trackIndex: 0,
      comments: [],
      commentString: '',
      buttonHover: []
    }
  },

  computed: {
    coverImageURL () {
      if (this.playlist.cover) {
        return this.playlist.cover.large.url
      } else {
        return ''
      }
    },

    coverThumbImageURL () {
      if (this.playlist.cover) {
        return this.playlist.cover.thumb.url + '?' + new Date()
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
        const current_playlist = this.$store.state.player.list[this.$store.state.player.listIndex]
        if (current_playlist.id === this.playlist.id) {
          return true
        }
      }
      return false
    },

    input_id () {
      return 'playlist_image_file_' + this.playlist.slug + '_' + parseInt((Math.random() * 999999))
    }
  },

  watch: {
    '$route' (to, from) {
      const toPath = to.path.split('/')
      this.slug = toPath[2]
      this.trackIndex = 0
      this.getPlaylist(this.slug)
    }
  },

  created () {
    this.$store.dispatch('navigator/goNextState', {page: 'playlist', tab: ''})
    this.slug = this.$route.params.slug
    this.getPlaylist(this.slug)
    this.setTrackIndex(0)
    // if (!this.$store.state.player.isPlaying && !this.$store.state.player.isPaused) {
    // }
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

    getPlaylist (slug) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const vm = this
      AlbumService.getAlbum(slug).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.playlist = response.body
        for (let index in this.playlist.tracks) {
          this.buttonHover.push(false)
        }
        this.getComments()
        this.selectedImage = this.playlist.cover.url
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
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
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

    addComments () {
      const params = new FormData()
      params.append('comment[commentable_type]', 'Album')
      params.append('comment[commentable_id]', this.playlist.id)
      params.append('comment[body]', this.commentString)
      this.commentString = ''
      CommentService.sendComment(params).then(response => {
        this.getComments()
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    getComments () {
      CommentService.getComments('Album', this.playlist.id).then(response => {
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
        this.setPlaylist([this.playlist])
        this.setPlaylistIndex(0)
        this.setPlaying(true)
        this.setTrackIndex(index)
        this.setPage(this.$store.state.auth.page)
        this.setTab(this.$store.state.auth.tab)
        this.$root.$emit('play')
      }
    },

    playSong () {
      if (this.$store.state.player.isPaused) {
        this.$root.$emit('replay')
      } else {
        this.setPlaylist([this.playlist])
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
      AlbumService.repostAlbum(this.playlist.id).then(response => {
        console.log(response)
        this.$store.dispatch('error/showSuccessToast', ['You just reposted ' + this.playlist.name])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    hoverTrackItem (index, status) {
      this.buttonHover[index] = status
      this.buttonHover = this.buttonHover.slice()
    },

    imageChanged (e) {
      this.playlist.image = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener('load', (event) => {
        this.selectedImage = event.target.result
      }, false)
      reader.readAsDataURL(this.playlist.image)
    },

    updatePlaylist () {
      if (this.playlist.name.replace(' ', '').length > 0) {
        if (this.playlist.image !== null) {
          const params = new FormData()
          params.append('name', this.playlist.name)
          params.append('description', this.playlist.name)
          if (this.playlist.image) {
            params.append('cover', this.playlist.image)
          }
          this.$store.dispatch('error/showLoadingActivity', true)
          PlaylistService.updatePlaylist(this.playlist.id, params).then(response => {
            this.playlist_dialog = false
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('error/showSuccessToast', ['Updated Playlist '])
            this.getPlaylist(this.playlist.slug)
          }).catch(e => {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        } else {
          this.$store.dispatch('error/showErrorToast', ['Please add Playlist cover.'])
        }
      } else {
        this.$store.dispatch('error/showErrorToast', ['Please input Playlist name.'])
      }
    },

    removeTrack (track) {
      if (this.playlist.tracks.length == 1) {
        this.$store.dispatch('error/showErrorToast', ['You have only one track'])
        return
      }

      const params = {
        track_id: track.id
      }
      PlaylistService.removeTrack(this.playlist.id, params).then(response => {
        _.remove(this.playlist.tracks, (item) => { return item.id == params.track_id })
        const arr = this.playlist.tracks.slice()
        this.playlist.tracks = arr
      })
    },

    deletePlaylist () {
      PlaylistService.deletePlaylist(this.playlist.id).then(response => {
        this.playlist_dialog = false
        this.$store.dispatch('error/showSuccessToast', ['Deleted Playlist '])

        PlaylistService.getPlaylists().then(response => {
          this.$store.dispatch('playlist/setPlaylists', response.body)
          this.$router.push({ path: '/discover' })
        })
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    addEmoji(emoji, event) {
      this.showEmojiPicker = false
      this.commentString += emoji.native
      this.$refs.comment.focus()
    },


    onEnd () {
      var tracks_ids= [];
      for (let index in this.playlist.tracks) {
        const track = this.playlist.tracks[index]
        tracks_ids.push(track.id)
        const params = new FormData()
        params.append('track_ids', tracks_ids.join(','))
        AlbumService.rearrangeTracks(this.playlist.id, params).then(response => {
          this.$store.dispatch('error/showSuccessToast', ['Updated order of tracks.'])
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      }
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
