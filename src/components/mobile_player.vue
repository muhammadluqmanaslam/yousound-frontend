<template>
    <div class="mobile-player">
        <div class="_top dflex align-center justify-space-between">
            <div class="logo-wrapper">
                <img class="_logo" src="../../static/images/nav_logo_primary.png" width="130" />
            </div>

            <v-icon
                class="min-player"
                @click="minModal()"
            >
                expand_more
            </v-icon>
        </div>

        <div class="album-track-details">
            <div
                class="album-cover"
                :style="{ 'background-image': 'url(' + albumCover + ')' }"
            ></div>

            <div class="track-info">
                <div class="track-name">{{ item.name }}</div>
                <div class="track-artist">{{ item.user.username }}</div>
            </div>

            <div class="controls-section">
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

                <div class="action-btns">
                    <!-- Previous Button -->
                    <v-btn
                        :ripple="false"
                        flat
                        class="player-control-btn no-Btn-bg"
                        @click.native="skip('prev')"
                    >
                        <img src="/static/images/ic_rewind.svg" width="20" />
                    </v-btn>

                    <!-- Play Button -->
                    <v-btn
                        :ripple="false"
                        flat
                        class="player-control-btn play no-Btn-bg"
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
                        class="player-control-btn pause no-Btn-bg"
                        id="pause"
                        v-if="isPlaying"
                        @click.native="pause()"
                    >
                        <img src="/static/images/ic_pause.svg" height="26" />
                    </v-btn>

                    <v-btn
                        :ripple="false"
                        flat
                        class="player-control-btn no-Btn-bg"
                        @click.native="skip('next')"
                    >
                        <img src="/static/images/ic_skip.svg" width="20" />
                    </v-btn>
                </div>
            </div>

            <div class="player-options text-center">
                <v-icon @click="optionModalActive = true">more_horiz</v-icon>

                <transition
                    v-if="optionModalActive"
                    name="slide-up"
                    leave-active-class="slide-fade"
                >
                    <div>
                        <div
                            class="decoy"
                            @click="optionModalActive = false"
                        ></div>

                        <div class="option-modal">
                            <div class="follow-user">
                                <user-tag :user="user" showAvatar showUserType width="35" height="35" />

                                <v-btn
                                    v-if="currentUser && item.user.id != currentUser.id"
                                    dark
                                    round
                                    :class="{
                                        'follow-btn': true,
                                        follow: !item.user.is_following,
                                        following: item.user.is_following,
                                    }"
                                    @mouseenter="buttonHover = true"
                                    @mouseleave="buttonHover = false"
                                    @click.native="followUser()"
                                >
                                    {{ followButtonText }}
                                </v-btn>
                            </div>

                            <div class="action-wrapper">
                                <div class="_action _border_right _border_bottom">
                                    <!-- <v-btn
                                        depressed
                                        color="transparent ma-0"
                                        slot="activator"
                                        @click.native="
                                            showShareModal = true;
                                            modalMode = true;
                                        "
                                        >
                                        <img src="/static/images/re_share.svg" width="20" />
                                        <img src="/static/images/re_sharebg.svg" width="20" />
                                    </v-btn> -->

                                    <img
                                        src="/static/images/ic_share_fill.svg" width="20"
                                        class="_action-icon mr-1"
                                        @click.native="
                                            showShareModal = true;
                                            modalMode = true;
                                        "
                                    />
                                    <div class="_action-title">Share</div>
                                </div>
                                <div class="_action _border_bottom">
                                    <img
                                        src="/static/images/ic_repost.svg" width="20"
                                        class="_action-icon mr-1"
                                        @click.native="
                                            showShareModal = true;
                                            modalMode = true;
                                        "
                                    />
                                    <div class="_action-title">Repost</div>
                                </div>
                                <div class="_action _border_right">
                                    <img
                                        src="/static/images/ic_users_fill.svg" width="20"
                                        class="_action-icon mr-1"
                                        @click.native="
                                            showShareModal = true;
                                            modalMode = true;
                                        "
                                    />
                                    <div class="_action-title">Share</div>
                                </div>
                                <div class="_action">
                                    <img
                                        src="/static/images/ic_comment.svg" width="20"
                                        class="_action-icon mr-1"
                                        @click.native="
                                            showShareModal = true;
                                            modalMode = true;
                                        "
                                    />
                                    <div class="_action-title">Comment</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- <div class="side-playerr" v-if="$store.getters['player/isPlaying']">
            </div>

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
                            <div class="d-flex justify-space-between align-center">
                            <div v-if="!isMini" class="track-index" id="trackIndex">{{ trackIndex }}</div>
                            </div>
                            <div v-if="!isMini">
                            <label class="track-name" id="trackName">{{ track.name }}</label>
                            </div>
                        </div>
                        <div v-if="!isMini" class="user-info">
                            <template v-if="item.collaborators_count > 0">
                            <router-link class="user-name" :to="'/' + item.user.slug">{{
                                item.user.username
                            }}</router-link>
                            <template v-for="c in item.collaborators">
                                <span :key="`span-${c.user.id}`">,&nbsp;</span>
                            </template>
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
                    </div>

                    <div v-if="!isMini" class="follow-meta">
                        <div class="dflex align-center justify-space-between width100">
                        <template v-if="item.collaborators_count > 0">
                            <template v-for="c in item.collaborators">
                            <span :key="`span-${c.user.id}`">,&nbsp;</span>
                            </template>
                        </template>

                        <template v-else-if="item.album_type == 'album'">
                            <v-btn
                            v-if="currentUser && item.user.id != currentUser.id"
                            :class="{
                                'follow-btn': true,
                                follow: !item.user.is_following,
                                following: item.user.is_following,
                            }"
                            @mouseenter="buttonHover = true"
                            @mouseleave="buttonHover = false"
                            @click.native="followUser()"
                            >{{ followButtonText }}</v-btn
                            >
                        </template>

                        <template v-else>
                            <v-btn
                            v-if="currentUser && track.user.id != currentUser.id"
                            :class="{
                                'follow-btn': true,
                                follow: !track.user.is_following,
                                following: track.user.is_following,
                            }"
                            @mouseenter="buttonHover = true"
                            @mouseleave="buttonHover = false"
                            @click.native="followUser()"
                            >{{ followButtonText }}</v-btn
                            >
                        </template>

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

                    <div class="hr-container bottom">
                        <v-divider></v-divider>
                    </div>
                </div>

                <div
                v-if="!isMini"
                class="player-section-container"
                :class="{ 'd-block': isLoaded, 'd-flex': !isLoaded }"
                >
                <div class="loading flex-none" id="loading" v-if="!isLoaded"></div>
                <div class="player-section" v-if="isLoaded">
                    <div class="controls-section">
                    <v-btn
                        :ripple="false"
                        flat
                        class="player-control-btn no-Btn-bg"
                        @click.native="skip('prev')"
                    >
                        <img src="/static/images/ic_rewind.svg" width="20" />
                    </v-btn>

                    <v-btn
                        :ripple="false"
                        flat
                        class="player-control-btn play no-Btn-bg"
                        @click.native="$root.$emit(MyEvents.AUDIO_PLAYER_REPLAY)"
                        id="play"
                        v-if="!isPlaying"
                    >
                        <img src="/static/images/ic_play.svg" height="26" />
                    </v-btn>

                    <v-btn
                        :ripple="false"
                        flat
                        class="player-control-btn pause no-Btn-bg"
                        id="pause"
                        v-if="isPlaying"
                        @click.native="pause()"
                    >
                        <img src="/static/images/ic_pause.svg" height="26" />
                    </v-btn>
                    <v-btn
                        :ripple="false"
                        flat
                        class="player-control-btn no-Btn-bg"
                        @click.native="skip('next')"
                    >
                        <img src="/static/images/ic_skip.svg" width="20" />
                    </v-btn>

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
            </div> -->
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Howl, Howler } from "howler";
import AlbumService from "@/services/album";
// import PaymentService from '@/services/payment'
import TrackService from "@/services/track";
import UserService from "@/services/user";
import { MyEvents } from "@/helper";
import downloadModal from "@/components/downloadmodal";
import shareModal from "@/components/sharemodal";
import UserTag from "@/components/user_tag";

export default {
  props: {
    isMini: Boolean,
  },

  components: {
    downloadModal,
    shareModal,
    UserTag,
  },

  data() {
    return {
      optionModalActive: !false,
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
      showReminder: false,
      totalTime: null,
      buttonHover: false,
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
      const item = this.$store.state.player.list[this.$store.state.player.listIndex];

      console.log(item);

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

    albumCover() {
      return this.item.cover.thumb.url
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

    followButtonText() {
      if (this.user.is_following) {
        return this.buttonHover ? "Unfollow" : "Following";
      }
      return "Follow";
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
          var pp = videojs("my_video_player");
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

    closeOptions() {
      this.optionModalActive = false
    },

    minModal() {
      console.log("toggle");
      this.$store.dispatch("player/toggleMusicModal", false)
    },

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

    play(index) {
      // console.log('player', index, this.index, this.playlist)
      var self = this;
      var sound;
      index = typeof index === "number" ? index : this.index;
      var data = this.playlist[index];

      // Update the track display.
      // track.innerHTML = (index + 1) + '. ' + data.title
      // this.trackName = this.playlist[index].track.name
      this.trackIndex = index + 1 + " of " + this.playlist.length;
      this.track = this.playlist[index].track;
      console.log("player play trackB", this.track);
      this.$store.dispatch("player/setCurrentPlayingTrack", this.track);

      // If we already loaded self track, use the current one.
      // Otherwise, setup and load a new Howl.
      if (data.howl) {
        sound = data.howl;
      } else {
        sound = data.howl = new Howl({
          src: data.track.audio.url,
          html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
          onplay: function () {
            // Display the duration.
            self.totalTime = self.formatTime(Math.round(sound.duration()));

            // Start upating the progress of the track.
            requestAnimationFrame(self.step.bind(this));

            // Start the wave animation if we have already loaded
            self.isPlaying = true;
            self.setPauseStatus(false);
          },
          onload: function () {
            // Start the wave animation.
            self.isLoaded = true;
          },
          onend: function () {
            // Stop the wave animation.
            // this.isLoaded = false
            // this.isPlaying = false
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
          },
        });

        TrackService.playTrack(this.track.id).then((response) =>
          console.log("playing - track", this.track.id)
        );
      }

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

    /**
     * Pause the currently playing track.
     */
    pause() {
      // player is not initialized yet.
      if (!this.$store.state.player.isPlaying) return;

      // Get the Howl we want to manipulate.
      var sound = this.playlist[this.index].howl;

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
          sound.stop();
        }
      }

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

      // Convert the percent into a seek position.
      if (sound.playing()) {
        sound.seek((sound.duration() * per) / 100);
      }
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

    followUser() {
      if (this.user.is_following) {
        UserService.unfollowUser(this.user.id)
          .then((response) => {
            this.$store.dispatch("player/updateFollowingStatus", false);
            this.$store.dispatch("error/showSuccessToast", [
              "You just unfollowed " + this.user.username,
            ]);
          })
          .catch((e) => {
            this.$store.dispatch(
              "error/showErrorToast",
              e.body.errors || [e.body]
            );
          });
      } else {
        UserService.followUser(this.user.id)
          .then((response) => {
            this.$store.dispatch("player/updateFollowingStatus", true);
            this.$store.dispatch("error/showSuccessToast", [
              "You just followed " + this.user.username,
            ]);
          })
          .catch((e) => {
            this.$store.dispatch(
              "error/showErrorToast",
              e.body.errors || [e.body]
            );
          });
      }
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
  },
};
</script>

<style lang="scss" scoped>
    .mobile-player {
        background-color: #ffffff;
        height: 100vh;
        padding: 30px;

        ._top {
            .logo-wrapper {
                flex-grow: 1;
                text-align: center;
            }

            .icon.min-player {
                color: #000;
                font-size: 40px;
            }
        }

        .album-track-details {
            .album-cover {
                height: 350px;
                width: 300px;
                background-size: cover;
                margin: 0 auto;
                background-position: center;
            }

            .track-info {
                margin: 10px 0;
                text-transform: capitalize;

                .track-name {
                    font-size: 18px;
                    font-weight: 700;
                }
            }

            .contols-section {
                // /deep/ .slider__track__container {
                //     background: rgba(255, 255, 255, 0.23);
                // }
            }

            .player-options {
                position: absolute;
                left: 0;
                bottom: 0;
                padding-bottom: 40px;
                width: 100%;

                .option-modal {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 200px;
                    background-color: #ffffff;
                    border-radius: 10px 10px 0 0;
                    display: flex;
                    flex-direction: column;

                    .follow-user {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 20px;

                        .follow-btn {
                            height: 30px;
                        }
                    }

                    .action-wrapper {
                        display: grid;
                        grid-template-columns: 50% 50%;
                        grid-template-rows: 50% 50%;
                        border-top: 1px solid #e1dbdb;
                        flex-grow: 1;

                        ._action {
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            &._border_right {
                                border-right: 1px solid #e1dbdb;
                            }
                            &._border_bottom {
                                border-bottom: 1px solid #e1dbdb;
                            }
                        }
                    }
                }
                .decoy {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background-color: rgba(0,0,0,0.5);
                }
            }
        }
    }
</style>
