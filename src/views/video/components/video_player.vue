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

    <div v-if="this.user">
      <v-dialog v-model="show_modalCard1" content-class="dialog-w_auto dialog-no_shadow">
        <div class="modal-card">
          <div>
            <img src="../../../assets/nav_logo_white.png" width="135px">
              </div>
              <div class="modal-card-img">
                <div class="modal-card-img-inner" :style="{'background-image': 'url(' + this.user.avatar.thumb.url + ')',}">
                </div>
            </div>
            <div class="text-center user-box">
              <p>Sign up to experience</p>
              <div class="user-div">
                <p class="user-text"> {{ this.user.username }}</p>
                <img src="../../../assets/check-white.svg" width="15px">
            </div>
          </div>

          <div class="button-wrapper">
            <router-link to="/signup">
              <button class="modal-button">
                Create account
              </button>
            </router-link>
          </div>

        </div>
      </v-dialog>

      <!-- Show MOdal 2 -->

      <v-dialog v-model="show_modalCard2" content-class="dialog-w_auto dialog-no_shadow">
        <div class="modal-card">
          <div>
            <img src="../../../assets/nav_logo_white.png" width="135px">
              </div>
              <div class="modal-card-img">
                <div class="modal-card-img-inner" :style="{'background-image': 'url(' + this.user.avatar.thumb.url + ')',}"></div>

              </div>
            <div class="text-center user-box">
              <p>Sign up to experience</p>
              <div class="user-div">
                <p class="user-text"> {{ this.user.username }}</p>
                <img src="../../../assets/check-white.svg" width="15px">
            </div>
          </div>

          <div class="text-center font-inter">
            <p>Get full access. <b>50%</b> of your subscription is shared with creators you stream most. See who you support!</p>
          </div>

          <div class="button-wrapper">
            <router-link to="/settings">
              <button class="modal-button">
                Start 30 day free trial
              </button>
            </router-link>
          </div>

        </div>
      </v-dialog>

      <!-- Show MOdal 3 -->

      <v-dialog v-model="show_modalCard3" content-class="dialog-w_50 dialog-no_shadow">
        <div class="modal-card-main">
          <div class="modal-card-split">
            <div>
              <img src="../../../assets/nav_logo_white.png" width="135px">
                </div>
                <div class="modal-card-img">
                <div class="modal-card-img-inner" :style="{'background-image': 'url(' + this.user.avatar.thumb.url + ')',}"></div>
              </div>
              <div class="user-box">
                <p>Sign up to experience</p>
                <div class="user-div">
                  <p class="user-text">{{ this.user.username }}</p>
                  <img src="../../../assets/check-white.svg" width="15px">
              </div>
            </div>

            <!-- <div class="text-center">
              <p>Get full access. <b>50%</b> of your subscription is shared with creators you stream most. See who you support!</p>
            </div> -->

            <div class="button-wrapper">
              <router-link to="/signup">
                <button class="modal-button">
                  Create account
                </button>
              </router-link>
            </div>

          </div>

          <div class="modal-card-title-img" :style="`background-image: url(${videoLoading})`">
            <video playsinline autoplay loop id="bgvid">
              <source v-if="spotlightVideoSource" :src="`https://stream.mux.com/${spotlightVideoSource}/low.mp4`"  type="video/mp4">
            </video>
            <div class="volume-button">
              <img src="../../../assets/mute-icon.svg" width="17px">
            </div>

          </div>
        </div>
      </v-dialog>

      <!-- Show MOdal 4 -->

      <v-dialog v-model="show_modalCard4" content-class="dialog-w_50 dialog-no_shadow">
        <div class="modal-card-main">
          <div class="modal-card-split">
            <div>
              <img src="../../../assets/nav_logo_white.png" width="135px">
                </div>
                <div class="modal-card-img">
                <div class="modal-card-img-inner" :style="{'background-image': 'url(' + this.user.avatar.thumb.url +')',}"></div>
              </div>
              <div class="user-box">
                <p>Sign up to experience</p>
                <div class="user-div">
                  <p class="user-text">{{ this.user.username }}</p>
                  <img src="../../../assets/check-white.svg" width="15px">
              </div>
            </div>

            <div class="font-inter">
              <p>Get full access. <b>50%</b> of your subscription is shared with creators you stream most. See who you support!</p>
            </div>

            <div class="button-wrapper" >
              <router-link to="/settings">
                <button class="modal-button">
                  Start 30 day free trial
                </button>
              </router-link>
            </div>
          </div>

          <div class="modal-card-title-img" :style="`background-image: url(${videoLoading})`">
            <video playsinline autoplay loop id="bgvid">
              <source v-if="spotlightVideoSource" :src="`https://stream.mux.com/${spotlightVideoSource}/low.mp4`" type="video/mp4">
            </video>
            <button class="volume-button">
              <img src="../../../assets/mute-icon.svg" width="17px">
            </button>

          </div>
        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { MyEvents } from '@/helper'
import UserService from '@/services/user'
import AuthService from '@/services/auth'
import TrackingService from '@/services/tracking'
import StreamService from '@/services/stream'

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
      endPlayTime: 0,
      totalPlayTime: 0,
      seekTime1: 0,
      seekTime2: 0,
      bgDemoImg: require('../../../assets/tile-1.jpeg'),
      videoLoading: require('../../../assets/loading.gif'),
      show_modalCard1: false,
      show_modalCard2: false,
      show_modalCard3: false,
      show_modalCard4: false,
      spotlightVideoSource: null,
      user: null,
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
    async fetchSpotlightVideo() {
      await this.getUserDetailFromStream();
      StreamService.getSpotlightStream(this.user.id)
        .then((response) => {
          console.log("response", response)
          this.spotlightVideoSource = response.body.mp_channel_1_ep_1_id
          if (this.currentUser == null) {
            this.show_modalCard3 = true
          } else {
            this.show_modalCard4 = true
          }
        })
        .catch((e) => {
          if (this.currentUser == null) {
            this.show_modalCard1 = true
          } else {
            this.show_modalCard2 = true
          }
        })
    },
    initPlayer() {
      if (this.currentUser.free_trial_time <= 0 && !this.isSubscribed) {
        this.fetchSpotlightVideo()
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
      const vm = this
      vm.updateUserInfo();
      if (vm.player) {
        vm.player.dispose()
        vm.player = null

        // reset store
        this.$store.dispatch('streamPlayer/setPipParentNode', {})
      }
    },

    pauseMusicOnPlay() {
      const vm = this

      vm.player.on('ended', function() {
        if (vm.totalPlayTime === 0) {
          vm.totalPlayTime = vm.player.currentTime()
        } else {
          vm.totalPlayTime = vm.totalPlayTime + Math.floor(vm.player.duration() - vm.endPlayTime)
        }
        if (vm.totalPlayTime >= 30 && vm.isSubscribed) {
          let params = { stream_id: vm.videoId, duration: Math.floor(vm.totalPlayTime) }

          TrackingService.createPlayRecord(params)
          .then((response) => {
            console.log(response)
          })
          .catch((e) => {
            console.log("error in updating record")
          })
        }
        vm.totalPlayTime = 0;
        vm.seekTime1 = 0;
        vm.seekTime2 = 0;
        vm.endPlayTime = 0
      });

      vm.player.on('play', () => {
        vm.remainingTime = 0
        clearTimeout(vm.stillListeningTimer);
        clearInterval(vm.remainingTimerCalculator);
        vm.stillListeningTimer = setTimeout(vm.stillPlaying, 3600000)
        vm.remainingTimerCalculator = setInterval(vm.timeCounter, 1000)
        vm.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
      })

      vm.player.on('pause', () => {
        vm.updateUserInfo();
        vm.remainingTime = 0
        clearTimeout(vm.stillListeningTimer);
        clearInterval(vm.remainingTimerCalculator);
        if (vm.totalPlayTime === 0) {
          vm.totalPlayTime = vm.totalPlayTime + Math.floor(vm.seekTime1);
        } else {
          vm.totalPlayTime = vm.totalPlayTime + Math.floor(vm.seekTime1 - vm.endPlayTime)
        }
        vm.endPlayTime = vm.seekTime2
        console.log("================ playing time ", vm.totalPlayTime)
      })

      vm.player.on('timeupdate', function() {
        vm.seekTime1 = vm.seekTime2;
        vm.seekTime2 = vm.player.currentTime();
      });
    },

    timeCounter() {
      if (this.currentUser.free_trial_time <= this.remainingTime && !this.isSubscribed) {
        this.player.pause();
        this.updateUserInfo();
        this.fetchSpotlightVideo()
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

    async getUserDetailFromStream() {
      const stream_id = this.$route.params.videoId
      await StreamService.getStream(stream_id)
        .then((response) => {
          this.user = response.body.user
        })
        .catch((e) => {
          console.log(e)
        })
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
<style src="../../../../static/styles/spotlight.scss" ></style>