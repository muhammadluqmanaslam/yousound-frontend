<template>
  <div>
    <div class="video-player-wrapper">
      <div id="my_video"></div>
    </div>
  </div>
</template>

<script type="text/javascript">
  // import _ from 'lodash'
  // import Hls from 'hls.js'

  export default {
    components: {
    },

    data () {
      return {
      }
    },

    computed: {
    },

    mounted () {
      console.log('video-player ...')
      console.log(window.flowplayer)

      window.flowplayer('#my_video', {
        splash: 'https://flowplayer.com/media/img/demos/functional@x2.jpg',
        live: true,
        share: false,
        clip: {
          hlsQualities: [-1, 1, 3, 6, 7],
          sources: [
            { type: 'application/x-mpegurl', src: 'https://edge.flowplayer.org/functional.m3u8' }
          ]
        }
      })

      // console.log(Hls)
      // var video = document.getElementById('my_video')
      // if (Hls.isSupported()) {
      //   var hls = new Hls()
      //   hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8')
      //   hls.attachMedia(video)
      //   hls.on(Hls.Events.MANIFEST_PARSED, function () {
      //     video.play()
      //   })
      // } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      //   video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8'
      //   video.addEventListener('loadedmetadata', function () {
      //     video.play()
      //   })
      // }
    }
  }
</script>
