<template>
  <v-flex class="slider-card">
    <v-flex xs12 class="track-info" pa-0>
      <v-flex xs12 class="track-cover">
        <div class="playlist-icon" v-if="item.album_type=='playlist'">
          <img src="/static/images/playlist.png" />
        </div>
        <div class="track-image" :style="{'background-image': 'url(' + item.cover.url + ')'}"></div>
        <v-flex xs12 class="track-actions" :class="{'playing': isPlaying}">
          <v-flex xs12 class="touch-flex" @click="playSong()"></v-flex>
          <v-btn dark class="play-button" @click.native="playSong()" v-if="!isPlaying || $store.state.player.isPaused">
            <v-icon >play_arrow</v-icon>
          </v-btn>
          <v-btn dark class="play-button" @click.native="pauseSong()" v-if="isPlaying && !$store.state.player.isPaused">
            <v-icon>pause</v-icon>
          </v-btn>
          <router-link :to="`/${item.album_type}/${item.slug}`"><p class="track-count">{{ item.tracks.length }} tracks</p></router-link>
        </v-flex>
      </v-flex>
    </v-flex>
    <download-modal :item="item" :dismiss="dismissDownloadModal" v-if="showDownloadModal"></download-modal>
  </v-flex>  
</template>

<script type="text/javascript">
  import { mapActions } from 'vuex'
  import { MyEvents } from '@/helper'
  import AlbumService from '@/services/album'
  import downloadModal from '@/components/downloadmodal'
  import profileItem from '@/components/profileitem'

  export default {
    components: {
      downloadModal,
      profileItem
    },

    props: {
      objects: {
        type: Array
      },

      objectIndex: {
        type: Number
      }
    },

    data () {
      return {
        showDownloadModal: false,
        page: ''
      }
    },

    computed: {
      isShowUserInfo () {
        if (this.$store.state.navigator.current.page === 'stream') {
          return true
        } else {
          return false
        }
      },

      publisher () {
        if (this.objects[this.objectIndex].assoc_type) {
          return this.objects[this.objectIndex].publisher
        } else {
          return this.objects[this.objectIndex].user
        }
      },

      item () {
        if (this.objects[this.objectIndex].assoc_type) {
          return this.objects[this.objectIndex].assoc
        } else {
          return this.objects[this.objectIndex]
        }
      },

      owner () {
        if (this.objects[this.objectIndex].assoc_type) {
          return this.objects[this.objectIndex].assoc.user
        } else {
          return this.objects[this.objectIndex].user
        }
      },

      isPlaying () {
        // if (this.$store.state.player.isPlaying) {
        //   const currentItem = this.$store.state.player.list[this.$store.state.player.listIndex]
        //   if (currentItem.assoc_type) {
        //     if (currentItem.assoc.id === this.item.id) {
        //       return true
        //     }
        //   } else {
        //     if (currentItem.id === this.item.id) {
        //       return true
        //     }
        //   }
        // }
        var playingItem = this.$store.state.player.list[this.$store.state.player.listIndex]
        if (playingItem !== undefined) {
          if (playingItem.assoc_type === 'Album') {
            playingItem = playingItem.assoc
          }
          var currentItem = this.objects[this.objectIndex]
          if (currentItem.assoc_type === 'Album') {
            currentItem = currentItem.assoc
          }
          if (playingItem.id === currentItem.id) {
            return true
          }
        }
        return false
      }
    },

    created () {
      // console.log(this.objects, this.objectIndex)
    },

    methods: {
      ...mapActions({
        setPlaylist: 'player/setPlaylist',
        setPlaylistIndex: 'player/setListIndex',
        setPlaying: 'player/setPlayingStatus'
      }),

      dismissDownloadModal () {
        this.showDownloadModal = false
      },

      repostItem () {
        AlbumService.repostAlbum(this.item.id).then(response => {
          console.log(response)
        }).catch(e => {
          console.log(e)
        })
      },

      playSong () {
        if (this.$store.state.player.isPaused) {
          this.$root.$emit(MyEvents.AUDIO_PLAYER_REPLAY)
        } else {
          this.setPlaylist(this.objects)
          this.setPlaylistIndex(this.objectIndex)
          this.setPlaying(true)
          this.$root.$emit(MyEvents.AUDIO_PLAYER_PLAY)
        }
      },

      pauseSong () {
        this.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
      },

      shareItem () {
      },

      flagItem () {
      },

      addComment () {
      },

      addToPlaylist () {
      },

      choosePage (path) {
        console.log(path)
        this.$router.push({ path: '/' + path })
      }
    }
  }
</script>
