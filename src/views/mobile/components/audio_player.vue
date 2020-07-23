<template>
  <div class="audio-player aplayer">
    <!-- <div v-if="!isLoaded" class="aplayer__loading">
      <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
    </div> -->
    <div class="aplayer__content">
      <div class="aplayer__seek">
        <v-slider v-model="progress" hide-details></v-slider>
        <div class="aplayer__meta">
          <label>{{ playedTime | timeInMinutes }}</label>
          <label>{{ totalTime | timeInMinutes }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <script src="@/components/player.ctrl.js"></script> -->

<script>
import { mapActions } from 'vuex'
import { Howl, Howler } from 'howler'
import { MyEvents } from '@/helper'

export default {
  data() {
    return {
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
    }
  },

  computed: {
    item() {
      const item = this.$store.state.player.list[
        this.$store.state.player.listIndex
      ]
      if (!item) {
        return null
      }

      if (item.assoc_type) {
        return item.assoc
      } else {
        return item
      }
    },

    user() {
      if (!this.item) {
        return null
      }

      if (this.item.album_type === 'album') {
        return this.item.user
      } else {
        return this.track.user
      }
    },
  },

  methods: {
    ...mapActions({
      setPlaying: 'player/setPlayingStatus',
      setPauseStatus: 'player/setPauseStatus',
    }),

    startPlaying(index) {
      console.log('startPlaying', index)
      this.setPlaylist('next')
      this.play(index)
      this.$forceUpdate()
    },

    resetPlayer() {
      console.log('resetPlayer')
      if (this.$store.state.player.isPlaying) {
        this.setPlaying(false)
        this.pause()
        this.setPauseStatus(false)
        this.$store.dispatch('player/setPlaylist', [])
        this.$store.dispatch('player/setListIndex', -1)
        this.$store.dispatch('player/setTrackIndex', -1)
        for (let index in this.playlist) {
          let item = this.playlist[index]
          if (item) {
            if (item.howl) {
              item.howl.unload()
            }
          }
        }
        this.playlist = []
        this.index = 0
        this.isLoaded = false
        this.isRepeated = false
        this.isPlaying = false
        this.trackIndex = null
        this.trackName = null
        this.track = {}
        this.playedTime = 0
        this.progress = 0
        this.showDownloadModal = false
        this.totalTime = null
        this.buttonHover = false
      }
    },

    play(index) {
      // console.log('player', index, this.index, this.playlist)
      var self = this
      var sound
      index = typeof index === 'number' ? index : this.index
      var data = this.playlist[index]

      this.trackIndex = index + 1 + ' of ' + this.playlist.length
      this.track = this.playlist[index].track
      console.log('player play track', this.track)

      // If we already loaded self track, use the current one.
      // Otherwise, setup and load a new Howl.
      if (data.howl) {
        sound = data.howl
      } else {
        sound = data.howl = new Howl({
          src: data.track.audio.url,
          html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
          onplay: function () {
            // Display the duration.
            self.totalTime = Math.round(sound.duration())

            // Start upating the progress of the track.
            requestAnimationFrame(self.step.bind(this))

            // Start the wave animation if we have already loaded
            self.isPlaying = true
            self.setPauseStatus(false)
          },
          onload: function () {
            // Start the wave animation.
            self.isLoaded = true
            console.log('onload', self.isLoaded)
          },
          onend: function () {
            // Stop the wave animation.
            // this.isLoaded = false
            // this.isPlaying = false
            if (self.isRepeated) {
              self.skipTo(self.index)
            } else {
              self.skip('right')
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
        })
      }

      // Begin playing the sound.
      sound.play()

      // Show the pause button.
      if (sound.state() === 'loaded') {
        this.isPlaying = true
      } else {
        this.isLoaded = false
        this.isPlaying = false
      }

      // Keep track of the index we are currently playing.
      this.index = index
      this.$store.dispatch('player/setTrackIndex', index)
    },

    /**
     * Pause the currently playing track.
     */
    pause() {
      // player is not initialized yet.
      if (!this.$store.state.player.isPlaying) return

      // Get the Howl we want to manipulate.
      var sound = this.playlist[this.index].howl

      // Puase the sound.
      sound.pause()

      // Show the play button.
      this.isPlaying = false
      this.setPauseStatus(true)
      // this.setPlaying(false)
    },

    skip(direction) {
      // Get the next track based on the direction of the track.
      var index = 0
      if (direction === 'prev') {
        index = this.index - 1
        if (index < 0) {
          this.$store.dispatch(
            'player/setListIndex',
            this.$store.state.player.listIndex - 1
          )
          this.setPlaylist('prev')
          index = this.playlist.length - 1
          // this.$root.$emit('index_change')
        }
      } else {
        index = this.index + 1
        if (index >= this.playlist.length) {
          index = 0
          this.$store.dispatch(
            'player/setListIndex',
            this.$store.state.player.listIndex + 1
          )
          this.setPlaylist('next')
          // this.$root.$emit('index_change')
        }
      }
      this.$store.dispatch('player/setTrackIndex', index)
      this.skipTo(index)
    },

    /**
     * Skip to a specific track based on its playlist index.
     * @param  {Number} index Index in the playlist.
     */
    skipTo(index) {
      // Stop the current track.
      var sound = null
      if (
        this.playlist[this.index] !== null &&
        this.playlist[this.index] !== undefined
      ) {
        if (
          this.playlist[this.index].howl !== undefined &&
          this.playlist[this.index].howl !== null
        ) {
          sound = this.playlist[this.index].howl
          sound.stop()
        }
      }

      // Reset progress.
      this.progress = 0

      if (this.playlist.length > 0) {
        // Play the new track.
        this.play(index)
      }
    },

    /**
     * Seek to a new position in the currently playing track.
     * @param  {Number} per Percentage through the song to skip.
     */
    seek(per) {
      // Get the Howl we want to manipulate.
      var sound = this.playlist[this.index].howl

      // Convert the percent into a seek position.
      if (sound.playing()) {
        sound.seek((sound.duration() * per) / 100)
      }
    },

    /**
     * The step called within requestAnimationFrame to update the playback position.
     */
    step() {
      // Get the Howl we want to manipulate.
      var sound = null
      // var sound = this.playlist[this.index].howl
      if (
        this.playlist[this.index] !== null &&
        this.playlist[this.index] !== undefined
      ) {
        if (
          this.playlist[this.index].howl !== undefined &&
          this.playlist[this.index].howl !== null
        ) {
          sound = this.playlist[this.index].howl

          // Determine our current seek position.
          var seek = sound.seek() || 0
          this.playedTime = Math.round(seek)
          this.progress = (seek / sound.duration()) * 100 || 0

          // If the sound is still playing, continue stepping.
          if (sound.playing()) {
            requestAnimationFrame(this.step.bind(this))
          }
        }
      }
    },

    setPlaylist(direction) {
      // Display the title of the first track.
      let object = this.$store.state.player.list[
        this.$store.state.player.listIndex
      ]
      var tracks = []
      console.log('setPlaylist', direction, this.$store.state.player)
      if (direction === 'next') {
        for (
          var i = this.$store.state.player.listIndex;
          i < this.$store.state.player.list.length;
          i++
        ) {
          object = this.$store.state.player.list[i]
          if (object.assoc_type) {
            if (object.assoc_type === 'Album') {
              tracks = object.assoc.tracks
              this.$store.dispatch('player/setListIndex', i)
              break
            }
          } else {
            tracks = object.tracks
            this.$store.dispatch('player/setListIndex', i)
            break
          }
        }
      } else {
        for (i = this.$store.state.player.listIndex; i >= 0; i--) {
          object = this.$store.state.player.list[i]
          if (object.assoc_type) {
            if (object.assoc_type === 'Album') {
              tracks = object.assoc.tracks
              this.$store.dispatch('player/setListIndex', i)
              this.$root.$emit('index_change')
              break
            }
          } else {
            tracks = object.tracks
            this.$store.dispatch('player/setListIndex', i)
            this.$root.$emit('index_change')
            break
          }
        }
      }
      for (let index in this.playlist) {
        let item = this.playlist[index]
        if (item) {
          if (item.howl) {
            item.howl.unload()
          }
        }
      }
      this.playlist = []
      this.index = 0
      if (tracks.length > 0) {
        for (let track in tracks) {
          this.playlist.push({
            track: tracks[track],
            played: false,
            howl: null,
          })
        }
        // if (this.$store.state.player.trackIndex > -1) {
        //   this.index = this.$store.state.player.trackIndex
        // }
        this.$store.dispatch('player/setTrackIndex', 0)
        this.trackIndex = this.index + 1 + ' of ' + this.playlist.length
        // this.trackName = this.playlist[this.index].track.name
        this.track = this.playlist[this.index].track
        console.log('player setPlaylist track', this.track)
      } else {
        this.$store.dispatch('player/setListIndex', -1)
        this.$store.dispatch('player/setPlayingStatus', false)
      }
    },

    setRepeated() {
      this.isRepeated = !this.isRepeated
    },

    skipTrack(index) {
      this.skipTo(index)
    },

    updateVolume() {
      Howler.volume(this.volume / 100)
    },
  },

  created() {
    Howler.volume(this.volume / 100)
  },

  beforeDestroy() {
    this.resetPlayer()
  },

  mounted() {
    this.$root.$on(MyEvents.AUDIO_PLAYER_PLAY, this.startPlaying)
    this.$root.$on(MyEvents.AUDIO_PLAYER_REPLAY, this.play)
    this.$root.$on(MyEvents.AUDIO_PLAYER_PAUSE, this.pause)
    this.$root.$on(MyEvents.AUDIO_PLAYER_SKIPTO, this.skipTrack)
  },
}
</script>

<style lang="scss" scoped>
.aplayer {
  &__content {
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    label {
      z-index: 1;
      font-size: 12px;
    }
  }

  .input-group.input-group--slider {
    padding: 0;
    /deep/ .slider__track {
      background: rgba(255, 255, 255, 0.5);
    }
    /deep/ .slider__thumb {
      background: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
