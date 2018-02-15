<template>
  <div class="album-track-item relative"
    @click.self="selectTrack()"
    :class="{'selected': buttonHover || (isPlaying && trackIndex==$store.state.player.trackIndex) || (!isPlaying && trackIndex==0)}"
    @mouseenter="buttonHover=true"
    @mouseleave="buttonHover=false">
    <v-btn class="action-btn" v-if="false && (!$store.state.auth.user || ($store.state.auth.user && album.user.id!=$store.state.auth.user.id))">
      <!-- <v-icon v-if="(trackIndex==$store.state.player.trackIndex && !isPlaying) || (buttonHover && trackIndex!=$store.state.player.trackIndex)">play_arrow</v-icon> -->
      <v-icon v-if="trackIndex==$store.state.player.trackIndex && isPlaying">pause</v-icon>
      <v-icon v-else-if="buttonHover || (trackIndex==0 && !isPlaying)">play_arrow</v-icon>
    </v-btn>
    <label class="track-name" @click.self="selectTrack()">
      <label class="track-index">{{ trackIndex + 1 }}. </label>{{ track.name }}</label>
    <!-- <div class="track-actions" v-if="showStats">
      <v-btn class="action-btn" @click.native="goToAlbumStats('playedby')">
        <v-icon>play_arrow</v-icon>3k</v-btn>
      <v-btn class="action-btn" @click.native="goToAlbumStats('downloadedby')">
        <img src="/static/images/ic_repost_trans.png" />1.3k</v-btn>
      <v-btn class="action-btn" @click.native="goToAlbumStats('repostedby')">
        <img src="/static/images/ic_repeat_trans.png" />975</v-btn>
    </div> -->
    <div class="right-section">
      <v-menu v-model="menu"
        offset-y
        class="track-more-action"
        :close-on-content-click="false">
        <v-btn dark class="more-btn" slot="activator">
          <v-icon right>more_horiz</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile key="remove_track" @click.native="removeItem()" v-if="album.album_type == 'playlist'">
            <v-list-tile-title class="default-menu-item">
              <img class="track-status-icon" src="/static/images/ic_comment_delete.png" />
              <label>Remove Track</label>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile key="repost" @click.native="repostItem()">
            <v-list-tile-title class="default-menu-item">
              <img class="track-status-icon" src="/static/images/ic_repeat.png" />
              <label>Repost Album</label>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile key="download" class="default-menu-item track-menu-item" v-if="album.album_type!='playlist'" @click.native="showDownloadDialog()">
            <v-list-tile-title>
              <img class="track-status-icon" src="/static/images/ic_download.png" />
              <label>Download</label>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile key="share" class="default-menu-item track-menu-item" @click.native="showShareDialog()">
            <v-list-tile-title>
              <img class="track-status-icon" src="/static/images/ic_share.png" />
              <label>Share</label>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile key="flag" class="default-menu-item" @click.native="flagItem()">
            <v-list-tile-title>
              <img class="track-status-icon" src="/static/images/ic_flag.png" />
              <label>Flag</label>
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile key="add_to_playlist" class="default-menu-item track-menu-item has-sub-menu" v-if="album.album_type!='playlist'">
            <v-menu offset-x class="track-menu" v-model="submenu">
              <v-list-tile-title slot="activator" class="has-sub-menu">
                <img class="track-status-icon" src="/static/images/ic_add_to.png" />
                <label>Add to Playlist</label>
              </v-list-tile-title>
              <v-list>
                <v-list-tile key="add_to_playlist" class="default-menu-item track-menu-item" @click.native="addToNewPlaylist()">
                  <v-dialog v-model="playlist_dialog" class="playlist-dialog" max-width="500px">
                    <v-list-tile-title slot="activator">
                      <img class="track-status-icon" src="/static/images/ic_add_to.png" />
                      <label>New Playlist</label>
                    </v-list-tile-title>
                    <v-card class="playlist-dialog-body">
                      <v-card-title>
                        <v-flex xs12 text-xs-center>
                          <h5 class="ma-0">New Playlist</h5>
                        </v-flex>
                        <v-btn class="dialog-close-btn" @click.native="playlist_dialog=false"><v-icon>highlight_off</v-icon></v-btn>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text class="create-playlist-section">
                        <div class="playlist-image-section"> 
                          <div class="image-section">
                            <div class="playlist-image" id="playlist_image" v-if="playlist.image" :style="`background-image: url(${selectedImage})`"></div>
                            <div class="playlist-image-upload-section" v-if="!playlist.image">
                              <input type="file" name="playlist_image_file" :id="input_id" class="add-playlist-image-file" accept="image/*" @change="imageChanged($event)">
                              <label :for="input_id">
                                <v-icon class="camera">photo_camera</v-icon>Add Image
                              </label>
                            </div>
                          </div>
                          <div class="image-change-section">
                            <input type="file" name="playlist_image_file" :id="input_id" class="change-playlist-image-file" accept="image/*" @change="imageChanged($event)">
                            <label :for="input_id" v-if="playlist.image">Change</label>
                          </div>
                        </div>
                        <div class="playlist-content-section">
                          <v-flex xs12 form-group>
                            <label class="control-label">Name<label class="required">*</label></label>
                            <input type="text" class="form-control" v-model="playlist.name">
                          </v-flex>
                          <v-flex xs12 sm12 form-group>
                            <v-btn class="create-playlist-btn" flat @click.native="createPlaylist()">Create Playlist</v-btn>
                          </v-flex>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </v-list-tile>
                <v-list-tile v-for="(list, list_index) in playlists"
                  :key="`playlist_1_${list_index}`"
                  class="default-menu-item track-menu-item"
                  @click.native="addToPlaylist(list)">
                  <v-list-tile-title>
                    <img class="track-status-icon" src="/static/images/ic_download.png"/>
                    <label>{{ list.name }}</label>
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-list-tile>
        </v-list>
      </v-menu>
      <!-- <label class="track-length" @click.self="selectTrack()">6:13</label> -->
    </div>
    <download-modal :item="album" :track="track" :dismiss="dismissDownloadDialog" v-if="download_dialog"></download-modal>
    <share-modal :item="album" :dismiss="dismissShareDialog" v-if="share_dialog"></share-modal>
  </div>
</template>

<script type="text/javascript">
import _ from 'lodash'
import { mapActions } from 'vuex'
import AlbumService from '@/services/album'
import PlaylistService from '@/services/playlist'
import downloadModal from '@/components/downloadmodal'
import shareModal from '@/components/sharemodal'
import profileItem from '@/components/profileitem'

export default {
  components: {
    downloadModal,
    shareModal,
    profileItem
  },

  props: {
    album: {
      type: Object
    },

    trackIndex: {
      type: Number
    },

    removeTrack: {
      type: Function
    },

    showStats: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      buttonHover: false,
      download_dialog: false,
      share_dialog: false,
      playlist_dialog: false,
      menu: false,
      submenu: false,
      playlist: {
        name: '',
        image: null
      },
      selectedImage: null
    }
  },

  computed: {
    _ () {
      return _
    },

    track () {
      return this.album.tracks[this.trackIndex]
    },

    isPlaying () {
      if (this.$store.state.player.isPlaying) {
        var playingItem = this.$store.state.player.list[this.$store.state.player.listIndex]
        if (playingItem.id === this.album.id) {
          return true
        }
      }
      return false
    },

    input_id () {
      return 'playlist_image_file_' + this.track.id
    },

    playlists () {
      return this.$store.state.playlist.playlists
    }
  },

  created () {
  },

  methods: {
    ...mapActions({
      setPlaylist: 'player/setPlaylist',
      setPlaylistIndex: 'player/setListIndex',
      setTrackIndex: 'player/setTrackIndex',
      setPlaying: 'player/setPlayingStatus',
      setPage: 'player/setPage',
      setTab: 'player/setTab'
    }),

    removeItem () {
      this.menu = false
      this.submenu = false
      this.removeTrack(this.track)
    },

    repostItem () {
      this.menu = false
      this.submenu = false
      AlbumService.repostAlbum(this.album.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You just reposted ' + this.album.name])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    showDownloadDialog () {
      this.menu = false
      this.submenu = false
      this.download_dialog = true
    },

    dismissDownloadDialog () {
      this.download_dialog = false
    },

    showShareDialog () {
      this.menu = false
      this.submenu = false
      this.share_dialog = true
    },

    dismissShareDialog () {
      this.share_dialog = false
    },

    flagItem () {
      this.menu = false
      this.submenu = false
    },

    addComment () {
      this.menu = false
      this.submenu = false
    },

    addToNewPlaylist () {
      this.menu = false
      this.playlist = {
        name: '',
        image: null
      }
      this.selectedImage = null
    },

    createPlaylist () {
      this.playlist_dialog = false

      const params = new FormData()
      params.append('name', this.playlist.name)
      params.append('description', this.playlist.name)
      if (this.playlist.image) {
        params.append('cover', this.playlist.image)
      }
      params.append('assoc_id', this.track.id)
      params.append('assoc_type', 'Track')
      this.$store.dispatch('error/showLoadingActivity', true)
      PlaylistService.createPlaylist(params).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', ['Added the track to New Playlist '])

        PlaylistService.getPlaylists().then(response => {
          this.$store.dispatch('playlist/setPlaylists', response.body)
        })
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    addToPlaylist (list) {
      this.menu = false
      this.submenu = false
      const params = {
        assoc_id: this.track.id,
        assoc_type: 'Track'
      }
      PlaylistService.updatePlaylist(list.id, params).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['Added the track to <' + list.name + '>'])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    imageChanged (e) {
      this.playlist.image = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener('load', (event) => {
        this.selectedImage = event.target.result
      }, false)
      reader.readAsDataURL(this.playlist.image)
    },

    selectTrack () {
      // console.log('album-track-item selectTrack', this.trackIndex, this.isPlaying)
      if (this.isPlaying) {
        this.setTrackIndex(this.trackIndex)
        // this.$store.dispatch('player/setTrackIndex', this.trackIndex)
        this.$root.$emit('skipTo')
      } else {
        this.setPlaylist([this.album])
        this.setPlaylistIndex(0)
        this.setPlaying(true)
        this.setTrackIndex(this.trackIndex)
        // this.$store.dispatch('player/setTrackIndex', this.trackIndex)
        this.setPage(this.$store.state.auth.page)
        this.setTab(this.$store.state.auth.tab)
        this.$root.$emit('play')
      }
    },

    goToAlbumStats (stats) {
      this.$store.dispatch('album/setAlbumStats', stats)
      this.$router.push({ path: '/album/' + this.album.slug + '/stats' })
    }
  }
}
</script>
