<template>
  <v-flex class="activity-album-card">
    <v-flex xs12 class="track-info" pa-0>
      <v-flex xs12 class="track-cover">
        <div class="track-image" :style="{'background-image': 'url(' + item.cover.url + ')'}"></div>
        <v-flex xs12 class="track-actions" :class="{'playing': isPlaying}">
          <v-flex xs12 class="touch-flex" @click="goToAlbum()"></v-flex>
          <v-btn dark class="play-button" @click.native="playSong()" v-if="!isPlaying || $store.state.player.isPaused">
            <v-icon >play_arrow</v-icon>
          </v-btn>
          <v-btn dark class="play-button" @click.native="pauseSong()" v-if="isPlaying && !$store.state.player.isPaused">
            <v-icon>pause</v-icon>
          </v-btn>
          <!-- <router-link :to="'/album/' + item.slug "><p class="track-count">{{ item.tracks.length }} tracks</p></router-link> -->
        </v-flex>
      </v-flex>
    </v-flex>
    <download-modal :item="item" :dismiss="dismissDownloadModal" v-if="showDownloadModal"></download-modal>
  </v-flex>  
</template>

<script type="text/javascript">
  import { mapActions } from 'vuex'
  import AlbumService from '@/services/album'
  import downloadModal from '@/components/downloadmodal'
  import profileItem from '@/components/profileitem'

  export default {
    components: {
      downloadModal,
      profileItem
    },

    props: {
      object: {
        type: Object
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
        if (this.$store.state.auth.page === 'stream') {
          return true
        } else {
          return false
        }
      },

      publisher () {
        if (this.object.assoc_type) {
          return this.object.publisher
        } else {
          return this.object.user
        }
      },

      item () {
        if (this.object.assoc_type) {
          return this.object.assoc
        } else {
          return this.object
        }
      },

      owner () {
        if (this.object.assoc_type) {
          return this.object.assoc.user
        } else {
          return this.object.user
        }
      },

      isPlaying () {
        var playingItem = this.$store.state.player.list[this.$store.state.player.listIndex]
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
      }
    },

    created () {
      // console.log(this.objects, this.objectIndex)
    },

    methods: {
      ...mapActions({
        setPlaylist: 'player/setPlaylist',
        setPlaylistIndex: 'player/setListIndex',
        setPlaying: 'player/setPlayingStatus',
        setPage: 'player/setPage',
        setTab: 'player/setTab'
      }),

      dismissDownloadModal () {
        this.showDownloadModal = false
      },

      repostItem () {
        AlbumService.repostAlbum(this.item.id).then(response => {
          console.log(response)
        })
        .catch(e => {
          console.log(e)
        })
      },

      playSong () {
        if (this.$store.state.player.isPaused) {
          this.$root.$emit('replay')
        } else {
          this.setPlaylist([this.object])
          this.setPlaylistIndex(0)
          this.setPlaying(true)
          this.setPage(this.$store.state.auth.page)
          this.setTab(this.$store.state.auth.tab)
          this.$root.$emit('play')
        }
      },

      pauseSong () {
        this.$root.$emit('pause')
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
      },

      goToAlbum () {
        this.choosePage('album/' + this.item.slug)
      }
    }
  }
</script>
