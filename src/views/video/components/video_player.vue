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
    }
  },

  created() {
    console.log('video_player created')
    // console.log(this.video)
    this.$nextTick(() => {
      this.initPlayer()
      this.pauseMusicOnPlay()
    })
  },

  beforeDestroy() {
    console.log('video_player beforeDestroy')
    this.closePlayer()
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
      // console.log('video_player init', this.src)
      // console.log(document.getElementById('my_video_player'))
      // console.log(vm.player)
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
      // console.log(vm.player)
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
        console.log(1)
        vm.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
      })
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
