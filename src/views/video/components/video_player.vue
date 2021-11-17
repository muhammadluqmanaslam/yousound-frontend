<template>
  <video
    ref="myVideoPlayer"
    id="my_video_player"
    class="video-js vjs-default-skin vjs-fluid"
    controls
  ></video>
</template>

<script>
import { MyEvents } from '@/helper'

export default {
  props: {
    // video: Object,
    src: {
      type: String,
    },
  },

  data() {
    return {
      player: null,
      pipMode: false,
    }
  },

  mounted() {
    console.log('video_player created')
    this.$nextTick(() => {
      if (!this.pipMode && this.allVideosCount < 1) {
        // no player in DOM, init a new player
        this.initPlayer()
      } else {
        // there is a player in DOM, update original div wrapper
        // this is a fix for the DOM dissapearing when video page is re-visited
        let nodeDetails = this.$store.state.streamPlayer.nodeDetails
        let glitchedVid = document.getElementById('my_video_player')

        glitchedVid.replaceWith(nodeDetails.parent)
      }
    })
  },
  created() {},

  beforeDestroy() {
    const vm = this
    if (!vm.player.paused()) {
      // player is playing, toggle pipmode
      this.togglePip()
    } else {
      // player is not playing, close player
      this.closePlayer()
    }
  },

  watch: {
    src: function (newVal, oldVal) {
      console.log('video_player watching')
      console.log(newVal, oldVal)
      console.log(this.src)
      this.player.src([
        {
          type: 'application/x-mpegURL',
          src: this.src,
          // 'https://stream.mux.com/k2XvrNIFth736J8WZpN5czeEqSsNlsp02GUu4W00YDu02Q.m3u8',
        },
      ])
    },
  },
  methods: {
    initPlayer() {
      const vm = this
      vm.player =
        vm.player ||
        window.videojs('my_video_player', {
          autoplay: false,
          controls: true,
          sources: [
            {
              type: 'application/x-mpegURL',
              src: this.src,
            },
          ],
        })

      // register method
      this.pauseMusicOnPlay()
    },

    closePlayer() {
      const vm = this
      if (vm.player) {
        vm.player.dispose()
        vm.player = null
      }
    },

    pauseMusicOnPlay() {
      const vm = this
      vm.player.on('play', () => {
        vm.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
      })
    },
    async togglePip() {
      const vm = this
      console.log('activate pip')
      vm.pipMode = true
      await vm.player.requestPictureInPicture()

      // resume player play
      // fix for sudden pause of pip on activation
      vm.player.play()
    },
  },

  computed: {
    allVideos() {
      // eslint-disable-next-line no-undef
      return videojs.getAllPlayers()
    },
    allVideosCount() {
      return this.allVideos.length
    },
  },
}
</script>

<style lang="scss">
.video-js .vjs-big-play-button {
// position: relative;
}
// .video-js::after {
//   content: "";
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   background: blue;
//   top: 0;
//   left: 0;
//   z-index: 0;
// }
// .video-js .vjs-big-play-button::after {
//   content: "";
//   position: absolute;
//   width: 100%;
//   height: 100%;
// }
</style>
