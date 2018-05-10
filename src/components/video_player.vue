<template>
  <!-- <div class="video-player-wrapper" :class="{'is-hide': !$store.getters['videoPlayer/hasFrame']}"> -->
  <div class="video-player-wrapper is-init">
    <div id="my_video" ref="my_video">
      <div class="my_overlay">
        <efm-header></efm-header>
        <div class="stream-control-warpper"></div>
      </div>
      <div class="my_splash">
        <p>Do you want to play streamming?</p>
        <v-btn @click="onClick">Play</v-btn>
      </div>
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
        player: null
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
      // if (this.player) {
      //   this.player.unload()
      // }
    },

    methods: {
      init () {
        console.log('video-player initializing...')
        // this.player.load('https://edge.flowplayer.org/functional.m3u8')
        this.initPlayer('https://edge.flowplayer.org/functional.m3u8')
      },

      initPlayer (url) {
        const vm = this
        if (vm.player) {
          // vm.player.unload()
          vm.player.shutdown()
        }
        vm.player = window.flowplayer('#my_video', {
          // splash: 'https://flowplayer.com/media/img/demos/functional@x2.jpg',
          // splash: true,
          // autoplay: true,
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
          // playerFrame.addClass('is-fullscreen')
          vm.$store.dispatch('videoPlayer/setFrameMode', 'full')
        }).on('fullscreen-exit', function (e, api) {
          // playerFrame.removeClass('is-fullscreen')
          vm.$store.dispatch('videoPlayer/setFrameMode', 'normal')
        })
      },

      onClick: function (e) {
        this.player.fullscreen()
        this.player.play()
      }
    },

    mounted () {
      console.log('video-player mounted')
      // this.initPlayer('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8')
      /*
      const vm = this
      if (!vm.$store.getters['videoPlayer/isInitalized']) {
        console.log('video-player mounted')
        // console.log(window.flowplayer)
        // console.log(vm.$refs.my_video)

        // window.flowplayer(function (api, root) {
        //   const fsbutton = root.querySelector('.fp-fullscreen')
        //   // append fullscreen button after HD menu is added on ready
        //   api.on('ready', function () {
        //     root.querySelector('.fp-controls').appendChild(fsbutton)
        //   })
        //   // instant fullscreen
        //   api.on('load', function (e, api) {
        //     console.log('flowplayer load')
        //     api.fullscreen()
        //   })
        // })

        // const playerFrame = window.$('#my_video')
        // console.log(window.$)
        // console.log(playerFrame)
        const player = window.flowplayer('#my_video', {
          // splash: 'https://flowplayer.com/media/img/demos/functional@x2.jpg',
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
              { type: 'application/x-mpegurl', src: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8' }
            ]
          }
        }).on('load', function (e, api) {
          console.log('flowplayer load')
          api.fullscreen()
        }).on('fullscreen', function (e, api) {
          // playerFrame.addClass('is-fullscreen')
          vm.$store.dispatch('videoPlayer/setFrameMode', 'full')
        }).on('fullscreen-exit', function (e, api) {
          // playerFrame.removeClass('is-fullscreen')
          vm.$store.dispatch('videoPlayer/setFrameMode', 'normal')
        })
        vm.player = player

        vm.$store.dispatch('videoPlayer/setPlayer', player)
      }
      */
    }
  }
</script>
