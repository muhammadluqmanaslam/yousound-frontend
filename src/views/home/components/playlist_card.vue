<template>
  <v-flex class="album-card my-card-wrapper">
    <v-flex xs12 class="my-card" pa-0>
      <v-flex xs12 class="my-card__media">
        <div
          class="my-card__media__body"
          :style="{ 'background-image': 'url(' + item.cover.url + ')' }"
        ></div>
        <v-flex xs12 class="my-card__actions" :class="{ playing: isPlaying }">
          <router-link :to="`/${item.album_type}/${item.slug}`">
            <v-flex xs12 class="touch-flex"></v-flex>
          </router-link>
          <v-btn
            v-if="!isPlaying || $store.state.player.isPaused"
            dark
            class="play-button"
            @click.native="playSong()"
          >
            <v-icon>play_arrow</v-icon>
          </v-btn>
          <v-btn
            v-if="isPlaying && !$store.state.player.isPaused"
            dark
            class="play-button"
            @click.native="pauseSong()"
          >
            <v-icon>pause</v-icon>
          </v-btn>
          <p class="action-left-tag">{{ item.tracks.length }} tracks</p>
        </v-flex>
      </v-flex>
      <v-flex xs12 class="my-card__body" pa-0>
        <p class="my-card__title">
          <router-link :to="`/${item.album_type}/${item.slug}`">{{
            item.name
          }}</router-link>
        </p>
        <p class="my-card__subtitle">
          <router-link :to="'/' + owner.slug">{{
            owner.display_name
          }}</router-link>
        </p>
      </v-flex>
    </v-flex>
  </v-flex>
</template>

<script type="text/javascript">
// import _ from 'lodash'
import { mapActions } from 'vuex'
import { MyEvents } from '@/helper'

export default {
  components: {},

  props: {
    item: {
      type: Object,
    },
  },

  data() {
    return {}
  },

  computed: {
    owner() {
      return this.item.user
    },

    isPlaying() {
      var playingItem = this.$store.getters['player/currentAlbum']
      if (!playingItem) {
        return false
      }

      var currentItem = this.item
      if (currentItem.assoc_type === 'Album') {
        currentItem = currentItem.assoc
      }
      return playingItem.id === currentItem.id
    },
  },

  created() {},

  methods: {
    ...mapActions({
      setPlaylist: 'player/setPlaylist',
      setPlaylistIndex: 'player/setListIndex',
      setTrackIndex: 'player/setTrackIndex',
      setPlaying: 'player/setPlayingStatus',
    }),

    playSong() {
      if (this.isPlaying && this.$store.state.player.isPaused) {
        this.$root.$emit(MyEvents.AUDIO_PLAYER_REPLAY)
      } else {
        this.setPlaylist([this.item])
        this.setPlaylistIndex(0)
        this.setPlaying(true)
        this.$root.$emit(MyEvents.AUDIO_PLAYER_PLAY, 0)
      }
    },

    pauseSong() {
      this.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
    },
  },
}
</script>
