<template>
  <div class="mobile-player" :class="{'no-album': !item}">
    <canvas id="canvas" class="player-background"></canvas>
    <div class="_top dflex align-center justify-space-between">
      <div class="logo-wrapper">
        <img
          class="_logo"
          src="../../static/images/nav_logo_primary.png"
          width="130"
        />
      </div>

      <v-icon class="min-player" @click="minModal()"> expand_more </v-icon>
    </div>

    <div v-if="item" class="album-track-details">
      <div
        class="album-cover"
        :style="{ 'background-image': 'url(' + albumCover + ')' }"
      ></div>

      <div class="track-info">
        <div class="track-name">{{ item.name }}</div>
        <div class="track-artist">{{ item.user.username }}</div>
      </div>

      <div class="loading flex-none" id="loading" v-if="isLoaded"></div>
      <div v-else class="controls-section">
        <div class="bar-section">
          <!-- <label class="duration-time played" id="playedTime">{{
            playedTime
          }}</label> -->
          <v-spacer>
            <v-slider
              class="player-bar pa-0"
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
            <div class="decoy" @click="optionModalActive = false"></div>

            <div class="option-modal">
              <div class="follow-user">
                <user-tag
                  :user="user"
                  showAvatar
                  showUserType
                  width="35"
                  height="35"
                />

                <user-follow-btn
                  v-if="currentUser && item.user.id != currentUser.id"
                  :user="item"
                  theme="dark"
                  type="player"
                />
              </div>

              <div class="action-wrapper">
                <div
                  class="_action _border_right _border_bottom"
                  @click="openShareModal()"
                >
                  <img
                    src="/static/images/ic_share_fill.svg"
                    width="20"
                    class="_action-icon mr-1"
                  />
                  <div class="_action-title">Share</div>
                </div>
                <div
                  class="_action _border_bottom"
                  @click="repostItem()"
                >
                  <img
                    src="/static/images/ic_repost.svg"
                    width="20"
                    class="_action-icon mr-1"
                    slot="activator"
                  />
                  <div class="_action-title">Repost</div>
                </div>
                <div
                  class="_action _border_right"
                  @click="showAlbumCredit()"
                >
                  <img
                    src="/static/images/ic_users_fill.svg"
                    width="20"
                    class="_action-icon mr-1"
                  />
                  <div class="_action-title">Credits</div>
                </div>
                <div
                  class="_action"
                  @click="showComments()"
                >
                  <img
                    src="/static/images/ic_comment.svg"
                    width="20"
                    class="_action-icon mr-1"
                  />
                  <div class="_action-title">Comment</div>
                </div>
              </div>
            </div>
          </div>
        </transition>
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
    </div>
    <div v-else class="no-album-info">
      No music to play
    </div>

    <!-- Show Comments Dialog -->
    <mobile-comments :item="item" :comments="comments" ref="mobileComments">
      <!-- <template slot="_assoc">
        <trackcardsimple
          :item="item"
          :cover="albumCover"
          :title="item.name"
          :subtitle="item.user.username"
        />
      </template> -->
    </mobile-comments>

    <div v-if="item" class="credits-dialog-wrapper">
      <v-dialog
        v-model="showCredit"
        class="album-credits-dialog"
        scrollable
        max-width="600px"
      >
        <v-card class="album-dialog-body">
          <v-card-title>Album Credits</v-card-title>
          <v-btn class="dialog-close-btn" @click="showCredit = false"
            ><v-icon>highlight_off</v-icon></v-btn
          >
          <v-card-text style="height: 300px">
            <v-flex xs12 sm12>
              <label class="album-info-label">Album Name: </label>
              <label class="album-info-text">{{ item.name }}</label>
            </v-flex>
            <v-flex xs12 sm12>
              <label class="album-info-label">Release Date: </label>
              <label class="album-info-text">{{
                item.released_at | formatDate
              }}</label>
            </v-flex>
            <v-flex xs12 sm12 v-if="item.location && item.location != ''">
              <label class="album-info-label">Location: </label>
              <label class="album-info-text">{{ item.location }}</label>
            </v-flex>
            <v-flex xs12 sm12>
              <label class="album-info-label">Genre: </label>
              <label class="album-info-text">{{ genres }}</label>
            </v-flex>
            <v-flex
              xs12
              sm12
              v-if="item.collaborators && item.collaborators.length > 0"
            >
              <label class="album-info-label">Collaborators: </label>
              <label class="album-info-text">
                <template v-for="c in item.collaborators">
                  <div
                    class="collaborator-info"
                    :key="`collaborator-${c.id}`"
                  >
                    <router-link class="user-name" :to="`/${c.user.slug}`">{{
                      c.user.username
                    }}</router-link>
                    <span> - {{ c.user_role }}</span>
                  </div>
                </template>
              </label>
            </v-flex>
            <v-flex xs12 sm12>
              <label class="album-info-label">Contributors: </label>
              <label class="album-info-text">
                <div class="contributor-info">
                  <router-link
                    class="user-name"
                    :to="`/${item.user.slug}`"
                    >{{ item.user.username }}</router-link
                  >
                  <span> - Uploader</span>
                </div>
              </label>
              <label
                class="album-info-text"
                v-if="item.contributors && item.contributors.length > 0"
              >
                <template v-for="c in item.contributors">
                  <div class="contributor-info" :key="`contributor-${c.id}`">
                    <router-link class="user-name" :to="`/${c.user.slug}`">{{
                      c.user.username
                    }}</router-link>
                    <span> - {{ c.user_role }}</span>
                  </div>
                </template>
              </label>
            </v-flex>
            <v-flex
              xs12
              sm12
              v-if="item.samplings && item.samplings.length > 0"
            >
              <label class="album-info-label">Samples: </label>
              <label
                class="album-info-text"
                v-if="item.samplings && item.samplings.length > 0"
              >
                <template v-for="s in item.samplings">
                  <div class="sampling-info" :key="`sampling-${s.id}`">
                    <label>{{ s.sampling_track.name }}</label
                    >:&nbsp;<router-link
                      class="user-name"
                      :to="`/${s.sample_user.slug}`"
                      >{{ s.sample_user.username }}</router-link
                    >
                    <span> - {{ s.sample_track.name }}</span>
                  </div>
                </template>
              </label>
            </v-flex>
            <v-flex xs12 sm12 v-if="item.labels && item.labels.length > 0">
              <label class="album-info-label">Label: </label>
              <label class="album-info-text">
                <router-link
                  class="user-name"
                  :to="`/${item.labels[0].user.slug}`"
                  >{{ item.labels[0].user.username }}</router-link
                >
              </label>
            </v-flex>
            <v-flex xs12 sm12>
              <div class="album-info-label">About the album:</div>
              <label class="album-info-text">{{ item.description }}</label>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import $ from 'jquery'
import { mapGetters, mapActions } from "vuex";
import { Howl, Howler } from "howler";
import AlbumService from "@/services/album";
import CommentService from "@/services/comment";
// import PaymentService from '@/services/payment'
import TrackService from "@/services/track";
import { MyEvents } from "@/helper";
import downloadModal from "@/components/downloadmodal";
import shareModal from "@/components/sharemodal";
import UserTag from "@/components/user_tag";
import mobileComments from "@/views/mobile/components/mobileComments";
import trackcardsimple from "@/components/trackcardsimple";
import UserFollowBtn from "@/components/userFollowBtn";

const ActionCable = require("actioncable");

export default {
  props: {
    isMini: Boolean,
    isPlayerOpened: Boolean,
  },

  components: {
    downloadModal,
    shareModal,
    UserTag,
    mobileComments,
    trackcardsimple,
    UserFollowBtn,
  },

  data() {
    return {
      optionModalActive: false,
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
      showCredit: false,
      comments: [],
      cable: null,
      comments_subscription: null,
      comment_pagination: {
        count: 0,
        current_page: 0,
        per_page: 5,
        total_count: 0,
        total_pages: 0,
      },
    };
  },

  computed: {
    ...mapGetters({
      reminderTracksCount: "app/reminderTracksCount",
    }),

    coverThumbImageURL() {
      if (this.item.cover) {
        return this.item.cover.thumb.url + "?" + new Date();
      } else {
        return "";
      }
    },

    currentUser() {
      return this.$store.state.auth.user;
    },

    MyEvents() {
      return MyEvents;
    },

    item: {
      cache: false,
      get: function () {
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
      return this.item.cover.thumb.url;
    },

    followButtonText() {
      if (this.user.is_following) {
        return this.buttonHover ? "Unfollow" : "Following";
      }
      return "Follow";
    },

    genres() {
      return _.map(this.item.genres, "name").join(", ");
    },
  },

  created() {
    Howler.volume(this.volume / 100);
  },

  watch: {
    isPlayerOpened(val) {
      if (val) {
        this.fetchComments()
      }
    },
    item(val) {
      this.changeBackground();
    },
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

    showAlbumCredit() {
      this.showCredit = true;
      this.closeOptions()
    },

    async showComments() {
      await this.fetchComments()
      this.$refs.mobileComments.showComments(true);

      this.closeOptions()
    },

    async fetchComments() {
      const vm = this;

      if (this.item && this.currentUser) {
        await this.loadMoreComments();
      }

      if (this.comments_subscription) {
        this.comments_subscription.unsubscribe();
      }
      this.cable = ActionCable.createConsumer(
        `${process.env.SOCKET_BASE_URL}?token=${this.$store.state.auth.token}`
      );
      this.comments_subscription = await this.cable.subscriptions.create(
        {
          channel: "CommentsChannel",
          album_id: vm.item.id,
        },
        {
          connected: () => {
            console.log("connected to CommentsChannel");
          },
          received: (data) => {
            console.log("comments_subscription");
            console.log(data);
            switch (data.action) {
              case "create":
              case "update":
                if (
                  data.comment.status === "published" ||
                  data.comment.readable_user_ids.indexOf(
                    vm.currentUser.id
                  ) > -1
                ) {
                  const commentIndex = _.findIndex(
                    vm.comments,
                    (comment) => comment.id === data.comment.id
                  );
                  if (commentIndex === -1) {
                    vm.comments.push(data.comment);
                  } else {
                    vm.comments[commentIndex] = data.comment;
                  }
                } else {
                  _.remove(vm.comments, (item) => {
                    return item.id === data.comment.id;
                  });
                }
                break;
              case "delete":
                _.remove(vm.comments, (item) => {
                  return item.id === data.comment_id;
                });
                break;
            }
            vm.comments = _.orderBy(vm.comments, ["created_at"], ["desc"]);
            // const arr = vm.comments.slice()
            // vm.comments = arr
          },
          disconnected: () => {
            console.log("disconnected to CommentsChannel :(");
          },
        }
      );
    },

    async loadMoreComments() {
      const params = {
        commentable_type: 'Album',
        commentable_id: this.item.id,
        page: this.comment_pagination.current_page + 1,
        per_page: this.comment_pagination.per_page,
      }
      CommentService.getComments(params)
        .then((response) => {
          this.comments = this.comments.concat(response.body.comments)
          this.comment_pagination = response.body.pagination
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    openShareModal() {
      this.showShareModal = true;
      this.modalMode = true;

      this.closeOptions()
    },

    changeBackground() {
      var canvas = document.getElementById("canvas");

      var cctx = canvas.getContext("2d");
      var buff = document.createElement("canvas");
      buff.width = canvas.width;
      buff.height = canvas.height;

      var imageObj = new Image();
      // this will make CORS happy because the server is well configured
      imageObj.crossOrigin = "anonymous";
      // Easiest is to always host your images on your own server
      // imageObj.src = 'https://dl.dropboxusercontent.com/s/8q8sjnqmmto13h5/lionCMYK.jpg'
      imageObj.src = this.coverThumbImageURL;

      imageObj.onload = function () {
        // canvas.width = imageObj.height
        // canvas.height = imageObj.height
        cctx.drawImage(imageObj, 0, 0);
        // eslint-disable-next-line no-undef
        StackBlur.image(imageObj, canvas, 100, false);

        var wrapper_height = $(".album-pages").height() + 130;
        const height = wrapper_height;

        if (canvas) {
          // $("#canvas").css("cssText", "height: " + height + "px !important;");
        }
        $("#back_image").css("cssText", "height: " + height + "px !important;");
      };
    },

    closeOptions() {
      this.optionModalActive = false;
    },

    minModal() {
      this.$store.dispatch("player/toggleMobilePlayer", false);
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
      console.log("player play track mobile_player", this.track);
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
      }

      TrackService.playTrack(this.track.id).then((response) =>
        console.log("playing - track", this.track.id)
      );
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

  canvas.player-background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    height: 100% !important;
  }

  .loading {
    margin: 0 auto;
    margin-top: 30px;
    width: 75px;
    height: 75px;
    background-color: #999;
    border-radius: 100%;
    -webkit-animation: sk-scaleout 1s infinite ease-in-out;
    animation: sk-scaleout 1s infinite ease-in-out;
  }

  ._top {
    position: relative;
    margin-bottom: 40px;

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
    position: relative;

    .album-cover {
      height: 300px;
      width: 100%;
      background-size: cover;
      margin: 0 auto;
      background-position: center;
      margin-bottom: 20px;
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
      position: fixed;
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
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
  }

  &.no-album {
    display: flex;
    flex-direction: column;

    .no-album-info {
      position: sticky;
      flex: 1;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
