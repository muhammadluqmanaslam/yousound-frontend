<template>
  <v-flex class="activity-album-card">
    <v-flex xs12 class="track-info" pa-0>
      <v-flex xs12 class="track-cover">
        <div
          v-if="item.album_type == 'playlist'"
          class="track-image"
          :class="item.album_type"
          :style="{
            'background-image': `url(${album1Cover}), url(${album2Cover}), url(${album3Cover}), url(${album4Cover})`,
          }"
        ></div>
        <div
          v-else
          class="track-image"
          :style="{ 'background-image': 'url(' + item.cover.url + ')' }"
        ></div>
        <v-flex xs12 class="track-actions" :class="{ playing: isPlaying }">
          <v-flex xs12 class="touch-flex" @click="goToAlbum()"></v-flex>
          <!-- <router-link :to="'/album/' + item.slug ">
            <p class="track-count">{{ item.tracks.length }} tracks</p>
          </router-link> -->
        </v-flex>
      </v-flex>
    </v-flex>

    <!-- <v-btn
      v-if="!isPlaying || $store.state.player.isPaused"
      @click.native="playSong()"
      dark
    >
      <v-icon>play_arrow</v-icon>
    </v-btn>
    <v-btn v-else @click.native="pauseSong()" dark>
      <v-icon>pause</v-icon>
    </v-btn> -->

    <!-- <download-modal
      v-if="showDownloadModal"
      :item="item"
      :dismiss="dismissDownloadModal"
    /> -->
  </v-flex>
</template>

<script type="text/javascript">
import _ from 'lodash'
import { mapActions } from 'vuex'
import { MyEvents } from '@/helper'
import AlbumService from '@/services/album'
import downloadModal from '@/components/downloadmodal'

export default {
  components: {
    downloadModal,
  },

  props: {
    object: {
      type: Object,
    },
  },

  data() {
    return {
      showDownloadModal: false,
      page: '',
    }
  },

  computed: {
    item() {
      if (this.object.assoc_type) {
        return this.object.assoc
      } else {
        return this.object
      }
    },

    album1Cover() {
      return _.get(this.item.tracks, '[0].album.cover.url')
    },

    album2Cover() {
      return _.get(this.item.tracks, '[1].album.cover.url')
    },

    album3Cover() {
      return _.get(this.item.tracks, '[2].album.cover.url')
    },

    album4Cover() {
      return _.get(this.item.tracks, '[3].album.cover.url')
    },

    isPlaying() {
      var playingItem = this.$store.state.player.list[
        this.$store.state.player.listIndex
      ]
      if (playingItem !== undefined) {
        if (playingItem.assoc_type === 'Album') {
          playingItem = playingItem.assoc
        }
        var currentItem = this.object
        if (currentItem.assoc_type === 'Album') {
          currentItem = currentItem.assoc
        }
        if (playingItem.id === currentItem.id) {
          return true
        }
      }
      return false
    },
  },

  created() {
    // console.log(this.objects, this.objectIndex)
  },

  methods: {
    ...mapActions({
      setPlaylist: 'player/setPlaylist',
      setPlaylistIndex: 'player/setListIndex',
      setPlaying: 'player/setPlayingStatus',
    }),

    dismissDownloadModal() {
      this.showDownloadModal = false
    },

    repostItem() {
      AlbumService.repostAlbum(this.item.id)
        .then((response) => {
          console.log(response)
        })
        .catch((e) => {
          console.log(e)
        })
    },

    playSong() {
      if (
        this.$store.state.player.isPaused &&
        this.$store.getters['player/currentAlbum'].id === this.item.id
      ) {
        this.$root.$emit(MyEvents.AUDIO_PLAYER_REPLAY)
      } else {
        this.setPlaylist([this.object])
        this.setPlaylistIndex(0)
        this.setPlaying(true)
        this.$root.$emit(MyEvents.AUDIO_PLAYER_PLAY)
      }
    },

    pauseSong() {
      this.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
    },

    shareItem() {},

    flagItem() {},

    addComment() {},

    addToPlaylist() {},

    choosePage(path) {
      // console.log(path)
      this.$router.push({ path: '/' + path })
    },

    goToAlbum() {
      this.choosePage(`${this.item.album_type}/${this.item.slug}`)
    },
  },
}
</script>
