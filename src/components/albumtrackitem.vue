<template>
  <div
    @click.self="selectTrack()"
    @mouseenter="buttonHover=true"
    @mouseleave="buttonHover=false"
    :class="{'selected': buttonHover || (isPlaying && trackIndex==$store.state.player.trackIndex) || (!isPlaying && trackIndex==0)}"
    class="album-track-item relative"
  >
    <v-btn class="action-btn" v-if="false && (!currentUser || (currentUser && album.user.id!=currentUser.id))">
      <!-- <v-icon v-if="(trackIndex==$store.state.player.trackIndex && !isPlaying) || (buttonHover && trackIndex!=$store.state.player.trackIndex)">play_arrow</v-icon> -->
      <v-icon v-if="trackIndex==$store.state.player.trackIndex && isPlaying">pause</v-icon>
      <v-icon v-else-if="buttonHover || (trackIndex==0 && !isPlaying)">play_arrow</v-icon>
    </v-btn>
    <label class="track-name" @click.self="selectTrack()">
      <span class="track-index">{{ trackIndex + 1 }}. </span>
      <span>{{ track.name }}</span>
      <router-link
        v-if="album.album_type == 'playlist'"
        class="track-user-name"
        :to = "`/${track.user.slug}`"
      > - {{ track.user.display_name }}</router-link>
    </label>
    <div class="right-section">
      <v-menu v-model="menu"
        offset-y
        class="track-more-action"
        :close-on-content-click="false"
      >
        <v-btn dark class="more-btn" slot="activator">
          <v-icon right>more_horiz</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
            v-if="album.album_type == 'playlist' && currentUser && album.user.id == currentUser.id"
            key="remove_track"
            @click.native="removeItem()"
          >
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
                <v-list-tile
                  v-for="(list, list_index) in playlists"
                  :key="`playlist_1_${list_index}`"
                  class="default-menu-item track-menu-item"
                  @click.native="addToPlaylist(list)"
                >
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
    <div class="track-actions" v-if="showStats">
      <v-btn class="action-btn"><v-icon>play_arrow</v-icon>{{ track.played }}</v-btn>
      <!-- <v-btn class="action-btn" @click.native="goToAlbumStats('played_by')">
        <v-icon>play_arrow</v-icon>3k
      </v-btn>
      <v-btn class="action-btn" @click.native="goToAlbumStats('downloaded_by')">
        <img src="/static/images/ic_repost_trans.png" />1.3k
      </v-btn>
      <v-btn class="action-btn" @click.native="goToAlbumStats('reposted_by')">
        <img src="/static/images/ic_repeat_trans.png" />975
      </v-btn> -->
    </div>

    <download-modal
      v-if="download_dialog"
      :item="album"
      :track="track"
      :dismiss="dismissDownloadDialog"
    />

    <share-modal
      v-if="share_dialog"
      :item="album"
      :dismiss="dismissShareDialog"
    />
  </div>
</template>

<script type="text/javascript" src="./albumtrackitem.ctrl.js"></script>
