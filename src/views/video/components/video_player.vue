<template>
  <video
    ref="myVideoPlayer"
    id="myVideoPlayer"
    class="video-js vjs-default-skin vjs-fluid"
    :class="{onMobile}"
    :playsinline="onMobile"
    controls
    data-setup='{
    "plugins": {
            "vastClient": {
                "adTagUrl": "https://servedbyadbutler.com/vast.spark?setID=14941&ID=182673&pid=141490",
                "adsCancelTimeout": 3000,
                "adsEnabled": true,
                "preferredTech":"html5",
            }
    }}'
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
      videoId: null,
    }
  },

  mounted() {
    this.videoId = this.$route.params.videoId
    // window.videojs(this.$refs.myVideoPlayer);
    // console.log('video_player created')
    this.$nextTick(() => {
      if (!this.pipMode && this.allVideosCount < 1) {
        console.log('init player');

        console.log(this.allVideos);
        // no player in DOM, init a new player
        this.initPlayer()
        let vm = this
        vm.player.exitPictureInPicture()
      } else {
        const nodeDetails2 = this.$store.state.streamPlayer.nodeDetails
        console.log('nodeDetails :', nodeDetails2);

        console.log('player already init');
        console.log(this.$store.state.streamPlayer.nodeDetails);

        console.log(this.allVideos);
        // there is a player in DOM, update original div wrapper
        // this is a fix for the DOM dissapearing when video page is re-visited
        let nodeDetails = this.$store.state.streamPlayer.nodeDetails
        let glitchedVid = document.getElementById('my_video_player')

        console.log('nodeDetails', nodeDetails);
        console.log('glitchedVid', glitchedVid);

        console.log('replace');

        glitchedVid.replaceWith(nodeDetails.parent)
      }
    })
  },
  created() {},

  beforeDestroy() {
    try {
      const vm = this
      if (vm.player && !vm.player.paused()) {
        // player is playing, toggle pipmode
        this.togglePip()
      } else {
        // player is not playing, close player
        this.closePlayer()
      }
    } catch (error) {
      return error
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
        },
      ])
    },
  },
  methods: {
    initPlayer() {
      const vm = this
      vm.player =
        vm.player ||
        window.videojs('myVideoPlayer', {
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

        // reset store
        this.$store.dispatch('streamPlayer/setPipParentNode', {})
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

      // ontoggle, set pipMode status in store
      vm.$store.dispatch('streamPlayer/setPipPipMode', true)
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
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
}
</script>

<style lang="scss">
.video-js button {
  outline: none;
  box-shadow: none;
}

.video-js .vjs-big-play-button {
// position: relative;
}
.video-js.vjs-fluid {
  max-height: 572px;
  padding-top: 56.25%;
  video {
    max-height: 572px;
  }
}
.onMobile {
  .video-js button {
    border: 0;
    background-color: transparent;
  }
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
