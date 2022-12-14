<template>
  <v-layout v-if="isPageReady" row wrap class="page no-top-nav album-detail-page">
    <v-flex xs12 class="album-pages margin-top-header" v-if="isPageReady">
      <canvas id="canvas" class="background-image"></canvas>
      <div id="back_image" class="background-overlay"></div>
      <div class="album-info-page" id="album_info_page">
        <div class="album-image-section">
          <div
            class="album-image"
            :style="`background-image: url(${coverImageURL})`"
          ></div>
          <div class="meta-details">
            <span class="album-plays"
              >{{
                album.played.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }}
              plays</span
            >
            <span class="mx-2">&bull;</span>
            <span class="cursor-pointer" @click="dialog = true"
              >Album Credits</span
            >
          </div>
        </div>
        <div class="album-detail-section">
          <div class="album-info-section">
            <label class="album-title">{{ album.album_type }} </label>
            <h4 class="album-name">{{ album.name }}</h4>
            <div class="album-detail">
              by
              <router-link :to="'/' + album.user.slug" class="album-detail">{{
                album.user.username
              }}</router-link>
              <template v-for="collaborator in album.collaborators">
                <div :key="`${collaborator.id}`" class="d-inline-block">
                  <span>,</span>
                  <router-link
                    :to="'/' + collaborator.user.slug"
                    class="album-detail"
                    >{{ collaborator.user.username }}</router-link
                  >
                </div>
              </template>
              <div
                v-if="
                  currentUser &&
                  currentUser.user_type != 'listener' &&
                  album.enabled_sample
                "
                class="album-sample-clearance mr-2"
              >
                • Cleared to be sampled on YouSound.
                <span
                  class="border-bottom"
                  @click="openSampleClearanceLicenseModal()"
                  >More Info</span
                >
              </div>
              <label
                class="album-stats-btn"
                @click="goToAlbumStats('played_by')"
                v-if="showStats"
                >View Stats</label
              >
            </div>
            <span class="play-button-section">
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
            </span>
            <span class="album-action-section">
              <v-menu offset-y class="more-menu">
                <v-btn dark class="more-btn" slot="activator">
                  <v-icon right>more_horiz</v-icon>
                </v-btn>
                <v-list>
                  <!-- <v-list-tile
                    key="download"
                    class="default-menu-item"
                    @click.native="openDownloadModal()"
                  >
                    <v-list-tile-title>
                      <img class="track-status-icon" src="/static/images/ic_share.png" />
                      <label>Download album</label>
                    </v-list-tile-title>
                  </v-list-tile> -->
                  <v-list-tile
                    key="share"
                    class="default-menu-item"
                    @click.native="openShareModal()"
                  >
                    <v-list-tile-title>
                      <!-- <img class="track-status-icon" src="/static/images/ic_share.png" /> -->
                      <label>Share</label>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile
                    key="collection"
                    class="default-menu-item"
                    @click.native="addToCollection()"
                  >
                    <v-list-tile-title>
                      <!-- <img class="track-status-icon" src="/static/images/ic_share.png" /> -->
                      <label>Add To Collection</label>
                    </v-list-tile-title>
                  </v-list-tile>

                  <v-list-tile
                    v-if="album.user.username === currentUser.username"
                    key="edit"
                    class="default-menu-item"
                    :to="{ name: 'UploadAlbum', params: { slug: album.slug } }"
                  >
                    <v-list-tile-title>
                      <label>Edit Album</label>
                    </v-list-tile-title>
                  </v-list-tile>
                  <!-- <v-list-tile key="flag" class="default-menu-item">
                    <v-list-tile-title>
                      <img class="track-status-icon" src="/static/images/ic_flag.png" />
                      <label>Flag</label>
                    </v-list-tile-title>
                  </v-list-tile> -->
                </v-list>
              </v-menu>
            </span>
          </div>
        </div>
      </div>

      <div class="album-tracks-section">
        <album-track-item
          v-for="(track, index) in album.tracks"
          :key="index"
          :album="album"
          :trackIndex="index"
          :showStats="showStats"
        ></album-track-item>
      </div>

      <v-flex
        xs12
        sm10
        offset-sm1
        v-if="false && currentUser"
      >
        <h4 class="comment-title">Talk to {{ album.user.username }}</h4>
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
              <!-- <div class="profile-image" :style="{'background-image': 'url(' + currentUser.user.avatar.thumb.url + ')'}"/></div> -->
              <input
                type="text"
                class="comment-input"
                name="comment_input"
                placeholder="Spark a conversation..."
                v-model="commentString"
                @keyup.enter="addComment()"
                @blur="blurMessage()"
                ref="comment"
              />
              <picker
                v-if="showEmojiPicker"
                title="Pick your emoji…"
                emoji="point_up"
                class="emoji-picker"
                @click="addEmoji"
              />
              <v-btn
                class="show-emoji-box-btn"
                :class="{ selected: showEmojiPicker }"
                @click.native="showEmojiDialog()"
              >
                <v-icon>tag_faces</v-icon>
              </v-btn>
            </div>
            <div class="comment-items" v-if="currentUser">
              <div
                class="comment-item"
                v-for="comment in comments"
                :key="comment.id"
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
                    <i
                      class="fa fa-eye"
                      v-if="comment.status == 'published'"
                    ></i>
                    <p
                      class="comment-text"
                      v-html="convertedHTML(comment.body)"
                    ></p>
                  </div>
                  <div class="right-section">
                    <v-menu
                      offset-y
                      class="comment-more-action"
                      v-if="currentnUser &&
                        currentUser.id == album.user.id ||
                        currentUser.id == comment.user.id
                      "
                    >
                      <v-btn dark class="more-btn" slot="activator">
                        <v-icon right>more_horiz</v-icon>
                      </v-btn>
                      <v-list>
                        <v-list-tile
                          key="public"
                          v-if="
                            currentUser.id == album.user.id &&
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
                            currentUser.id == album.user.id &&
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
                            currentUser.id == album.user.id &&
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
                            currentUser.id == album.user.id ||
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
                    <label class="comment-time">{{
                      toLocalTimeString(comment.created_at)
                    }}</label>
                  </div>
                </div>
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
    </v-flex>

    <v-container fluid grid-list-md px-0 pt-1>
      <v-layout wrap row justify-space-between class="secondary-album-details">
        <v-flex v-if="currentUser && album.products.length">
          <featuredProduct :product="album.products[0]" :recommendedBy="album.user.username" />
        </v-flex>

        <v-flex xs12 album-comment-page v-if="currentUser">
          <comments :item="album" :comments="comments" :commentTableType="commentTableType" />
        </v-flex>

        <v-flex xs12 album-recent-page white v-if="currentUser">
          <div class="album-reposted-section">
            <h4 class="__title">Recommended by <span class="text-capitalize">{{ album.user.username }}</span></h4>

            <hr class="my-3" />

            <v-layout row wrap class="recent-content">
              <div class="no-list" v-if="album.user.recent_items === null || album.user.recent_items.length < 1">
                No recommendations yet
              </div>
              <template v-else>
                <template v-for="(feed, index) in album.user.recent_items">
                  <div
                    v-if="
                      ['Album', 'ShopProduct', 'Stream'].indexOf(
                        feed.assoc_type
                      ) > -1
                    "
                    :key="feed.id"
                    class="card-container"
                  >
                    <track-card
                      :objects="album.user.recent_items"
                      :objectIndex="index"
                      hideTrackLength
                      hidePlayButton
                      v-if="feed.assoc_type == 'Album'"
                    />
                    <product-card
                      v-if="feed.assoc_type == 'ShopProduct'"
                      :dataObject="feed"
                      hideOptionCount
                    />
                    <video-card
                      v-if="feed.assoc_type == 'Stream'"
                      :dataObject="feed"
                    />
                  </div>
                </template>
              </template>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>
    </v-container>

    <div class="credits-dialog-wrapper">
      <v-dialog
        v-model="dialog"
        content-class="album-credits-dialog"
        scrollable
      >

      <div class="album-credit-main">
        <div class="album-title-main">
          <img src="../../assets/paper.svg" width="24">
          <h2 class="album-credit-head">Album Credits</h2>
        </div>

        <div class="album-main-body">
          <div class="album-img">
            <img src="../../assets/album-drop.gif" width="100%">
          </div>
          <div class="album-content">
            <div>
              <h3 class="album-name">Album Name</h3>
              <div class="artist-name">Artist Name</div>

              <div class="album-info mt-1">1 track  •  R&B / Soul   •  Uploaded 3 days ago</div>

            </div>


            <div class="mt-3">
              <div class="album-title-x">Released date</div>
              <div class="album-content-x">Jan 21, 1977</div>
            </div>

            <div class="mt-3">
              <div class="album-title-x">Credits</div>
              <div class="album-content-x">Artist name, Artist name, Artist name, Artist name, Artist name, Artist name, Artist name,
                Artist name, Artist name, Artist name, Artist name, Artist name, Artist name, Artist name</div>
            </div>

            <div class="mt-3">
              <div class="album-title-x">Location this album represents</div>
              <div class="album-content-x">Atlanta, Georgia, United States</div>
            </div>

             <div class="mt-3">
              <div class="album-title-x">About this album</div>
              <div class="album-content-x">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            </div>
          </div>
        </div>

      </div>
        <!-- <v-card class="album-dialog-body">
          <v-card-title>Album Credits</v-card-title>
          
          <v-card-text style="height: 300px">
            <v-flex xs12 sm12>
              <label class="album-info-label">Album Name: </label>
              <label class="album-info-text">{{ album.name }}</label>
            </v-flex>
            <v-flex xs12 sm12>
              <label class="album-info-label">Release Date: </label>
              <label class="album-info-text">{{
                album.released_at | formatDate
              }}</label>
            </v-flex>
            <v-flex xs12 sm12 v-if="album.location && album.location != ''">
              <label class="album-info-label">Location: </label>
              <label class="album-info-text">{{ album.location }}</label>
            </v-flex>
            <v-flex xs12 sm12>
              <label class="album-info-label">Genre: </label>
              <label class="album-info-text">{{ genres }}</label>
            </v-flex>
            <v-flex
              xs12
              sm12
              v-if="album.collaborators && album.collaborators.length > 0"
            >
              <label class="album-info-label">Collaborators: </label>
              <label class="album-info-text">
                <template v-for="c in album.collaborators">
                  <div class="collaborator-info" :key="`collaborator-${c.id}`">
                    <router-link class="user-name" :to="`/${c.user.slug}`">{{
                      c.user.username
                    }}</router-link>
                    <span> - {{ c.user_role }}</span>
                  </div>
                </template>
              </label>
            </v-flex>
            <v-flex xs12 sm12>
              <label class="album-info-label">Contributors: </label>
              <label class="album-info-text">
                <div class="contributor-info">
                  <router-link class="user-name" :to="`/${album.user.slug}`">{{
                    album.user.username
                  }}</router-link>
                  <span> - Uploader</span>
                </div>
              </label>
              <label
                class="album-info-text"
                v-if="currentUser && album.contributors && album.contributors.length > 0"
              >
                <template v-for="c in album.contributors">
                  <div class="contributor-info" :key="`contributor-${c.id}`">
                    <router-link class="user-name" :to="`/${c.user.slug}`">{{
                      c.user.username
                    }}</router-link>
                    <span> - {{ c.user_role }}</span>
                  </div>
                </template>
              </label>
            </v-flex>
            <v-flex
              xs12
              sm12
              v-if="currentUser && album.samplings && album.samplings.length > 0"
            >
              <label class="album-info-label">Samples: </label>
              <label
                class="album-info-text"
                v-if="album.samplings && album.samplings.length > 0"
              >
                <template v-for="s in album.samplings">
                  <div class="sampling-info" :key="`sampling-${s.id}`">
                    <label>{{ s.sampling_track.name }}</label
                    >:&nbsp;<router-link
                      class="user-name"
                      :to="`/${s.sample_user.slug}`"
                      >{{ s.sample_user.username }}</router-link
                    >
                    <span> - {{ s.sample_track.name }}</span>
                  </div>
                </template>
              </label>
            </v-flex>
            <v-flex xs12 sm12 v-if="currentUser && album.labels && album.labels.length > 0">
              <label class="album-info-label">Label: </label>
              <label class="album-info-text">
                <router-link
                  class="user-name"
                  :to="`/${album.labels[0].user.slug}`"
                  >{{ album.labels[0].user.username }}</router-link
                >
              </label>
            </v-flex>
            <v-flex xs12 sm12>
              <div class="album-info-label">About the album:</div>
              <label class="album-info-text">{{ album.description }}</label>
            </v-flex>
          </v-card-text>
        </v-card> -->
      </v-dialog>
    </div>

    <v-dialog
      v-model="show_sample_clearance_license_modal"
      content-class="my-dialog-1 large"
    >
      <sample-license-dialog :dismiss="closeSampleClearanceLicenseModal" />
    </v-dialog>

    <merch-modal
      v-if="showMerchModal"
      :item="album.products[0]"
      :dismiss="dimissMerchDialog"
    />

    <download-modal
      v-if="showDownloadModal"
      :item="album"
      :dismiss="dismissDownloadModal"
    />

    <promote-modal
      v-if="showPromoteMessage"
      :item="album"
      :dismiss="dismissPromoteModal"
      :success="saveAndFinish"
    />

    <album-finish-modal
      v-if="isShowFinishModal"
      :item="album"
      :promote="showPromoteModal"
      :dismiss="dismissFinishDialog"
    />

    <share-modal
      v-if="showShareModal"
      :item="album"
      :dismiss="closeShareModal"
    />
  </v-layout>
</template>

<script type="text/javascript" src="./album.ctrl.js"></script>
<style scoped src="../../../static/styles/album.scss" lang="scss"></style>