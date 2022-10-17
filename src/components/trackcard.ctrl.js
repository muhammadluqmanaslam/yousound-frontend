import _ from 'lodash'
import { mapActions, mapMutations } from 'vuex'
import { MyEvents } from '@/helper'

import AlbumService from '@/services/album'
import PlaylistService from '@/services/playlist'

import albumReportDialog from '@/components/album_report_dialog'
import downloadModal from '@/components/downloadmodal'
import shareModal from '@/components/sharemodal'

export default {
  components: {
    albumReportDialog,
    downloadModal,
    shareModal,
  },

  props: {
    noMeta: {
      type: Boolean,
      default: false,
    },
    noAction: {
      type: Boolean,
      default: false,
    },
    hideTrackLength: {
      type: Boolean,
      default: false,
    },
    hideMoreMenu: {
      type: Boolean,
      default: false,
    },
    objects: {
      type: Array,
    },

    objectIndex: {
      type: Number,
    },
    hideButtonAction: {
      type: Function,
    },
    showHoverTrackInfo: Boolean,
    playButton2: Boolean,
    playButton2IconHasWhiteBG: Boolean,
  },

  data() {
    return {
      showDownloadModal: false,
      showShareModal: false,
      hide_dialog: false,
      show_report_dialog: false,
      playlist_dialog: false,
      is_component_hover: false,
      is_menu_hover: false,
      menu: false,
      submenu: false,
      playlist: {
        name: '',
        image: null,
      },
      page: '',
      selectedImage: null,
    }
  },

  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    currentUser() {
      return this.$store.state.auth.user
    },

    willMenuRender() {
      // console.log('willMenuRender', this.item.id, this.is_component_hover, this.is_menu_hover)
      return this.is_menu_hover || this.is_component_hover
    },

    item() {
      if (this.objects[this.objectIndex].assoc_type) {
        return this.objects[this.objectIndex].assoc
      } else {
        return this.objects[this.objectIndex]
      }
    },

    isEmptyAlbum() {
      return _.isEmpty(this.item)
    },

    // isShowUserInfo() {
    //   if (this.$store.state.navigator.current.page === 'stream') {
    //     return true
    //   } else {
    //     return false
    //   }
    // },

    // publisher() {
    //   if (this.objects[this.objectIndex].assoc_type) {
    //     return this.objects[this.objectIndex].publisher
    //   } else {
    //     return this.objects[this.objectIndex].user
    //   }
    // },

    owner() {
      if (this.objects[this.objectIndex].assoc_type) {
        return this.objects[this.objectIndex].assoc.user
      } else {
        return this.objects[this.objectIndex].user
      }
    },

    isPlaying() {
      var playingItem = this.$store.state.player.list[
        this.$store.state.player.listIndex
      ]
      if (playingItem !== undefined) {
        if (playingItem.assoc_type === 'Album') {
          playingItem = playingItem.assoc
        }
        var currentItem = this.objects[this.objectIndex]
        if (currentItem.assoc_type === 'Album') {
          currentItem = currentItem.assoc
        }
        if (playingItem.id === currentItem.id) {
          return true
        }
      }
      return false
    },

    album1Cover() {
      return _.get(this.item.tracks, '[0].album.cover.url')
    },

    album2Cover() {
      return _.get(this.item.tracks, '[1].album.cover.url')
    },

    album3Cover() {
      return _.get(this.item.tracks, '[2].album.cover.url')
    },

    album4Cover() {
      return _.get(this.item.tracks, '[3].album.cover.url')
    },

    input_id() {
      return (
        'playlist_image_file_' +
        this.item.slug +
        '_' +
        parseInt(Math.random() * 999999)
      )
    },

    playlists() {
      return this.$store.state.playlist.playlists
    },
  },

  created() {},

  methods: {
    ...mapActions({
      setPlaylist: 'player/setPlaylist',
      setPlaylistIndex: 'player/setListIndex',
      setTrackIndex: 'player/setTrackIndex',
      setPlaying: "player/setPlayingStatus",
    }),
    ...mapMutations({
      setAlbumPrevRoute: 'appMobile/setAlbumPrevRoute',
    }),
    gotoItem() {
      // store entry point before album page entry
      const currentRoute = this.$route.name
      if (this.onMobile && currentRoute !== 'AlbumDetail') {
        this.setAlbumPrevRoute(currentRoute)
        return this.$router.push(`/${this.item.album_type}/${this.item.slug}`)
      } else {
        return this.$router.push(`/${this.item.album_type}/${this.item.slug}`)
      }
    },

    playSong() {
      if (this.isPlaying && this.$store.state.player.isPaused && this.currentUser !== null) {
        this.$root.$emit(MyEvents.AUDIO_PLAYER_REPLAY, 0)
      } else {
        this.setPlaylist(this.objects)
        this.setPlaylistIndex(this.objectIndex)
        this.setPlaying(true)
        this.$root.$emit(MyEvents.AUDIO_PLAYER_PLAY, 0)
      }
    },

    pauseSong() {
      this.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
    },

    repostItem() {
      this.menu = false
      this.submenu = false
      AlbumService.repostAlbum(this.item.id)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'You just reposted ' + this.item.name,
          ])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    openReportDialog() {
      this.menu = false
      this.submenu = false
      this.show_report_dialog = true
    },

    closeReportDialog() {
      this.show_report_dialog = false
    },

    reportAlbum() {
      console.log('reportAlbum')
    },

    showDownloadDialog() {
      this.menu = false
      this.submenu = false
      this.showDownloadModal = true
    },

    dismissDownloadDialog() {
      this.showDownloadModal = false
    },

    showShareDialog() {
      this.menu = false
      this.submenu = false
      this.showShareModal = true
    },

    dismissShareDialog() {
      this.showShareModal = false
    },

    showHideAlbumDialog() {
      this.menu = false
      this.submenu = false
      this.hide_dialog = true
    },

    hideAlbum() {
      this.menu = false
      this.submenu = false
      this.hide_dialog = false

      AlbumService.hideAlbum(this.item.id)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'You just hid ' + this.item.name,
          ])
          if (this.hideButtonAction) {
            this.hideButtonAction(this.objects[this.objectIndex])
          }
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    addComment() {
      this.menu = false
      this.submenu = false
    },

    addToMyLabel() {
      AlbumService.sendLabelRequest(this.item.id)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'You just send a label request on <' + this.item.name + '>',
          ])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    addToNewPlaylist() {
      this.menu = false
      this.playlist = {
        name: '',
        image: null,
      }
      this.selectedImage = null
      this.playlist_dialog = true
    },

    createPlaylist() {
      if (this.playlist.name == '') {
        this.$store.dispatch('error/showErrorToast', [
          'Please input Playlist name.',
        ])
        return
      }

      const params = new FormData()
      params.append('name', this.playlist.name)
      params.append('description', this.playlist.name)
      // if (this.playlist.image) {
      //   params.append('cover', this.playlist.image)
      // }
      // params.append('assoc_id', this.item.id)
      // params.append('assoc_type', 'Album')
      params.append('assoc_id', this.item.tracks[0].id)
      params.append('assoc_type', 'Track')
      this.$store.dispatch('error/showLoadingActivity', true)
      PlaylistService.createPlaylist(params)
        .then((response) => {
          this.playlist_dialog = false
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showSuccessToast', [
            'Added the album to New Playlist ',
          ])

          PlaylistService.getPlaylists().then((response) => {
            this.$store.dispatch('playlist/setPlaylists', response.body)
          })
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    addToPlaylist(list) {
      this.menu = false
      this.submenu = false
      // const params = new FormData()
      // params.append('assoc_id', this.item.id)
      // params.append('assoc_type', 'Album')
      const params = {
        assoc_id: this.item.tracks[0].id,
        assoc_type: 'Track',
      }
      PlaylistService.updatePlaylist(list.id, params)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'Added the track to <' + list.name + '>',
          ])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    recommendAlbum() {
      this.menu = false
      this.submenu = false
      AlbumService.recommendAlbum(this.item.id)
        .then((response) => {
          this.item.recommended = true
          this.$store.dispatch('error/showSuccessToast', [
            'You just recommended ' + this.item.name,
          ])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    unrecommendAlbum() {
      this.menu = false
      this.submenu = false
      AlbumService.unrecommendAlbum(this.item.id)
        .then((response) => {
          this.item.recommended = false
          this.$store.dispatch('error/showSuccessToast', [
            'You just unrecommended ' + this.item.name,
          ])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    imageChanged(e) {
      if (e.target.files[0].size > 2097152) {
        // console.log(e.target.files)
        this.$store.dispatch('error/showErrorToast', [
          'You can upload an image 2MB in maximum',
        ])
        return
      }

      this.playlist.image = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener(
        'load',
        (event) => {
          this.selectedImage = event.target.result
        },
        false
      )
      reader.readAsDataURL(this.playlist.image)
    },
  },
}
