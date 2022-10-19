<template>
  <v-flex class="track-card dflex">
    <v-flex
      v-if="!isEmptyAlbum"
      @mouseenter="is_component_hover = true"
      @mouseleave="is_component_hover = false"
      xs12
      pa-0
      class="track-info"
    >
      <v-flex xs12 class="track-cover">
        <template v-if="item.album_type == 'playlist'">
          <div class="playlist-icon">
            <img src="/static/images/playlist.png" />
          </div>
          <div
            class="track-image"
            :class="item.album_type"
            :style="{
              'background-image': `url(${album1Cover}), url(${album2Cover}), url(${album3Cover}), url(${album4Cover})`,
            }"
          ></div>
        </template>
        <template v-else>
          <div
            class="track-image"
            :style="{ 'background-image': 'url(' + item.cover.url + ')' }"
          ></div
          >
          <!-- <div class="track-image" v-lazy:background-image="item.cover.url"></div> -->
        </template>

        <v-flex xs12 class="track-actions" :class="{ playing: isPlaying }">
          <span @click="gotoItem()">
            <v-flex xs12 class="touch-flex"></v-flex>
          </span>
          <v-btn
            v-if="!isPlaying || $store.state.player.isPaused"
            @click.native="playSong()"
            dark
            class="play-button"
            :class="{ 'play-button-2': playButton2 }"
          >
            <v-icon
              :class="[
                {
                  'play-button-2': playButton2,
                  iconHasWhiteBG: playButton2IconHasWhiteBG,
                  'black--text': playButton2IconHasWhiteBG,
                }
              ]"
            >
              play_arrow
            </v-icon>
          </v-btn>
          <v-btn
            v-if="isPlaying && !$store.state.player.isPaused"
            @click.native="pauseSong()"
            dark
            class="play-button"
          >
            <v-icon
              :class="[
                {
                  'play-button-2': playButton2,
                  iconHasWhiteBG: playButton2IconHasWhiteBG,
                  'black--text': playButton2IconHasWhiteBG,
                },
              ]"
            >
              pause
            </v-icon>
          </v-btn>
          <v-menu
            v-if="currentUser && willMenuRender && !hideMoreMenu"
            v-model="menu"
            offset-y
            :close-on-content-click="false"
            :nudge-width="100"
            class="track-menu"
          >
            <v-btn dark slot="activator" @click="is_menu_hover = true">
              <v-icon right>more_horiz</v-icon>
            </v-btn>
            <v-card>
              <v-list>
                <v-list-tile
                  v-if="item.user.id != currentUser.id"
                  key="repost"
                  @click.native="repostItem()"
                  class="default-menu-item track-menu-item"
                >
                  <v-list-tile-title>
                    <!-- <img
                      class="track-status-icon"
                      src="/static/images/ic_repeat.png"
                    /> -->
                    <label>Repost</label>
                  </v-list-tile-title>
                </v-list-tile>
                <!-- <v-list-tile
                  v-if="item.album_type != 'playlist'"
                  key="download"
                  @click.native="showDownloadDialog()"
                  class="default-menu-item track-menu-item"
                >
                  <v-list-tile-title>
                    <img
                      class="track-status-icon"
                      src="/static/images/ic_download.png"
                    />
                    <label>Download</label>
                  </v-list-tile-title>
                </v-list-tile> -->
                <v-list-tile
                  key="share"
                  @click.native="showShareDialog()"
                  class="default-menu-item track-menu-item"
                >
                  <v-list-tile-title>
                    <!-- <img
                      class="track-status-icon"
                      src="/static/images/ic_share.png"
                    /> -->
                    <label>Share</label>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="item.user.id != currentUser.id"
                  key="hide"
                  @click.native="showHideAlbumDialog()"
                  class="default-menu-item track-menu-item"
                >
                  <v-list-tile-title>
                    <!-- <v-icon>visibility_off</v-icon> -->
                    <label>Hide</label>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="item.user.id != currentUser.id"
                  key="report"
                  @click.native="openReportDialog()"
                  class="default-menu-item track-menu-item"
                >
                  <v-list-tile-title>
                    <!-- <img
                      class="track-status-icon"
                      src="/static/images/ic_flag.png"
                    /> -->
                    <label>Report</label>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="currentUser.user_type == 'label'"
                  key="add_to_my_label"
                  @click.native="addToMyLabel()"
                  class="default-menu-item track-menu-item"
                >
                  <v-list-tile-title>
                    <!-- <img
                      class="track-status-icon"
                      src="/static/images/ic_add_to.png"
                    /> -->
                    <label>Add to my label</label>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="false && item.album_type != 'playlist'"
                  key="add_to_playlist"
                  class="default-menu-item track-menu-item has-sub-menu"
                >
                  <v-menu v-model="submenu" offset-x class="track-menu">
                    <v-list-tile-title slot="activator" class="has-sub-menu">
                      <!-- <img
                        class="track-status-icon"
                        src="/static/images/ic_add_to.png"
                      /> -->
                      <label>Add to Playlist</label>
                    </v-list-tile-title>
                    <v-list>
                      <v-list-tile
                        key="add_to_playlist"
                        @click.native="addToNewPlaylist()"
                        class="default-menu-item track-menu-item"
                      >
                        <v-list-tile-title>
                          <!-- <img
                            class="track-status-icon"
                            src="/static/images/ic_add_to.png"
                          /> -->
                          <label>New Playlist</label>
                        </v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile
                        v-for="(list, list_index) in playlists"
                        :key="`playlist_2_${list_index}`"
                        @click.native="addToPlaylist(list)"
                        class="default-menu-item track-menu-item"
                      >
                        <v-list-tile-title>
                          <!-- <img
                            class="track-status-icon"
                            src="/static/images/ic_download.png"
                          /> -->
                          <label>{{ list.name }}</label>
                        </v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-list-tile>
                <v-list-tile
                  v-if="
                    ['admin', 'moderator'].indexOf(currentUser.user_type) >
                      -1 && !item.recommended
                  "
                  key="recommended"
                  @click.native="recommendAlbum()"
                  class="default-menu-item track-menu-item"
                >
                  <v-list-tile-title>
                    <!-- <v-icon>thumb_up</v-icon> -->
                    <label>Recommend</label>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="
                    ['admin', 'moderator'].indexOf(currentUser.user_type) >
                      -1 && item.recommended
                  "
                  key="unrecommended"
                  @click.native="unrecommendAlbum()"
                  class="default-menu-item track-menu-item"
                >
                  <v-list-tile-title>
                    <!-- <v-icon>thumb_down</v-icon> -->
                    <label>Unrecommend</label>
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-menu>
          <p v-if="!hideTrackLength" class="track-count">
            {{ item.tracks.length }} tracks
          </p>
          <div v-if="showHoverTrackInfo" class="track-hover-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="artist-name">{{ owner.username }}</div>
          </div>
        </v-flex>
      </v-flex>
      <v-flex v-if="!noMeta && !noAction" xs12 class="track-detail" pa-0>
        <p class="track-name">
          <router-link :to="`/${item.album_type}/${item.slug}`">{{
            item.name
          }}</router-link>
        </p>
        <p class="track-user-name">
          <router-link
            :to="'/' + owner.slug"
            v-if="item.collaborators_count == 0"
            >{{ owner.username }}</router-link
          >
          <template v-else-if="item.collaborators_count == 1">
            <router-link :to="'/' + owner.slug">{{
              owner.username
            }}</router-link
            >,&nbsp;
            <router-link
              :to="'/' + item.collaborators[0].user.slug"
              v-if="item.collaborators && item.collaborators[0]"
              >{{ item.collaborators[0].user.username }}</router-link
            >
          </template>
          <router-link :to="`/${item.album_type}/${item.slug}`" v-else
            >Multiple Collaborators</router-link
          >
        </p>
      </v-flex>
    </v-flex>

    <download-modal
      v-if="showDownloadModal"
      :item="item"
      :dismiss="dismissDownloadDialog"
    />

    <share-modal
      v-if="showShareModal"
      :item="item"
      :dismiss="dismissShareDialog"
    />

    <v-dialog
      v-if="show_report_dialog"
      v-model="show_report_dialog"
      width="1000"
      persistent
    >
      <album-report-dialog :album="item" :dismiss="closeReportDialog" />
    </v-dialog>

    <v-dialog
      v-if="hide_dialog"
      v-model="hide_dialog"
      content-class="my-dialog-1"
    >
      <v-card>
        <v-card-media
          :src="item.cover.url"
          height="125px"
          contain
        ></v-card-media>
        <v-card-text>
          <div class="headline">
            Are you sure you want to hide this {{ item.album_type }}?
          </div>
          <div>
            You won't be able to see it anymore, unless you visit the artists
            profile or download the song.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn dark color="grey" @click.native="hide_dialog = false"
            >No, cancel please!</v-btn
          >
          <v-btn dark color="red" @click.native="hideAlbum()"
            >Yes, hide it!</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="playlist_dialog"
      v-model="playlist_dialog"
      max-width="500px"
      class="playlist-dialog"
    >
      <v-card class="playlist-dialog-body">
        <v-card-title>
          <v-flex xs12 text-xs-center>
            <h5 class="ma-0">New Playlist</h5>
          </v-flex>
          <v-btn
            class="dialog-close-btn"
            @click.native="playlist_dialog = false"
            ><v-icon>highlight_off</v-icon></v-btn
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="create-playlist-section">
          <!-- <div class="playlist-image-section">
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
          </div> -->
          <v-layout row wrap>
            <v-flex xs12 form-group>
              <label class="control-label"
                >Name<label class="required">*</label></label
              >
              <input
                type="text"
                class="form-control"
                v-model.trim="playlist.name"
              />
            </v-flex>
            <v-flex xs12 form-group text-xs-center>
              <v-btn dark round color="blue" @click.native="createPlaylist()"
                >Create Playlist</v-btn
              >
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-flex>
</template>

<script type="text/javascript" src="./trackcard.ctrl.js"></script>
