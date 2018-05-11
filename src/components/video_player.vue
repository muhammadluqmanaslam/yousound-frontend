<template>
  <!-- <div class="video-player-wrapper" :class="{'is-hide': !$store.getters['videoPlayer/hasFrame']}"> -->
  <div class="video-player-wrapper is-init">
    <v-dialog v-model="show_streaming_confirm_dialog" content-class="my-dialog-1">
      <v-card>
        <!-- <v-card-media :src="item.cover.url" height="125px" contain></v-card-media> -->
        <v-card-text>
          <div class="headline">Are you sure you want to play the stream?</div>
          <div>This user hosts streamming. It goes full screen mode when you play this stream. You can minimized it later.</div>
        </v-card-text>
        <v-card-actions>
          <v-btn dark color="green" @click="onClick">Yes</v-btn>
          <v-btn dark color="grey" @click.native="closeStreamingConfirmDialog()">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div id="my_video" ref="my_video">
      <div class="my_overlay">
        <!-- <efm-header></efm-header> -->
        <div class="stream-control-warpper"></div>
      </div>
      <i class="fa fa-close close-btn" @click="closePlayer()"></i>
    </div>
  </div>
</template>

<script type="text/javascript">
  // import _ from 'lodash'
  // import Hls from 'hls.js'
  import efmHeader from '@/components/header'

  import { MyEvents } from '@/helper'

  export default {
    components: {
      efmHeader
    },

    data () {
      return {
        player: null,
        show_streaming_confirm_dialog: false
      }
    },

    computed: {
    },

    created () {
      this.$root.$on(MyEvents.VIDEO_PLAYER_INIT, this.init)
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
        }).on('play', function (e, api) {
          console.log('flowplayer play...')
        })
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
        this.initPlayer('https://edge.flowplayer.org/functional.m3u8')
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
</script>
