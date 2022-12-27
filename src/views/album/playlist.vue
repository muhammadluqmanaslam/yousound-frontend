<template>
  <v-layout row wrap class="page album-detail-page">
    <canvas id="canvas" class="background-image"></canvas>
    <div id="back_image" class="background-overlay"></div>

    <v-flex xs12 sm10 offset-sm1 class="album-pages" v-if="playlist">
      <div class="album-info-page" id="album_info_page">
        <div class="album-image-section">
          <div
            class="album-image playlist"
            :style="{
              'background-image': `url(${album1Cover}), url(${album2Cover}), url(${album3Cover}), url(${album4Cover})`,
            }"
          ></div>
          <div class="album-hover-section">
            <div class="play-button-section">
              <v-btn
                dark
                class="play-button"
                @click.native="playSong()"
                v-if="!isPlaying || $store.state.player.isPaused"
              >
                <v-icon class="play">play_arrow</v-icon>
              </v-btn>
              <v-btn
                dark
                class="play-button"
                @click.native="pauseSong()"
                v-if="isPlaying && !$store.state.player.isPaused"
              >
                <v-icon class="pause">pause</v-icon>
              </v-btn>
            </div>
          </div>
          <div class="action-section"></div>
        </div>
        <div class="album-detail-section">
          <div class="album-info-section">
            <label class="album-title">{{ playlist.album_type }}</label>
            <h4 class="album-name">{{ playlist.name }}</h4>
            <div class="py-2">
              <!-- <label class="album-description">{{ playlist.description }}</label> -->
              <v-dialog
                v-if="currentUser.id == playlist.user.id"
                v-model="playlist_dialog"
                scrollable
                max-width="600px"
                class="album-credits-dialog"
              >
                <v-btn color="primary" dark slot="activator" class="text-btn"
                  >Edit playlist</v-btn
                >
                <v-card class="album-dialog-body">
                  <v-card-title>Edit Playlist</v-card-title>
                  <v-btn
                    class="dialog-close-btn"
                    @click.native="playlist_dialog = false"
                  >
                    <v-icon>highlight_off</v-icon>
                  </v-btn>
                  <v-card-text class="create-playlist-section">
                    <!-- <div class="playlist-image-section">
                      <div class="image-section">
                        <div class="playlist-image" id="playlist_image" v-if="selectedImage" :style="`background-image: url(${selectedImage})`"></div>
                        <div class="playlist-image-upload-section" v-if="!selectedImage">
                          <input type="file" name="playlist_image_file" :id="input_id" class="add-playlist-image-file" accept="image/*" @change="imageChanged($event)">
                          <label :for="input_id">
                            <v-icon class="camera">photo_camera</v-icon>Add Image
                          </label>
                        </div>
                      </div>
                      <div class="image-change-section" v-if="selectedImage">
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
                          v-model="playlist.name"
                        />
                      </v-flex>
                      <v-flex xs12 form-group text-xs-center>
                        <v-btn
                          dark
                          round
                          color="blue"
                          @click.native="updatePlaylist()"
                          >Update Playlist</v-btn
                        >
                        <v-btn
                          dark
                          round
                          color="red"
                          @click.native="deletePlaylist()"
                          >Delete Playlist</v-btn
                        >
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </div>
            <p class="album-detail">
              by
              <router-link
                :to="'/' + playlist.user.slug"
                class="album-detail"
                >{{ playlist.user.username }}</router-link
              >
              • 2017 – {{ playlist.tracks.length }} Songs, 40:22
            </p>
          </div>
          <div
            v-if="currentUser.id != playlist.user.id"
            class="album-tracks-section"
          >
            <album-track-item
              v-for="(track, index) in playlist.tracks"
              :key="index"
              :album="playlist"
              :trackIndex="index"
            ></album-track-item>
          </div>
          <div v-else class="album-tracks-section">
            <draggable
              v-model="playlist.tracks"
              class="track-items"
              @end="onEnd"
            >
              <transition-group>
                <album-track-item
                  v-for="(track, index) in playlist.tracks"
                  :key="index"
                  :album="playlist"
                  :trackIndex="index"
                  :removeTrack="removeTrack"
                  :showStats="true"
                ></album-track-item>
              </transition-group>
            </draggable>
          </div>
        </div>
      </div>

      <v-flex
        xs12
        sm10
        offset-sm1
        album-comment-page
        v-if="false && currentUser"
      >
        <h4 class="comment-title">Talk to {{ playlist.user.username }}</h4>
        <label class="description"
          >Comments are only seen by the artist and people you @mention, unless
          artist makes your comment public.</label
        >
        <div class="comments-section">
          <div class="tab-section">
            <div class="comment-tab">
              <label class="comment-count">{{ commentsCount }} Comments</label>
            </div>
          </div>
          <div class="content-section">
            <div class="add-comment-section">
              <img class="profile-image" :src="currentUser.avatar.thumb.url" />
              <!-- <div class="profile-image" :style="{'background-image': 'url(' + currentUser.avatar.thumb.url + ')'}"/></div> -->
              <input
                type="text"
                class="comment-input"
                name="comment_input"
                placeholder="Spark a conversation..."
                v-model="commentString"
                @keyup.enter="addComments()"
                ref="comment"
              />
              <picker
                title="Pick your emoji…"
                emoji="point_up"
                class="emoji-picker"
                @click="addEmoji"
                v-if="showEmojiPicker"
              ></picker>
              <v-btn
                class="show-emoji-box-btn"
                :class="{ selected: showEmojiPicker }"
                @click.native="showEmojiPicker = !showEmojiPicker"
              >
                <v-icon>tag_faces</v-icon>
              </v-btn>
            </div>
            <div class="comment-items">
              <div
                class="comment-item"
                v-for="(comment, index) in comments"
                :key="index"
              >
                <div class="comment-parent-item">
                  <profile-item
                    :user="comment.user"
                    :className="'comment-user-avatar'"
                  ></profile-item>
                  <div class="comment-content relative">
                    <router-link :to="'/' + comment.user.slug"
                      ><label class="user-name"
                        >{{ comment.user.username }}
                        <v-icon
                          class="user-status online"
                          v-if="comment.user.user_type == 'artist'"
                          >fa-check-circle</v-icon
                        ></label
                      ></router-link
                    >
                    <p
                      class="commnet-text"
                      v-html="convertedHTML(comment.body)"
                    ></p>
                  </div>
                  <div class="right-section">
                    <v-menu offset-y class="comment-more-action">
                      <v-btn dark class="more-btn" slot="activator">
                        <v-icon right>more_horiz</v-icon>
                      </v-btn>
                      <v-list>
                        <v-list-tile
                          key="public"
                          v-if="
                            currentUser.id == playlist.user.id &&
                            comment.status == 'privated'
                          "
                          @click.native="makePublicComment(comment)"
                        >
                          <v-list-tile-title class="default-menu-item">
                            <!-- <img class="track-status-icon" src="/static/images/ic_comment_public.png" /> -->
                            <i class="fa fa-eye"></i>
                            <label>Make Public</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile
                          key="private"
                          v-if="
                            currentUser.id == playlist.user.id &&
                            comment.status == 'published'
                          "
                          @click.native="makePrivateComment(comment)"
                        >
                          <v-list-tile-title class="default-menu-item">
                            <!-- <img class="track-status-icon" src="/static/images/ic_comment_private.png" /> -->
                            <i class="fa fa-eye-slash"></i>
                            <label>Make Private</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile
                          key="block"
                          v-if="
                            currentUser.id == playlist.user.id &&
                            currentUser.id != comment.user.id
                          "
                          @click.native="blockUser(comment)"
                        >
                          <v-list-tile-title class="default-menu-item">
                            <img
                              class="track-status-icon"
                              src="/static/images/ic_comment_flag.png"
                            />
                            <label>Block User</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile
                          key="delete"
                          v-if="
                            currentUser.id == playlist.user.id ||
                            currentUser.id == comment.user.id
                          "
                          @click.native="deleteComment(comment)"
                        >
                          <v-list-tile-title class="default-menu-item">
                            <img
                              class="track-status-icon"
                              src="/static/images/ic_comment_delete.png"
                            />
                            <label>Delete Comment</label>
                          </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                    <label class="comment-time">Now</label>
                  </div>
                </div>
                <!-- <div class="child-items" v-if="false">
                  <div class="comment-child-item">
                    <img class="profile-image" src="/static/images/sample_user.png" />
                    <div class="comment-content relative">
                      <label class="user-name">Ruckazoid <v-icon class="user-status online">fa-check-circle</v-icon></label>
                      <p class="commnet-text">🙌🏿 You da man! Thanks bro.</p>
                    </div>
                    <div class="right-section">
                      <v-menu offset-y class="comment-more-action">
                        <v-btn dark class="more-btn" slot="activator">
                          <v-icon right>more_horiz</v-icon>
                        </v-btn>
                        <v-list>
                          <v-list-tile key="repost">
                            <v-list-tile-title class="default-menu-item">
                              <img class="track-status-icon" src="/static/images/ic_comment_public.png" />
                              <label>Make Public</label>
                            </v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile key="download">
                            <v-list-tile-title class="default-menu-item">
                              <img class="track-status-icon" src="/static/images/ic_comment_flag.png" />
                              <label>Flag Comment</label>
                            </v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile key="share" class="default-menu-item">
                            <v-list-tile-title>
                              <img class="track-status-icon" src="/static/images/ic_comment_delete.png" />
                              <label>Delete Comment</label>
                            </v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                      <label class="comment-time">5 min ago</label>
                    </div>
                  </div>
                </div> -->
              </div>
              <div class="text-xs-center">
                <v-btn
                  v-if="hasMoreComments"
                  @click.native="loadMoreComments()"
                  class="loadmore-btn"
                  >More Comments</v-btn
                >
              </div>
            </div>
          </div>
        </div>
      </v-flex>

      <v-flex xs12 sm10 offset-sm1 album-recent-page v-if="currentUser">
        <h4 class="recent-title">
          {{ playlist.user.username }}'s recent reposts
        </h4>
        <v-layout row wrap class="recent-content">
          <div
            v-for="(feed, index) in playlist.user.recent_items"
            v-if="
              ['Album', 'ShopProduct', 'Stream'].indexOf(feed.assoc_type) > -1
            "
            :key="feed.id"
            class="card-container"
          >
            <track-card
              :objects="playlist.user.recent_items"
              :objectIndex="index"
              v-if="feed.assoc_type == 'Album'"
            />
            <product-card
              :dataObject="feed"
              v-if="feed.assoc_type == 'ShopProduct'"
            />
            <video-card :dataObject="feed" v-if="feed.assoc_type == 'Stream'" />
          </div>
        </v-layout>
      </v-flex>

      <download-modal
        v-if="showDownloadModal"
        :item="playlist"
        :dismiss="dismissDownloadModal"
      />
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript" src="./playlist.ctrl.js"></script>
<style scoped src="../../../static/styles/album.scss" lang="scss"></style>
