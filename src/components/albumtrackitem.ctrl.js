import _ from 'lodash'
import { mapActions } from 'vuex'
import { MyEvents } from '@/helper'
import AlbumService from '@/services/album'
import PlaylistService from '@/services/playlist'
import downloadModal from '@/components/downloadmodal'
import shareModal from '@/components/sharemodal'
import profileItem from '@/components/profileitem'

export default {
  components: {
    downloadModal,
    shareModal,
    profileItem
  },

  props: {
    album: {
      type: Object
    },

    trackIndex: {
      type: Number
    },

    removeTrack: {
      type: Function
    },

    showStats: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      buttonHover: false,
      download_dialog: false,
      share_dialog: false,
      playlist_dialog: false,
      menu: false,
      submenu: false,
      playlist: {
        name: '',
        image: null
      },
      selectedImage: null
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },

    track () {
      return this.album.tracks[this.trackIndex]
    },

    isPlaying () {
      if (this.$store.state.player.isPlaying) {
        return _.get(this.$store.state.player.list[this.$store.state.player.listIndex], 'id') === this.album.id
      }
      return false
    },

    input_id () {
      return 'playlist_image_file_' + this.track.id
    },

    playlists () {
      return this.$store.state.playlist.playlists
    }
  },

  created () {
  },

  methods: {
    ...mapActions({
      setPlaylist: 'player/setPlaylist',
      setPlaylistIndex: 'player/setListIndex',
      setTrackIndex: 'player/setTrackIndex',
      setPlaying: 'player/setPlayingStatus'
    }),

    removeItem () {
      this.menu = false
      this.submenu = false
      this.removeTrack(this.track)
    },

    repostItem () {
      this.menu = false
      this.submenu = false
      AlbumService.repostAlbum(this.album.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You just reposted ' + this.album.name])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    showDownloadDialog () {
      this.menu = false
      this.submenu = false
      this.download_dialog = true
    },

    dismissDownloadDialog () {
      this.download_dialog = false
    },

    showShareDialog () {
      this.menu = false
      this.submenu = false
      this.share_dialog = true
    },

    dismissShareDialog () {
      this.share_dialog = false
    },

    flagItem () {
      this.menu = false
      this.submenu = false
    },

    addComment () {
      this.menu = false
      this.submenu = false
    },

    addToNewPlaylist () {
      this.menu = false
      this.playlist = {
        name: '',
        image: null
      }
      this.selectedImage = null
    },

    createPlaylist () {
      this.playlist_dialog = false

      const params = new FormData()
      params.append('name', this.playlist.name)
      params.append('description', this.playlist.name)
      if (this.playlist.image) {
        params.append('cover', this.playlist.image)
      }
      params.append('assoc_id', this.track.id)
      params.append('assoc_type', 'Track')
      this.$store.dispatch('error/showLoadingActivity', true)
      PlaylistService.createPlaylist(params).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', ['Added the track to New Playlist '])

        PlaylistService.getPlaylists().then(response => {
          this.$store.dispatch('playlist/setPlaylists', response.body)
        })
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    addToPlaylist (list) {
      this.menu = false
      this.submenu = false
      const params = {
        assoc_id: this.track.id,
        assoc_type: 'Track'
      }
      PlaylistService.updatePlaylist(list.id, params).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['Added the track to <' + list.name + '>'])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    imageChanged (e) {
      this.playlist.image = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener('load', (event) => {
        this.selectedImage = event.target.result
      }, false)
      reader.readAsDataURL(this.playlist.image)
    },

    selectTrack () {
      // console.log('album-track-item selectTrack', this.trackIndex, this.isPlaying)
      if (this.isPlaying) {
        this.$root.$emit(MyEvents.AUDIO_PLAYER_SKIPTO, this.trackIndex)
      } else {
        this.setPlaylist([this.album])
        this.setPlaylistIndex(0)
        this.setPlaying(true)
        this.$root.$emit(MyEvents.AUDIO_PLAYER_PLAY, this.trackIndex)
      }
    },

    goToAlbumStats (stats) {
      this.$router.push({ path: `/album/${this.album.slug}/stats#${stats}` })
    }
  }
}
