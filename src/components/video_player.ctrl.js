// import _ from 'lodash'
// import Hls from 'hls.js'
import AlbumService from '@/services/album'
import ProductService from '@/services/product'
import StreamService from '@/services/stream'

import efmHeader from '@/components/header'
import downloadModal from '@/components/downloadmodal'
import merchModal from '@/components/merchmodal'

import { MyEvents } from '@/helper'

export default {
  components: {
    efmHeader,
    downloadModal,
    merchModal
  },

  data () {
    return {
      player: null,
      time: 0,
      show_streaming_confirm_dialog: false,
      show_album_merch_popup: false,
      show_download_modal: false,
      show_merch_modal: false,
      request_tab: 'Album',
      assoc: {},
      albums: [],
      products: [],
      isPageReady: false
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },

    user () {
      // console.log('video-player user', this.$store.state.videoPlayer.user)
      return this.$store.state.videoPlayer.user
    }
  },

  created () {
    console.log('video-player created')

    this.$root.$on(MyEvents.VIDEO_PLAYER_INIT, this.init)

    Promise.all([
      AlbumService.getAlbums({
        statuses: 'published, collaborated',
        user_statuses: 'accepted'
      }),
      ProductService.getProducts({
        statuses: 'published, collaborated',
        stock_statuses: 'active',
        user_statuses: 'accepted'
      }) 
    ]).then(values => {
      this.albums = values[0].body
      this.products = values[1].body
    }).catch(reason => {
      console.log(reason)
      // this.$store.dispatch('error/showErrorToast', [reason])
    })
  },

  beforeDestroy () {
    console.log('video-player beforeDestroy')
    this.$root.$off(MyEvents.VIDEO_PLAYER_INIT, this.init)
    if (this.player) {
      this.player.shutdown()
    }
  },

  methods: {
    init () {
      console.log('video-player initializing...')
      // this.player.load('https://edge.flowplayer.org/functional.m3u8')
      // this.initPlayer('https://edge.flowplayer.org/functional.m3u8')
      this.openStreamingConfirmDialog()
    },

    initPlayer (url) {
      const vm = this
      if (vm.player) {
        // vm.player.unload()
        vm.player.shutdown()
      }
      vm.player = window.flowplayer('#my_video', {
        autoplay: false,
        splash: false,
        poster: false,
        live: true,
        share: false,
        keyboard: false,
        // fullscreen: true,
        // native_fullscreen: true,
        clip: {
          hlsQualities: [-1, 1, 3, 6, 7],
          sources: [
            // { type: 'application/x-mpegurl', src: 'https://edge.flowplayer.org/functional.m3u8' }
            { type: 'application/x-mpegurl', src: url }
          ]
        }
      }).on('fullscreen', function (e, api) {
        vm.$store.dispatch('videoPlayer/setFrameMode', 'full')
      }).on('fullscreen-exit', function (e, api) {
        vm.$store.dispatch('videoPlayer/setFrameMode', 'normal')
      }).on('progress', function (e, api, time) {
        // console.log('flowplayer progress...', api.paused, api.playing, time)
        vm.time = parseInt(time)
        if (!vm.$store.getters['videoPlayer/isPlaying']) {
          if (api.playing) {
            vm.$store.dispatch('videoPlayer/setPlayMode', 'playing')
          }
        }
      // }).on('play', function (e, api) {
      //   console.log('flowplayer play...')
      // }).on('resume', function (e, api) {
      //   // console.log('flowplayer resume...')
      }).on('pause', function (e, api) {
        vm.$store.dispatch('videoPlayer/setPlayMode', 'paused')
      })
    },

    onRequestTab (tab) {
      this.request_tab = tab
      this.item_index = -1
    },

    selectItem (assoc_type, assoc) {
      // console.log(assoc_type, assoc)
      this.show_album_merch_popup = false
      if (assoc.id != this.assoc.id) {
        this.assoc = assoc
        const params = {
          stream: {
            assoc_type: assoc_type,
            assoc_id: assoc.id
          }
        }
        StreamService.updateStream(this.currentUser.stream.id, params).then(response => {
          this.$store.dispatch('videoPlayer/setStream', response.body)
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      }
    },

    choosePage (path) {
      this.player.fullscreen()
      this.$router.push({ path: '/' + path })
    },

    openDownloadModal () {
      this.show_download_modal = true
    },

    closeDownloadModal () {
      this.show_download_modal = false
    },

    openMerchModal () {
      this.show_merch_modal = true
    },

    closeMerchModal () {
      this.show_merch_modal = false
    },

    openAlbumMerchPopup () {
      this.show_album_merch_popup = true
    },

    closeAlbumMerchPopup () {
      this.show_album_merch_popup = false
    },

    openStreamingConfirmDialog () {
      this.show_streaming_confirm_dialog = true
    },

    closeStreamingConfirmDialog () {
      this.show_streaming_confirm_dialog = false
    },

    closePlayer () {
      if (this.player) {
        this.player.shutdown()
      }
    },

    onClick: function (e) {
      this.closeStreamingConfirmDialog()
      // this.initPlayer('https://edge.flowplayer.org/functional.m3u8')
      this.initPlayer('https://edge.flowplayer.org/FlowplayerHTML5forWordPress.m3u8')
      this.player.fullscreen()
      // this.$nextTick(() => {
      //   this.player.play()
      // })
      const vm = this
      setTimeout(function () {
        vm.player.play()
      }, 300)
    }
  },

  mounted () {
  }
}