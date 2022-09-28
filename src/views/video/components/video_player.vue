<template>
  <div :style="{'pointer-events':  currentUser.free_trial_time <= 0 && !this.isSubscribed ? 'none' : ''}">
    <video
      ref="myVideoPlayer"
      id="myVideoPlayer"
      class="video-js vjs-default-skin vjs-fluid"
      :class="{onMobile}"
      :playsinline="onMobile"
      :disabled="true"
      controls
    ></video>

    <v-dialog v-model="showListeningMessage">
      <v-card>
        <v-card-title class="headline"
          >Still Listening</v-card-title
        >
        <v-card-text
          >Are you still Listening?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="hideListeningMessage"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { MyEvents } from '@/helper'
import UserService from '@/services/user'
import AuthService from '@/services/auth'

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
      remainingTimerCalculator: null,
      remainingTime: 0,
      stillListeningTimer: null,
      showListeningMessage: false,
      isSubscribed: false,
    }
  },

  async mounted() {
    await this.fetchSubscriptionDetails();
    this.videoId = this.$route.params.videoId

    console.log('video_player created adfasdfsdfsdf')
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
        let glitchedVid = document.getElementById('myVideoPlayer')

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
      console.log('video_player watchingjjkjkjk   jkjkjk ')
      console.log(newVal, oldVal)
      console.log("this.src--->", this.src)
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
      if (this.currentUser.free_trial_time <= 0 && !this.isSubscribed) {
        this.$store.dispatch(
          'error/showErrorToast', ["You must be subscribed in order to view video."]
        )
      }
      const vm = this
      console.log("this.src--->", this.src)
      vm.player =
        vm.player || window.videojs('myVideoPlayer', {
          autoplay: false,
          controls: true,
          sources: [
            {
              type: 'application/x-mpegURL',
              src: this.src,
            },
          ],
        })
      this.pauseMusicOnPlay();
      console.log("=====stripe_subscription_id=====", this.currentUser.stripe_subscription_id)
      if (this.currentUser.stripe_subscription_id === undefined || this.currentUser.stripe_subscription_id === null) {
        var options = {
          id: "myVideoPlayer",
        };
        vm.player.ima(options);
        vm.player.ima.initializeAdDisplayContainer();
        vm.player.ima.setContentWithAdTag(null, "https://servedbyadbutler.com/vast.spark?setID=14941&ID=182673&pid=141490", false);
        vm.player.ima.requestAds();
        // register method
      }
    },

    closePlayer() {
      this.updateUserInfo();
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
          this.remainingTime = 0
          clearTimeout(this.stillListeningTimer);
          clearInterval(this.remainingTimerCalculator);
          this.stillListeningTimer = setTimeout(this.stillPlaying, 3480000)
          this.remainingTimerCalculator = setInterval(this.timeCounter, 1000)
          vm.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
        })

        vm.player.on('pause', () => {
          this.updateUserInfo();
          this.remainingTime = 0
          clearTimeout(this.stillListeningTimer);
          clearInterval(this.remainingTimerCalculator);
        })
    },

    timeCounter() {
      if (this.currentUser.free_trial_time <= this.remainingTime && !this.isSubscribed) {
        this.player.pause();
        this.updateUserInfo();
        this.$store.dispatch(
          'error/showErrorToast', ["You must be subscribed in order to view video."]
        )
      } else {
        this.remainingTime = this.remainingTime + 1;
      }
    },

    stillPlaying(){
      this.player.pause();
      this.showListeningMessage = true
    },

    hideListeningMessage() {
      this.showListeningMessage = false;
    },

    updateUserInfo() {
      const params = {
        user: { free_trial_time: this.remainingTime },
      }
      if (this.remainingTime > 0) {
        UserService.updateUserInfo(this.currentUser.id, params)
        .then((response) => {
          AuthService.setUser(response.body)
        })
        .catch((e) => {
          console.log(e)

          this.$store.dispatch(
            'error/showErrorToast', ["There was an error on updating user info "]
          )
        })
      }
      clearTimeout(this.stillListeningTimer);
      clearInterval(this.remainingTimerCalculator);
      this.remainingTime = 0
    },

    async fetchSubscriptionDetails() {
      await UserService.getSubscriptionDetail(this.currentUser.id)
      .then((response) => {
        if (response.bodyText === "Subscribed") {
          this.isSubscribed = true
        }
      })
      .catch((e) => {
        this.$store.dispatch(
          'error/showErrorToast', ["There was an error on fetching user info "]
        )
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
    currentUser() {
      return this.$store.state.auth.user
    },
  },
}
</script>

<style lang="scss">
.video-js .vjs-big-play-button {
  top: 44% !important;
  left: 44% !important;
}
.video-js button {
  outline: none;
  box-shadow: none;
}
.ima-ad-container{
  left:0 !important;
  top:0 !important;
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
