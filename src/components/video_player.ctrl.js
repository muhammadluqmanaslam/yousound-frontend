/* global $:true */

// import _ from 'lodash'
// import Hls from 'hls.js'
import AlbumService from '@/services/album'
import ProductService from '@/services/product'
import StreamService from '@/services/stream'

import efmHeader from '@/components/header'
import downloadModal from '@/components/downloadmodal'
import merchModal from '@/components/merchmodal'
import shareModal from '@/components/sharemodal'

import { MyEvents } from '@/helper'

export default {
  components: {
    efmHeader,
    downloadModal,
    merchModal,
    shareModal
  },

  data () {
    return {
      player: null,
      time: 0,
      show_streaming_confirm_dialog: false,
      show_stream_delete_confirm_dialog: false,
      show_album_merch_popup: false,
      show_download_modal: false,
      show_merch_modal: false,
      show_share_dialog: false,
      request_tab: 'Album',
      assoc: {},
      albums: [],
      products: [],
      isPageReady: false
    }
  },

  computed: {
    album () {
      // return this.albums[0]
      return _.get(this.currentUser, 'stream.assoc')
    },

    product () {
      // return this.products[0]
      return _.get(this.currentUser, 'stream.assoc')
    },

    currentUser () {
      return this.$store.state.auth.user
    },

    //#TODO change user -> streammingUser
    user () {
      // console.log('video-player user', this.$store.state.videoPlayer.user)
      return this.$store.state.videoPlayer.user
    }
  },

  created () {
    console.log('video-player created')
    this.$root.$on(MyEvents.AUTH_SIGNOUT, this.deleteStream)
    this.$root.$on(MyEvents.AUDIO_PLAYER_PLAY, this.mutePlayer)
    this.$root.$on(MyEvents.AUDIO_PLAYER_REPLAY, this.mutePlayer)
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
    this.$root.$off(MyEvents.AUTH_SIGNOUT, this.deleteStream)
    this.$root.$off(MyEvents.AUDIO_PLAYER_PLAY, this.mutePlayer)
    this.$root.$off(MyEvents.AUDIO_PLAYER_REPLAY, this.mutePlayer)
    this.$root.$off(MyEvents.VIDEO_PLAYER_INIT, this.init)
    this.closePlayer()
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
      // if (vm.player) {
      //   // vm.player.unload()
      //   vm.player.shutdown()
      // }

      // console.log('bean', window.flowplayer.bean)
      vm.player = window.flowplayer('#my_video', {
        // debug: true,
        autoplay: true,
        splash: true,
        poster: false,
        live: true,
        share: false,
        keyboard: false,
        fullscreen: true,
        native_fullscreen: true,
        key: '$512206430871778',
        clip: {
          hlsjs: {
            xhrSetup: function (xhr, url) {
              // xhr.addEventListener('error', function (e) {
              //   console.log('xhr error', e)
              //   vm.player.trigger('error', [vm.player, {code: 2}]);
              // })
              // console.log(xhr, url)
              xhr.addEventListener('readystatechange', function (e) {
                let xstatus = e.currentTarget.status
                // console.log('xhr readystatechange', xhr, e)
                // xstatus returns 0
                if (xhr.readyState === 4 && xstatus >= 400 && xstatus < 499) {
                  vm.player.trigger('error', [vm.player, {code: 4}]);
                }
              })
            }
          },
          flashls: {
            manifestloadmaxretry: 3
          },
          hlsQualities: [-1, 1, 3, 6, 7],
          sources: [
            { type: 'application/x-mpegurl', src: url }
          ]
        }
      }).on('error', function (e, api, err) {
        console.log('fp error', err)
        // var delay = initialDelay;
        // clearInterval(timer);

        if (err.code === 2 || err.code === 4) {
          api.shutdown()
          // // it unloads the engine, so api.load() is not working
          // console.log('fp error', err.code, api)
          // api.error = api.loading = false
          // api.load()
          // api.fullscreen()
          // container.className += " is-offline";
          // if (flowplayer.support.flashVideo) {
          //   api.one("flashdisabled", function () {
          //     container.querySelector(".fp-flash-disabled").style.display = "none";
          //   });
          // }
          // timer = setInterval(function () {
          //   var messageElement = container.querySelector(".fp-ui .fp-message");
          //   delay -= 1;
          //   if (delay && messageElement) {
          //     messageElement.querySelector("span").innerHTML = delay;
          //     // only for disconnected user:
          //     messageElement.style.backgroundImage = "url(" + errImage.src + ")";
          //   } else {
          //     clearInterval(timer);
          //     api.error = api.loading = false;
          //     if (messageElement) {
          //       container.querySelector(".fp-ui").removeChild(messageElement);
          //     }
          //     container.className = container.className.replace(/\bis-(error|offline)\b/g, "")
          //     api.load()
          //   }
          // }, 1000)
        }
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
        // console.log('flowplayer pause...')
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
          // this.$store.dispatch('videoPlayer/setUser', response.body)
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

    openStreamDeleteConfirmDialog () {
      this.show_stream_delete_confirm_dialog = true
    },

    closeStreamDeleteConfirmDialog () {
      this.show_stream_delete_confirm_dialog = false
    },

    openShareDialog () {
      this.show_share_dialog = true
    },

    closeShareDialog () {
      this.show_share_dialog = false
    },

    downloadAlbum () {
      // this.openShareDialog()
      AlbumService.downloadAlbum(this.user.stream.assoc.id).then(response => {
        var a = document.createElement('A')
        a.href = response.body.url
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    deleteStream (user) {
      console.log('deleteStream', user)
      this.closePlayer()
      if (user && user.stream) {
        StreamService.deleteStream(user.stream.id).then(response => {
          this.$store.dispatch('auth/setStream', response.body)
          this.$router.push({ path: '/' })
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      }
    },

    closePlayer () {
      if (this.player) {
        this.player.shutdown()
      }
    },

    mutePlayer () {
      if (this.player) {
        this.player.mute(true)
      }
    },

    onClick: function (e) {
      this.closeStreamingConfirmDialog()
      // this.initPlayer('https://edge.flowplayer.org/functional.m3u8')
      // this.initPlayer('https://edge.flowplayer.org/FlowplayerHTML5forWordPress.m3u8')
      this.initPlayer(this.user.stream.mp_channel_1_ep_1_url)
      this.player.load()
      this.player.fullscreen()
    }
  },

  mounted () {
  }
}