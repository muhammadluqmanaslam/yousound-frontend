<template>
  <v-flex class="track-card">
    <v-flex xs12 class="track-info" pa-0 v-if="!_.isEmpty(item)">
      <v-flex xs12 class="track-user" v-if="false" pa-0>
        <profile-item :user="publisher" :className="'track-user-avatar'"></profile-item>
        <div class="track-user-content-section">
          <router-link :to="'/' + publisher.slug"><p class="track-user-name">{{ publisher.display_name }}</p></router-link>
          <div class="track-posted-at">
            <img class="track-status-icon" src="/static/images/ic_repeat.png" /><label>reposted 10min ago</label>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 class="track-cover">
        <div class="playlist-icon" v-if="item.album_type=='playlist'">
          <img src="/static/images/playlist.png" />
        </div>
        <div class="track-image" :style="{'background-image': 'url(' + item.cover.url + ')'}"></div>
        <v-flex xs12 class="track-actions" :class="{'playing': isPlaying}">
          <router-link :to="`/${item.album_type}/${item.slug}`"><v-flex xs12 class="touch-flex"></v-flex></router-link>
          <v-btn dark class="play-button" @click.native="playSong()" v-if="!isPlaying || $store.state.player.isPaused">
            <v-icon>play_arrow</v-icon>
          </v-btn>
          <v-btn dark class="play-button" @click.native="pauseSong()" v-if="isPlaying && !$store.state.player.isPaused">
            <v-icon>pause</v-icon>
          </v-btn>
          <v-menu v-if="$store.state.auth.user"
              offset-y
              :close-on-content-click="false"
              :nudge-width="100"
              v-model="menu"
              class="track-menu">
            <v-btn dark slot="activator">
              <v-icon right>more_horiz</v-icon>
            </v-btn>
            <v-card>
              <v-list>
                <v-list-tile v-if="item.user.id != $store.state.auth.user.id"
                    key="repost"
                    class="default-menu-item track-menu-item"
                    @click.native="repostItem()">
                  <v-list-tile-title>
                    <img class="track-status-icon" src="/static/images/ic_repeat.png" />
                    <label>Repost</label>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-if="item.album_type!='playlist'"
                    key="download"
                    class="default-menu-item track-menu-item"
                    @click.native="showDownloadDialog()">
                  <v-list-tile-title>
                    <img class="track-status-icon" src="/static/images/ic_download.png" />
                    <label>Download</label>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                    key="share"
                    class="default-menu-item track-menu-item"
                    @click.native="showShareDialog()">
                  <v-list-tile-title>
                    <img class="track-status-icon" src="/static/images/ic_share.png" />
                    <label>Share</label>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-if="item.user.id != $store.state.auth.user.id"
                    key="hide"
                    class="default-menu-item track-menu-item"
                    @click.native="showHideAlbumDialog()">
                  <v-dialog v-model="hide_dialog" class="album-hide-dialog" max-width="500px">
                    <v-list-tile-title slot="activator">
                      <v-icon>visibility_off</v-icon>
                      <label>Hide</label>
                    </v-list-tile-title>
                    <v-card class="album-hide-dialog-body">
                      <v-card-text>
                        <div class="album-hide-avatar" :style="{'background-image': 'url(' + item.cover.url + ')'}"></div>
                        <v-flex xs12 sm12>
                          <label class="album-hide-title">Are you sure you want to hide this {{item.album_type}}?</label>
                        </v-flex>
                        <v-flex xs12 sm12>
                          <label class="album-hide-text">You won't be able to see it anymore, unless you visit the artists profile or download the song.</label>
                        </v-flex>
                      </v-card-text>
                      <v-card-actions>
                        <v-flex xs12 sm12>
                          <v-btn class="hide-cancel-btn" flat @click.native="hide_dialog = false">No, cancel please!</v-btn>
                          <v-btn class="hide-ok-btn" flat @click.native="hideAlbum()">Yes, hide it!</v-btn>
                        </v-flex>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-list-tile>
                <v-list-tile
                    key="flag"
                    class="default-menu-item track-menu-item"
                    @click.native="flagItem()">
                  <v-list-tile-title>
                    <img class="track-status-icon" src="/static/images/ic_flag.png" />
                    <label>Flag</label>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-if="$store.state.auth.user.user_type == 'label'"
                    key="add_to_my_label" 
                    class="default-menu-item track-menu-item" 
                    @click.native="addToMyLabel()">
                  <v-list-tile-title>
                    <img class="track-status-icon" src="/static/images/ic_add_to.png" />
                    <label>Add to my label</label>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-if="item.album_type != 'playlist'"
                    key="add_to_playlist"
                    class="default-menu-item track-menu-item has-sub-menu">
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
                                <div class="image-change-section" v-if="playlist.image">
                                  <input type="file" name="playlist_image_file" :id="input_id" class="change-playlist-image-file" accept="image/*" @change="imageChanged($event)">
                                  <label :for="input_id">Change</label>
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
                          :key="`playlist_2_${list_index}`"
                          class="default-menu-item track-menu-item"
                          @click.native="addToPlaylist(list)">
                        <v-list-tile-title>
                          <img class="track-status-icon" src="/static/images/ic_download.png" />
                          <label>{{ list.name }}</label>
                        </v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-list-tile>
                <v-list-tile v-if="['admin', 'moderator'].indexOf($store.state.auth.user.user_type) > -1 && !item.recommended"
                    key="recommended"
                    class="default-menu-item track-menu-item"
                    @click.native="recommendAlbum()">
                  <v-list-tile-title>
                    <v-icon>thumb_up</v-icon>
                    <label>Recommend</label>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-if="['admin', 'moderator'].indexOf($store.state.auth.user.user_type) > -1 && item.recommended"
                    key="unrecommended"
                    class="default-menu-item track-menu-item"
                    @click.native="unrecommendAlbum()">
                  <v-list-tile-title>
                    <v-icon>thumb_down</v-icon>
                    <label>Unrecommend</label>
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-menu>
          <p class="track-count">{{ item.tracks.length }} tracks</p>
        </v-flex>
      </v-flex>
      <v-flex xs12 class="track-detail" pa-0>
        <router-link :to="`/${item.album_type}/${item.slug}`"><p class="track-name">{{ item.name }}</p></router-link>

        <router-link :to="'/' + owner.slug" v-if="item.collaborators_count == 0"><p class="track-user-name">{{ owner.display_name }}</p></router-link>
        <router-link :to="`/${item.album_type}/${item.slug}`" v-else><p class="track-user-name">Multiple Collaborators</p></router-link>
      </v-flex>
    </v-flex>
    <download-modal :item="item" :dismiss="dismissDownloadDialog" v-if="showDownloadModal"></download-modal>
    <share-modal :item="item" :dismiss="dismissShareDialog" v-if="showShareModal"></share-modal>
  </v-flex>  
</template>

<script type="text/javascript">
import _ from 'lodash'
import { mapActions } from 'vuex'
import AlbumService from '@/services/album'
import PlaylistService from '@/services/playlist'
import downloadModal from '@/components/downloadmodal'
import profileItem from '@/components/profileitem'
import shareModal from '@/components/sharemodal'

export default {
  components: {
    downloadModal,
    shareModal,
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
      showShareModal: false,
      hide_dialog: false,
      playlist_dialog: false,
      menu: false,
      submenu: false,
      playlist: {
        name: '',
        image: null
      },
      page: '',
      selectedImage: null
    }
  },

  computed: {
    _ () {
      return _
    },

    isShowUserInfo () {
      if (this.$store.state.auth.page === 'stream') {
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
    },

    input_id () {
      return 'playlist_image_file_' + this.item.slug + '_' + parseInt((Math.random() * 999999))
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

    playSong () {
      if (this.isPlaying && this.$store.state.player.isPaused) {
        this.$root.$emit('replay')
      } else {
        this.setPlaylist(this.objects)
        this.setPlaylistIndex(this.objectIndex)
        this.setTrackIndex(0)
        this.setPlaying(true)
        this.setPage(this.$store.state.auth.page)
        this.setTab(this.$store.state.auth.tab)
        this.$root.$emit('play')
      }
    },

    pauseSong () {
      this.$root.$emit('pause')
    },

    repostItem () {
      this.menu = false
      this.submenu = false
      AlbumService.repostAlbum(this.item.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You just reposted ' + this.item.name])
      })
      .catch(e => {
        if (e.body.errors) {
          this.$store.dispatch('error/showErrorToast', e.body.errors)
        } else {
          this.$store.dispatch('error/showErrorToast', [e.body])
        }
      })
    },

    showDownloadDialog () {
      this.menu = false
      this.submenu = false
      this.showDownloadModal = true
    },

    dismissDownloadDialog () {
      this.showDownloadModal = false
    },

    showShareDialog () {
      this.menu = false
      this.submenu = false
      this.showShareModal = true
    },

    dismissShareDialog () {
      this.showShareModal = false
    },

    showHideAlbumDialog () {
      this.menu = false
      this.submenu = false
      this.hide_dialog = true
    },

    hideAlbum () {
      this.menu = false
      this.submenu = false
      this.hide_dialog = false
      AlbumService.hideAlbum(this.item.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You just hid ' + this.item.name])
      })
      .catch(e => {
        if (e.body.errors) {
          this.$store.dispatch('error/showErrorToast', e.body.errors)
        } else {
          this.$store.dispatch('error/showErrorToast', [e.body])
        }
      })
    },

    flagItem () {
      this.menu = false
      this.submenu = false
    },

    addComment () {
      this.menu = false
      this.submenu = false
    },

    addToMyLabel () {
      AlbumService.sendLabelRequest(this.item.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You just send a label request on <' + this.item.name + '>'])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
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
      if (this.playlist.name.replace(' ', '').length > 0) {
        if (this.playlist.image !== null) {
          const params = new FormData()
          params.append('name', this.playlist.name)
          params.append('description', this.playlist.name)
          if (this.playlist.image) {
            params.append('cover', this.playlist.image)
          }
          // params.append('assoc_id', this.item.id)
          // params.append('assoc_type', 'Album')
          params.append('assoc_id', this.item.tracks[0].id)
          params.append('assoc_type', 'Track')
          this.$store.dispatch('error/showLoadingActivity', true)
          PlaylistService.createPlaylist(params).then(response => {
            this.playlist_dialog = false
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('error/showSuccessToast', ['Added the album to New Playlist '])
            this.getPlaylists()
          }).catch(e => {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        } else {
          this.$store.dispatch('error/showErrorToast', ['Please add Playlist cover.'])
        }
      } else {
        this.$store.dispatch('error/showErrorToast', ['Please input Playlist name.'])
      }
    },

    addToPlaylist (list) {
      this.menu = false
      this.submenu = false
      const params = new FormData()
      params.append('assoc_id', this.item.id)
      params.append('assoc_type', 'Album')
      PlaylistService.updatePlaylist(list.id, params).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['Added the track to <' + list.name + '>'])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    recommendAlbum () {
      this.menu = false
      this.submenu = false
      AlbumService.recommendAlbum(this.item.id).then(response => {
        this.item.recommended = true
        this.$store.dispatch('error/showSuccessToast', ['You just recommended ' + this.item.name])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    unrecommendAlbum () {
      this.menu = false
      this.submenu = false
      AlbumService.unrecommendAlbum(this.item.id).then(response => {
        this.item.recommended = false
        this.$store.dispatch('error/showSuccessToast', ['You just unrecommended ' + this.item.name])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    imageChanged (e) {
      if (e.target.files[0].size > 2097152) {
        // console.log(e.target.files)
        this.$store.dispatch('error/showErrorToast', ['You can upload an image 2MB in maximum'])
        return
      }

      this.playlist.image = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener('load', (event) => {
        this.selectedImage = event.target.result
      }, false)
      reader.readAsDataURL(this.playlist.image)
    },

    getPlaylists () {
      PlaylistService.getPlaylists().then(response => {
        this.$store.dispatch('playlist/setPlaylists', response.body)
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>
