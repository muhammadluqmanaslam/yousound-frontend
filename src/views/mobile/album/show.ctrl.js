// /* global $:true */

import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import mobileHeader from '@/views/mobile/components/header'
import mobileFooter from '@/views/mobile/components/footer'
import mobileMenu from '@/views/mobile/components/menu'
import audioPlayer from '@/views/mobile/components/audio_player'
import { MyEvents } from '@/helper'
import AlbumService from '@/services/album'

export default {
  components: {
    mobileHeader,
    mobileFooter,
    mobileMenu,
    audioPlayer,
  },

  data() {
    return {
      slug: null,
      album: null,
      showMenu: false,
      loading: true,
    }
  },

  computed: {
    ...mapGetters({
      activeAlbum: 'player/currentAlbum',
    }),

    isPlaying() {
      const playing =
        this.$store.state.player.isPlaying &&
        !this.$store.state.player.isPaused &&
        _.get(this.activeAlbum, 'id') === this.album.id

      // console.log('isPlaying', playing)
      return playing
    },

    isAlbumUserVerified() {
      const userType = _.get(this.album, 'user.user_type')
      return ['artist', 'label', 'brand'].indexOf(userType) > -1
    },

    coverThumbImageURL() {
      if (this.album.cover) {
        return this.album.cover.thumb.url + '?' + new Date()
      } else {
        return ''
      }
    },
  },

  methods: {
    ...mapActions({
      setPlaylist: 'player/setPlaylist',
      setPlaylistIndex: 'player/setListIndex',
      setTrackIndex: 'player/setTrackIndex',
      setPlaying: 'player/setPlayingStatus',
    }),

    loadData() {
      this.loading = true
      AlbumService.getAlbum(this.slug).then((response) => {
        this.album = response.body

        const vm = this
        setTimeout(function () {
          vm.changeBackground()
          // let height = $('#album_info_page').height() + 230
          // const screenHeight = $(window).height()
          // if (height > screenHeight) {
          //   height += 50
          // } else {
          //   height = screenHeight
          // }
          // var canvas = document.getElementById('canvas')
          // canvas.height = height
          // $('#back_image').css("cssText", "height: " + height + "px !important;")
        }, 200)

        this.loading = false
      })
    },

    changeBackground() {
      // console.log(window)
      var StackBlur = window.StackBlur
      var canvas = document.getElementById('canvas')
      var cctx = canvas.getContext('2d')
      var buff = document.createElement('canvas')
      buff.width = canvas.width
      buff.height = canvas.height

      var imageObj = new Image()
      // this will make CORS happy because the server is well configured
      imageObj.crossOrigin = 'anonymous'
      // Easiest is to always host your images on your own server
      // imageObj.src = 'https://dl.dropboxusercontent.com/s/8q8sjnqmmto13h5/lionCMYK.jpg'
      imageObj.src = this.coverThumbImageURL
      imageObj.onload = function () {
        // canvas.width = imageObj.height
        // canvas.height = imageObj.height
        cctx.drawImage(imageObj, 0, 0)
        StackBlur.image(imageObj, canvas, 70, false)
        // let height = $('#album_info_page').height() + 230
        // const screenHeight = $(window).height()
        // if (height > screenHeight) {
        //   height += 50
        // } else {
        //   height = screenHeight
        // }
        // if (canvas) {
        //   $('#canvas').css('cssText', 'height: ' + height + 'px !important;')
        // }
        // $('#back_image').css('cssText', 'height: ' + height + 'px !important;')
      }
    },

    isTrackPlaying(trackIndex) {
      return (
        this.isPlaying && trackIndex === this.$store.state.player.trackIndex
      )
    },

    play(trackIndex) {
      // if (this.isPlaying) {
      //   this.pauseSong()
      // } else {
      //   this.playSong()
      // }
      if (this.isPlaying) {
        if (this.isTrackPlaying(trackIndex)) {
          this.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE, trackIndex)
        } else {
          this.$root.$emit(MyEvents.AUDIO_PLAYER_SKIPTO, trackIndex)
        }
      } else {
        this.setPlaylist([this.album])
        this.setPlaylistIndex(0)
        this.setPlaying(true)
        this.$root.$emit(MyEvents.AUDIO_PLAYER_PLAY, trackIndex)
      }
    },

    playSong() {
      if (
        this.$store.state.player.isPaused &&
        _.get(this.activeAlbum, 'id') === this.album.id
      ) {
        this.$root.$emit(MyEvents.AUDIO_PLAYER_REPLAY)
      } else {
        this.setPlaylist([_.cloneDeep(this.album)])
        this.setPlaylistIndex(0)
        this.setPlaying(true)
        this.$root.$emit(MyEvents.AUDIO_PLAYER_PLAY)
      }
    },

    pauseSong() {
      this.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
    },

    openMenu() {
      this.showMenu = true
    },

    closeMenu() {
      this.showMenu = false
    },
  },

  created() {
    // this.$store.dispatch('navigator/goNextState', { page: 'album', tab: '' })
    this.slug = this.$route.params.slug
    const self = this
    document.location = `ys://album/${this.slug}`
    setTimeout(function () {
      self.loadData()
    }, 300)
  },
}
