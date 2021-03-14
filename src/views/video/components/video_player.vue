<template>
  <video
    ref="myVideoPlayer"
    id="my_video_player"
    class="video-js vjs-default-skin vjs-fluid"
    controls
  ></video>
</template>

<script>
export default {
  props: {
    video: Object,
  },

  data() {
    return {
      player: null,
    }
  },

  created() {
    console.log('video_player created')
    console.log(this.video)
    console.log(document.getElementById('my_video_player'))
    this.$nextTick(() => {
      this.initPlayer()
    })
  },

  watch: {
    video: function (newVal, oldVal) {
      console.log('-----------')
      console.log(newVal, oldVal)
      console.log(this.video.mp_channel_1_ep_1_url)
      this.player.src([
        {
          type: 'application/x-mpegURL',
          src: this.video.mp_channel_1_ep_1_url,
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
          autoplay: true,
          controls: true,
          sources: [],
        })
    },
  },
}
</script>

<style lang="scss" scoped></style>
