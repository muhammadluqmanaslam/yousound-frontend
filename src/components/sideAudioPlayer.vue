<template>
  <div class="side-player" v-if="$store.getters['player/isPlaying']">
    <div class="hr-container top">
      <v-divider class="above-cover"></v-divider>
    </div>
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

    <v-dialog v-model="showRegisterModal">
      <v-card>
        <v-card-title class="headline"
          >Register</v-card-title
        >
        <v-card-text
          >Please do signup if you want to proceed.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="side-player-inner">
      <div class="track-detail-section">
        <div class="track-cover-container" :style="{width: isMini ? '100%' : ''}">
          <router-link :to="`/${item.album_type}/${item.slug}`">
            <template v-if="item.album_type == 'playlist'">
              <div
                class="track-cover-image"
                :class="item.album_type"
                :style="{
                  'background-image': `url(${album1Cover}), url(${album2Cover}), url(${album3Cover}), url(${album4Cover})`,
                }"
              ></div>
            </template>
            <template v-else>
              <div
                class="track-cover-image"
                :style="{ 'background-image': 'url(' + item.cover.url + ')' }"
              ></div>
            </template>
          </router-link>
        </div>
        <div class="track-info-container">
          <div class="track-info">
            <div class="dflex justify-space-between align-center">
              <div v-if="!isMini" class="track-index" id="trackIndex">{{ trackIndex }}</div>

              <div v-if="!isMini" class="follow-meta">
                <div class="dflex align-center justify-space-between width100">
                  <div class="actions-section flex-none" :class="{_mini: isMini}">
                    <v-menu offset-y dark class="dots-wrapper">
                      <v-icon right slot="activator">more_horiz</v-icon>
                      <v-list>
                        <v-list-tile>
                          <v-tooltip right>
                            <v-btn
                              depressed
                              color="transparent ma-0"
                              slot="activator"
                              @click.native="
                                showShareModal = true;
                                modalMode = true;
                              "
                            >
                              <img src="/static/images/ic_share.svg" width="20" />
                            </v-btn>
                            <span>Share</span>
                          </v-tooltip>
                        </v-list-tile>

                        <v-list-tile v-if="stripeConnected">
                          <v-tooltip right>
                            <v-btn
                              depressed
                              color="transparent ma-0"
                              @click.native="
                                showDownloadModal = true;
                                modalMode = true;
                              "
                              slot="activator"
                            >
                              <img
                                src="/static/images/ic_download.svg"
                                width="20"
                              />
                            </v-btn>
                            <span>Download</span>
                          </v-tooltip>
                        </v-list-tile>

                        <v-list-tile>
                          <v-tooltip right>
                            <v-btn
                              depressed
                              color="transparent ma-0"
                              slot="activator"
                              @click.native="repostItem()"
                            >
                              <img src="/static/images/ic_repost.svg" width="20" />
                            </v-btn>
                            <span>Repost</span>
                          </v-tooltip>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!isMini" class="dflex justify-space-between align-center mt-2">
            <div style="max-width: 50%">
              <label class="track-name" id="trackName">{{ track.name }}</label>
              <div class="user-info">
                <template v-if="item.collaborators_count > 0">
                  <router-link class="user-name" :to="'/' + item.user.slug">{{
                    item.user.username
                  }}</router-link>
                  <template v-for="c in item.collaborators">
                    <span :key="`span-${c.user.id}`">,&nbsp;</span>
                    <!-- <router-link
                        :key="`link-${c.user.id}`"
                        class="user-name"
                        :to="`/${c.user.slug}`"
                        >{{ c.user.username }}</router-link
                      > -->
                  </template>
                  <!-- <router-link class="user-name" :to="`/${item.album_type}/${item.slug}`">Multiple Collaborators</router-link> -->
                </template>
                <template v-else-if="item.album_type == 'album'">
                  <router-link class="user-name" :to="'/' + item.user.slug">{{
                    item.user.username
                  }}</router-link>
                </template>
                <template v-else>
                  <router-link class="user-name" :to="'/' + track.user.slug">{{
                    track.user.username
                  }}</router-link>
                </template>
              </div>
            </div>

            <div style="max-width: 50%">
              <template v-if="item.collaborators_count > 0">
                <template v-for="c in item.collaborators">
                  <span :key="`span-${c.user.id}`">,&nbsp;</span>
                  <!-- <router-link
                    :key="`link-${c.user.id}`"
                    class="user-name"
                    :to="`/${c.user.slug}`"
                    >{{ c.user.username }}</router-link
                  > -->
                </template>
              </template>

              <template v-else-if="item.album_type == 'album'">
                <user-follow-btn
                  v-if="currentUser && item.user.id != currentUser.id"
                  :user="item.user"
                  theme="dark"
                  type="player"
                />
              </template>

              <template v-else>
                <user-follow-btn
                  v-if="currentUser && track.user.id != currentUser.id"
                  :user="item.user"
                  theme="dark"
                  type="player"
                />
              </template>
            </div>

          </div>
        </div>
      </div>

      <div class="hr-container bottom">
        <v-divider></v-divider>
      </div>
    </div>

    <div
      v-if="!isMini"
      class="player-section-container"
      :class="{ 'd-block': isLoaded, 'dflex': !isLoaded }"
    >
      <div class="loading flex-none" id="loading" v-if="!isLoaded"></div>
      <div class="player-section" v-if="isLoaded">
        <div class="controls-section">
          <!-- <div class="volume-container">
            <div class="volume">
              <v-slider
                v-model="volume"
                @input="updateVolume"
                thumb-label
                class="volume-ranger"
                hide-details
              ></v-slider>
              <img src="/static/images/ic_sound.svg" width="20" />
            </div>
          </div> -->

          <!-- Previous Button -->
          <v-btn
            :ripple="false"
            flat
            class="player-control-btn no-Btn-bg _prev"
            @click.native="skip('prev')"
          >
            <img src="/static/images/ic_rewind.svg" width="20" />
          </v-btn>

          <!-- Play Button -->
          <v-btn
            :ripple="false"
            flat
            class="player-control-btn play no-Btn-bg _play"
            @click.native="$root.$emit(MyEvents.AUDIO_PLAYER_REPLAY)"
            id="play"
            v-if="!isPlaying"
          >
            <img src="/static/images/ic_play.svg" height="26" />
          </v-btn>

          <!-- Pause Button -->
          <v-btn
            :ripple="false"
            flat
            class="player-control-btn pause no-Btn-bg _pause"
            id="pause"
            v-if="isPlaying"
            @click.native="pause()"
          >
            <img src="/static/images/ic_pause.svg" height="26" />
          </v-btn>
          <v-btn
            :ripple="false"
            flat
            class="player-control-btn no-Btn-bg _next"
            @click.native="skip('next')"
          >
            <img src="/static/images/ic_skip.svg" width="20" />
          </v-btn>

          <!-- <v-btn
            class="player-control-btn"
            :class="{ selected: isRepeated }"
            @click.native="setRepeated()"
          >
            <img src="/static/images/ic_refresh.svg" width="18" />
          </v-btn> -->
        </div>

        <div class="bar-section">
          <label class="duration-time played" id="playedTime">{{
            playedTime
          }}</label>
          <v-spacer>
            <v-slider
              class="player-bar"
              v-model="progress"
              @click.native="seek(progress)"
              hide-details
            ></v-slider>
          </v-spacer>
          <label class="duration-time total" id="totalTime">{{
            totalTime
          }}</label>
        </div>
      </div>
      <div class="reminder-section" v-if="showReminder">
        <div class="media d-flex">
          <div class="media__image"></div>
          <div class="media__content">
            <div class="media__title">Reminder!</div>
            <div class="media__description">
              Support your favorite artists & brands
            </div>
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="modalMode">
      <share-modal
        v-if="showShareModal"
        :item="item"
        :dismiss="dismissShareDialog"
      ></share-modal>

      <download-modal
        v-if="showDownloadModal"
        :item="item"
        :track="track"
        :dismiss="dismissDownloadDialog"
      ></download-modal>
    </v-dialog>

    <!-- Show MOdal 1 -->

    <v-dialog v-model="show_modalCard1" content-class="dialog-w_auto dialog-no_shadow">
      <div class="modal-card">
        <div>
          <img src="../assets/nav_logo_white.png" width="135px">
            </div>
            <div class="modal-card-img">
              <div class="modal-card-img-inner" :style="{'background-image': 'url(' + this.user.avatar.thumb.url + ')',}">
              </div>
          </div>
          <div class="text-center user-box">
            <p>Sign up to experience</p>
            <div class="user-div">
              <p class="user-text"> {{ this.user.username }}</p>
              <img src="../assets/check-white.svg" width="15px">
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
          <img src="../assets/nav_logo_white.png" width="135px">
            </div>
            <div class="modal-card-img">
            <div class="modal-card-img-inner"
            :style="`background-image: url(${bgDemoImg})`"
            ></div>
          </div>
          <div class="text-center user-box">
            <p>Sign up to experience</p>
            <div class="user-div">
              <p class="user-text"> {{ this.user.username }}</p>
              <img src="../assets/check-white.svg" width="15px">
          </div>
        </div>

        <div class="text-center font-inter">
          <p>Get full access. <b>50%</b> of your subscription is shared with creators you stream most. See who you support!</p>
        </div>

        <div class="button-wrapper">
          <button class="modal-button">
            Start 30 day free trial
          </button>
        </div>

      </div>
    </v-dialog>

    <!-- Show MOdal 3 -->

    <v-dialog v-model="show_modalCard3" content-class="dialog-w_50 dialog-no_shadow">
      <div class="modal-card-main">
        <div class="modal-card-split">
          <div>
            <img src="../assets/nav_logo_white.png" width="135px">
              </div>
              <div class="modal-card-img">
              <div class="modal-card-img-inner" :style="{'background-image': 'url(' + this.user.avatar.thumb.url + ')',}"></div>
            </div>
            <div class="user-box">
              <p>Sign up to experience</p>
              <div class="user-div">
                <p class="user-text">{{ this.user.username }}</p>
                <img src="../assets/check-white.svg" width="15px">
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
          <video playsinline autoplay muted loop id="bgvid">
            <source :src="this.spotlightVideoSource" type="video/webm">
          </video>
          <div class="volume-button">
            <img src="../assets/mute-icon.svg" width="17px">
          </div>

        </div>
      </div>
    </v-dialog>

    <!-- Show MOdal 4 -->

    <v-dialog v-model="show_modalCard4" content-class="dialog-w_50 dialog-no_shadow">
      <div class="modal-card-main">
        <div class="modal-card-split">
          <div>
            <img src="../assets/nav_logo_white.png" width="135px">
              </div>
              <div class="modal-card-img">
              <div class="modal-card-img-inner" :style="{'background-image': 'url(' + this.user.avatar.thumb.url +')',}"></div>
            </div>
            <div class="user-box">
              <p>Sign up to experience</p>
              <div class="user-div">
                <p class="user-text">{{ this.user.username }}</p>
                <img src="../assets/check-white.svg" width="15px">
            </div>
          </div>

          <div class="font-inter">
            <p>Get full access. <b>50%</b> of your subscription is shared with creators you stream most. See who you support!</p>
          </div>

          <div class="button-wrapper">
            <button class="modal-button">
              Start 30 day free trial
            </button>
          </div>

        </div>

        <div class="modal-card-title-img" :style="`background-image: url(${videoLoading})`">
          <video playsinline autoplay muted loop id="bgvid">
            <source :src="this.spotlightVideoSource" type="video/webm">
          </video>
          <button class="volume-button">
            <img src="../assets/mute-icon.svg" width="17px">
          </button>

        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Howl, Howler } from "howler";
import AlbumService from "@/services/album";
import TrackingService from '@/services/tracking'
// import PaymentService from '@/services/payment'
import TrackService from "@/services/track"
import UserService from '@/services/user'
import AuthService from '@/services/auth'
import StreamService from '@/services/stream'

import { MyEvents } from "@/helper";
import downloadModal from "@/components/downloadmodal";
import shareModal from "@/components/sharemodal";
import UserFollowBtn from "@/components/userFollowBtn";

export default {
  props: {
    isMini: Boolean,
  },

  components: {
    downloadModal,
    shareModal,
    UserFollowBtn,
  },

  data() {
    return {
      modalMode: false,
      playlist: [],
      index: 0,
      isLoaded: false,
      isRepeated: false,
      isPlaying: false,
      trackIndex: null,
      trackName: null,
      track: {},
      playedTime: 0,
      progress: 0,
      volume: 100,
      lastVolume: 100,
      showDownloadModal: false,
      showShareModal: false,
      showListeningMessage: false,
      showReminder: false,
      totalTime: null,
      buttonHover: false,
      stillListeningTimer: null,
      remainingTimerCalculator: null,
      remainingTime: 0,
      remainingStillListenerTimer: 0,
      isSubscribed: false,
      previewTimeCompleted: false,
      showRegisterModal: false,
      endPlayTime: 0,
      totalPlayTime: 0,
      playingSound: null,
      lastSeekTime: 0,
      bgDemoImg: require('../assets/tile-1.jpeg'),
      videoLoading: require('../assets/loading.gif'),
      show_modalCard1: false,
      show_modalCard2: false,
      show_modalCard3: false,
      show_modalCard4: false,
      spotlightVideoSource: null,
    };
  },

  computed: {
    ...mapGetters({
      reminderTracksCount: "app/reminderTracksCount",
    }),

    currentUser() {
      return this.$store.state.auth.user;
    },

    MyEvents() {
      return MyEvents;
    },

    item() {
      console.log(item);
      const item =
        this.$store.state.player.list[this.$store.state.player.listIndex];
      if (!item) {
        return null;
      }

      if (item.assoc_type) {
        return item.assoc;
      } else {
        return item;
      }
    },

    user() {
      if (!this.item) {
        return null;
      }

      if (this.item.album_type === "album") {
        return this.item.user;
      } else {
        return this.track.user;
      }
    },

    stripeConnected() {
      return this.user.stripe_connected;
    },

    album1Cover() {
      return this._.get(this.item.tracks, "[0].album.cover.url");
    },

    album2Cover() {
      return this._.get(this.item.tracks, "[1].album.cover.url");
    },

    album3Cover() {
      return this._.get(this.item.tracks, "[2].album.cover.url");
    },

    album4Cover() {
      return this._.get(this.item.tracks, "[3].album.cover.url");
    },
  },

  created() {
    Howler.volume(this.volume / 100);
  },

  watch: {
    showDownloadModal(val) {
      this.triggerModalMode(val);
    },
    showShareModal(val) {
      this.triggerModalMode(val);
    },

    isPlaying(val) {
      if (val) {
        // Pause video on audio play
        try {
          // eslint-disable-next-line no-undef
          var pp = videojs("myVideoPlayer");
          if (!pp.paused()) {
            pp.pause();
          }
        } catch (error) {
          // console.log(error)
        }
      }
    },
  },

  methods: {
    ...mapActions({
      setPlaying: "player/setPlayingStatus",
      setPauseStatus: "player/setPauseStatus",
    }),

    startPlaying(index) {
      this.setPlaylist("next");
      this.play(index);
      this.$forceUpdate();
    },

    triggerModalMode(val) {
      if (!val) {
        this.modalMode = false;
      }
    },

    resetPlayer() {
      if (this.$store.state.player.isPlaying) {
        this.setPlaying(false);
        this.pause();
        this.setPauseStatus(false);
        this.$store.dispatch("player/setPlaylist", []);
        this.$store.dispatch("player/setListIndex", -1);
        this.$store.dispatch("player/setTrackIndex", -1);
        for (let index in this.playlist) {
          let item = this.playlist[index];
          if (item) {
            if (item.howl) {
              item.howl.unload();
            }
          }
        }
        this.playlist = [];
        this.index = 0;
        this.isLoaded = false;
        this.isRepeated = false;
        this.isPlaying = false;
        this.trackIndex = null;
        this.trackName = null;
        this.track = {};
        this.playedTime = 0;
        this.progress = 0;
        this.showDownloadModal = false;
        this.totalTime = null;
        this.buttonHover = false;
      }
    },

    fetchSpotlightVideo() {
      StreamService.getSpotlightStream(this.user.id)
        .then((response) => {
          console.log("response", response)
          if (this.currentUser == null) {
            this.show_modalCard3 = true
            this.spotlightVideoSource = response.body.mp_channel_1_ep_1_url
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

    trigger() {
      document.addEventListener('keydown', (e) => {
        if (e.key != null && this.isPlaying) {
          this.clearStillListeningTimer(true);
        }
      })

      document.addEventListener('mousemove', (e) => {
        if (this.isPlaying) {
          this.clearStillListeningTimer(true);
        }
      })
    },

    play(index) {
      if (this.currentUser) {
        this.remainingTimerCalculator = setInterval(this.timeCounter, 1000);
        this.fetchSubscriptionDetails();
        this.clearStillListeningTimer();
      }
      // console.log('player', index, this.index, this.playlist)
      // unload and stop all previous sounds.
      for (var i = 0; i < Howler._howls.length; i++) {
        Howler._howls[i].unload();
      }
      var self = this;
      var sound;
      index = typeof index === "number" ? index : this.index;
      var data = this.playlist[index];

      // Update the track display.
      // track.innerHTML = (index + 1) + '. ' + data.title
      // this.trackName = this.playlist[index].track.name
      this.trackIndex = index + 1 + " of " + this.playlist.length;
      this.track = this.playlist[index].track;
      console.log("player play track sideAudioPlayer", this.track);
      this.$store.dispatch("player/setCurrentPlayingTrack", this.track);

      // If we already loaded self track, use the current one.
      // Otherwise, setup and load a new Howl.
      if (data.howl) {
        console.log("--data.howl---->", data.howl)
        sound = data.howl;
        this.playingSound = sound
        try {
          sound.seek();
        } catch (error) {
          this.endPlayTime = 0;
        }
      } else {
        console.log("--data.track.audio---->", data.track)
        sound = data.howl = new Howl({
          src: data.track.mp_channel_1_ep_1_url,
          html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
          onplay: function () {
            // Display the duration.
            self.totalTime = self.formatTime(Math.round(sound.duration()));

            // Start upating the progress of the track.
            requestAnimationFrame(self.step.bind(this));

            // Start the wave animation if we have already loaded
            self.isPlaying = true;
            self.setPauseStatus(false);
            if (self.currentUser == null) {
              let publicUserLimit = setInterval(() => {
                if (sound.seek() >= 30) {
                  self.setPauseStatus(true);
                  self.isPlaying = false;
                  sound.pause()
                  self.fetchSpotlightVideo()
                  clearInterval(publicUserLimit);
                }
              }, 1000)
            }
          },
          onload: function () {
            // Start the wave animation.
            self.isLoaded = true;
          },
          onend: function () {
            // Stop the wave animation.
            // this.isLoaded = false
            // this.isPlaying = false
            if (self.currentUser) {
              localStorage.setItem("remainingTime", localStorage.getItem("remainingTime") - self.remainingStillListenerTimer * 1000)
            }
            if (self.isRepeated) {
              self.skipTo(self.index);
            } else {
              self.skip("right");
            }
          },
          onpause: function () {
            // Stop the wave animation.
            // this.isPlaying = false
          },
          onstop: function () {
            // Stop the wave animation.
            // this.isPlaying = false
            if (window.location.href.includes("discover")) {
              if (self.totalPlayTime >= 30 && self.isSubscribed) {
                let params = { track_id: self.track.id, duration: Math.floor(self.totalPlayTime) }

                TrackingService.createPlayRecord(params)
                .then((response) => {
                  console.log(response)
                })
                .catch((e) => {
                  console.log("error in updating record")
                })
              }
              self.totalPlayTime = 0
              self.endPlayTime = 0
              self.lastSeekTime = 0
            }
          },
        });
        this.playingSound = sound
        let api_call = this.currentUser ? TrackService.playTrack(this.track.id) : TrackService.playTrackPublicUser(this.track.id)
        api_call.then((response) =>
          console.log("playing - track", this.track.id)
        );
      };
      // Begin playing the sound.
      sound.play();

      // Show the pause button.
      if (sound.state() === "loaded") {
        this.isPlaying = true;
      } else {
        this.isLoaded = false;
        this.isPlaying = false;
      }
      // Keep track of the index we are currently playing.
      this.index = index;
      this.$store.dispatch("player/setTrackIndex", index);

      // / Show the reminder on the audio player
      // if (this.index > 0 && this.index % this.reminderTracksCount == 0) {
      //   PaymentService.hasTransactionInPeriod().then(res => {
      //     if (res.body != true) {
      //       this.showReminder = true
      //       setTimeout(() => { this.showReminder = false }, 5000)
      //     }
      //   })
      // }
    },

    clearStillListeningTimer(setTimer = false) {
      if (localStorage.getItem("remainingTime") == null || setTimer) {
        this.remainingStillListenerTimer = 0
        localStorage.setItem("remainingTime", 3600000)
      }
      if (typeof this.stillListeningTimer === 'number') {
        clearTimeout(this.stillListeningTimer);
        this.stillListeningTimer = null
      }
      this.stillListeningTimer = setTimeout(this.stillListening, localStorage.getItem("remainingTime"))
    },

    /**
     * Pause the currently playing track.
     */
    pause() {
      if (this.currentUser) {
        this.updateUserInfo();
      }
      // player is not initialized yet.
      if (!this.$store.state.player.isPlaying) return;

      // Get the Howl we want to manipulate.
      var sound = this.playlist[this.index].howl;

      if (this.totalPlayTime === 0) {
        this.totalPlayTime = Math.floor(sound.seek())
      } else {
        this.totalPlayTime = this.totalPlayTime + (Math.floor(sound.seek()) - this.endPlayTime)
      }
      this.endPlayTime = sound.seek()
      // Puase the sound.
      sound.pause();

      // Show the play button.
      this.isPlaying = false;
      this.setPauseStatus(true);
      // this.setPlaying(false)

      // update current track playing
      this.$store.dispatch("player/setCurrentPlayingTrack", this.track);
    },

    skip(direction) {
      // Get the next track based on the direction of the track.
      if (this.playlist.length === 1 || (this.playlist.length > 1 &&
       direction === 'next' && (this.index === this.playlist.length - 1))) {
        let sound = this.playlist[this.index].howl
        this.lastSeekTime = sound.seek() > 0 ? sound.seek() : sound.duration()
      }

      var index = 0;
      if (direction === "prev") {
        index = this.index - 1;
        if (index < 0) {
          this.$store.dispatch(
            "player/setListIndex",
            this.$store.state.player.listIndex - 1
          );
          this.setPlaylist("prev");
          index = this.playlist.length - 1;
          // this.$root.$emit('index_change')
        }
      } else {
        index = this.index + 1;
        if (index >= this.playlist.length) {
          index = 0;
          this.$store.dispatch(
            "player/setListIndex",
            this.$store.state.player.listIndex + 1
          );
          this.setPlaylist("next");
          // this.$root.$emit('index_change')
        }
      }
      this.$store.dispatch("player/setTrackIndex", index);
      this.skipTo(index);
    },

    /**
     * Skip to a specific track based on its playlist index.
     * @param  {Number} index Index in the playlist.
     */
    skipTo(index) {
      if (this.currentUser) {
        this.updateUserInfo();
      }
      // Stop the current track.
      var sound = null;
      if (
        this.playlist[this.index] !== null &&
        this.playlist[this.index] !== undefined
      ) {
        if (
          this.playlist[this.index].howl !== undefined &&
          this.playlist[this.index].howl !== null
        ) {
          sound = this.playlist[this.index].howl;
          this.lastSeekTime = sound.seek() > 0 ? sound.seek() : sound.duration()
          sound.stop();
        }
      }

      if (this.totalPlayTime === 0) {
        this.totalPlayTime = Math.floor(this.lastSeekTime)
      } else {
        this.totalPlayTime = this.totalPlayTime + Math.floor(this.lastSeekTime - this.endPlayTime)
      }
      console.log("total play time =========", this.totalPlayTime)
      if (this.totalPlayTime >= 30 && this.isSubscribed) {
        let params = { track_id: this.track.id, duration: Math.floor(this.totalPlayTime) }

        TrackingService.createPlayRecord(params)
        .then((response) => {
          console.log(response)
        })
        .catch((e) => {
          console.log("error in updating record")
        })
      }
      this.totalPlayTime = 0
      this.endPlayTime = 0
      this.lastSeekTime = 0
      // Reset progress.
      this.progress = 0;

      if (this.playlist.length > 0) {
        // Play the new track.
        this.play(index);
      }
    },

    /**
     * Seek to a new position in the currently playing track.
     * @param  {Number} per Percentage through the song to skip.
     */
    seek(per) {
      // Get the Howl we want to manipulate.
      var sound = this.playlist[this.index].howl;
      let seekTime1 = Math.floor(sound.seek())
      // Convert the percent into a seek position.
      if (sound.playing()) {
        sound.seek((sound.duration() * per) / 100);
      }
      let seekTime2 = Math.floor(sound.seek())

      if (this.totalPlayTime === 0) {
        this.totalPlayTime = this.totalPlayTime + seekTime1;
        this.endPlayTime = seekTime2
      } else {
        this.totalPlayTime = this.totalPlayTime + (seekTime1 - this.endPlayTime)
        this.endPlayTime = seekTime2
      }
      console.log("total play time", this.totalPlayTime)
    },

    /**
     * The step called within requestAnimationFrame to update the playback position.
     */
    step() {
      // Get the Howl we want to manipulate.
      var sound = null;
      // var sound = this.playlist[this.index].howl
      if (
        this.playlist[this.index] !== null &&
        this.playlist[this.index] !== undefined
      ) {
        if (
          this.playlist[this.index].howl !== undefined &&
          this.playlist[this.index].howl !== null
        ) {
          sound = this.playlist[this.index].howl;

          // Determine our current seek position.
          var seek = sound.seek() || 0;
          this.playedTime = this.formatTime(Math.round(seek));
          this.progress = (seek / sound.duration()) * 100 || 0;

          // If the sound is still playing, continue stepping.
          if (sound.playing()) {
            requestAnimationFrame(this.step.bind(this));
          }
        }
      }
    },

    setPlaylist(direction) {
      // Display the title of the first track.
      let object =
        this.$store.state.player.list[this.$store.state.player.listIndex];
      var tracks = [];
      if (direction === "next") {
        for (
          var i = this.$store.state.player.listIndex;
          i < this.$store.state.player.list.length;
          i++
        ) {
          object = this.$store.state.player.list[i];
          if (object.assoc_type) {
            if (object.assoc_type === "Album") {
              tracks = object.assoc.tracks;
              this.$store.dispatch("player/setListIndex", i);
              this.$root.$emit("index_change");
              break;
            }
          } else {
            tracks = object.tracks;
            this.$store.dispatch("player/setListIndex", i);
            this.$root.$emit("index_change");
            break;
          }
        }
      } else {
        for (i = this.$store.state.player.listIndex; i >= 0; i--) {
          object = this.$store.state.player.list[i];
          if (object.assoc_type) {
            if (object.assoc_type === "Album") {
              tracks = object.assoc.tracks;
              this.$store.dispatch("player/setListIndex", i);
              this.$root.$emit("index_change");
              break;
            }
          } else {
            tracks = object.tracks;
            this.$store.dispatch("player/setListIndex", i);
            this.$root.$emit("index_change");
            break;
          }
        }
      }
      for (let index in this.playlist) {
        let item = this.playlist[index];
        if (item) {
          if (item.howl) {
            item.howl.unload();
          }
        }
      }
      this.playlist = [];
      this.index = 0;
      if (tracks.length > 0) {
        if (this.currentUser) {
          const album = object.assoc || object;
          AlbumService.playAlbum(album.id).then((response) =>
            console.log("playing - album", album.id)
          );
        }

        for (let track in tracks) {
          this.playlist.push({
            track: tracks[track],
            played: false,
            howl: null,
          });
        }
        // if (this.$store.state.player.trackIndex > -1) {
        //   this.index = this.$store.state.player.trackIndex
        // }
        this.$store.dispatch("player/setTrackIndex", 0);
        this.trackIndex = this.index + 1 + " of " + this.playlist.length;
        // this.trackName = this.playlist[this.index].track.name
        this.track = this.playlist[this.index].track;
        // console.log('player setPlaylist track', this.track)
      } else {
        this.$store.dispatch("player/setListIndex", -1);
        this.$store.dispatch("player/setPlayingStatus", false);
      }
    },

    formatTime(secs) {
      var minutes = Math.floor(secs / 60) || 0;
      var seconds = secs - minutes * 60 || 0;

      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },

    stillListening() {
      this.pause();
      this.showListeningMessage = true
    },

    timeCounter() {
      if (this.previewTimeCompleted) {
        this.pause();
        this.fetchSpotlightVideo()
      } else {
        if (this.currentUser && this.currentUser.free_trial_time <= this.remainingTime && !this.isSubscribed && this.remainingTime >= 15) {
          this.previewTimeCompleted = true;
          this.pause();
          this.remainingTime = 0
          this.updateUserInfo();
          this.remainingTime = this.remainingTime + 1;
          this.fetchSpotlightVideo()
        }
        this.remainingTime = this.remainingTime + 1;
      }
      this.remainingStillListenerTimer = this.remainingStillListenerTimer + 1;
    },

    choosePage(path) {
      this.$router.push({ path: "/" + path });
    },

    dismissDownloadDialog() {
      this.showDownloadModal = false;
    },

    dismissShareDialog() {
      this.showShareModal = false;
    },

    setRepeated() {
      this.isRepeated = !this.isRepeated;
    },

    hideListeningMessage() {
      localStorage.setItem("remainingTime", 3600000)
      this.showListeningMessage = false;
    },

    fetchSubscriptionDetails() {
      if (this.currentUser) {
        UserService.getSubscriptionDetail(this.currentUser.id)
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
      }
    },

    updateUserInfo() {
      const params = {
        user: { free_trial_time: this.remainingTime },
      }
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
      clearInterval(this.remainingTimerCalculator);
      clearTimeout(this.stillListeningTimer);
      this.remainingTime = 0
    },

    repostItem() {
      AlbumService.repostAlbum(this.item.id)
        .then((response) => {
          this.$store.dispatch("error/showSuccessToast", [
            "You just reposted " + this.item.name,
          ]);
        })
        .catch((e) => {
          this.$store.dispatch(
            "error/showErrorToast",
            e.body.errors || [e.body]
          );
        });
    },

    setFollowingStatus(userId, isFollowing) {
      // console.log('player setFollowingStatus', status)
      // console.log(this.user)
      if (this.user && this.user.id === userId) {
        this.$store.dispatch("player/updateFollowingStatus", isFollowing);
      }
    },

    skipTrack(index) {
      this.skipTo(index);
    },

    // onVolumeChange (evt) {
    //   // console.log('onVolumeChange', evt, this.volume)
    //   this.updateVolume(this.volume)
    // },

    updateVolume() {
      // console.log('updateVolume', volume)
      Howler.volume(this.volume / 100);
    },

    randomPlay() {
      this.$store.dispatch(
        "player/setShuffleStatus",
        !this.$store.state.player.isShuffle
      );
    },
  },

  mounted() {
    this.$root.$on(MyEvents.AUDIO_PLAYER_PLAY, this.startPlaying);
    this.$root.$on(MyEvents.AUDIO_PLAYER_REPLAY, this.play);
    this.$root.$on(MyEvents.AUDIO_PLAYER_PAUSE, this.pause);
    this.$root.$on(MyEvents.AUDIO_PLAYER_SKIPTO, this.skipTrack);
    this.$root.$on(MyEvents.AUTH_SIGNOUT, this.resetPlayer);
    this.$root.$on(MyEvents.USER_FOLLOW, this.setFollowingStatus);
    this.$root.$on(MyEvents.STREM_PLAYER_FULLSCREEN_ENTER, this.pause);
    this.trigger()
  },
};
</script>

<style src="../../static/styles/spotlight.scss" lang="scss">
  .dialog.plans-dialog {
    width: auto;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 1);
    .payment-modal {
      width: 755px;
      &.paymentSuccessful,
      &.paymentFailed {
        width: 398px;
      }
    }
  }
  .overlay.overlay--active {
    width: auto;
    background-color: rgba(0, 0, 0, 0.9);
  }

</style>
