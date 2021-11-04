<template>
  <v-layout v-if="isPageReady" row wrap class="page album-detail-page">

    <v-flex xs12 class="album-pages" v-if="isPageReady">
      <canvas id="canvas" class="background-image"></canvas>
      <div id="back_image" class="background-overlay"></div>
      <div class="album-info-page" id="album_info_page">
        <div class="album-image-section">
          <div
            class="album-image"
            :style="`background-image: url(${coverImageURL})`"
          >
          </div>
          <div class="meta-details">
            <span class="album-plays">{{ album.played.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} plays</span>
            <span class="mx-2">&bull;</span>
            <span class="cursor-pointer" @click="dialog = true">Album Credits</span>
          </div>
        </div>
        <div class="album-detail-section">
          <div class="album-info-section">
            <label class="album-title">{{ album.album_type }}</label>
            <h4 class="album-name">{{ album.name }}</h4>
            <div class="album-detail">
              by
              <router-link :to="'/' + album.user.slug" class="album-detail">{{
                album.user.display_name
              }}</router-link>
              <template v-for="collaborator in album.collaborators">
                <div :key="`${collaborator.id}`" class="d-inline-block">
                  <span>,</span>
                  <router-link
                    :to="'/' + collaborator.user.slug"
                    class="album-detail"
                    >{{ collaborator.user.display_name }}</router-link
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
              <template v-if="currentUser && album.user.id != currentUser.id">
                <!-- <v-btn
                  v-if="album.collaborators_count == 0"
                  :class="{
                    'follow-btn': true,
                    follow: !album.user.is_following,
                    following: album.user.is_following,
                  }"
                  @mouseenter="buttonHover = true"
                  @mouseleave="buttonHover = false"
                  @click.native="followUser(album.user)"
                  >{{ followButtonText }}</v-btn
                >
                <v-menu
                  v-else
                  id="follow_selector"
                  left
                  down
                  offset-y
                  :nudge-top="-5"
                >
                  <v-btn dark slot="activator"
                    >Follow All
                    <v-icon dark right>keyboard_arrow_down</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile
                      class="GLOBAL-album-collaborators-follow-item"
                      avatar
                    >
                      <v-list-tile-avatar>
                        <img :src="album.user.avatar.thumb.url" />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        {{ album.user.display_name }}
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <template v-if="album.user.is_following">
                          <v-chip
                            label
                            outline
                            color="red"
                            @click.native="followUser(album.user)"
                            >Unfollow</v-chip
                          >
                        </template>
                        <template v-else-if="album.user.id != currentUser.id">
                          <v-chip
                            label
                            outline
                            color="teal"
                            @click.native="followUser(album.user)"
                            >Follow</v-chip
                          >
                        </template>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile
                      v-for="collaborator in album.collaborators"
                      :key="collaborator.user.id"
                      class="GLOBAL-album-collaborators-follow-item"
                      avatar
                    >
                      <v-list-tile-avatar>
                        <img :src="collaborator.user.avatar.thumb.url" />
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        {{ collaborator.user.display_name }}
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <template v-if="collaborator.user.is_following">
                          <v-chip
                            label
                            outline
                            color="red"
                            @click.native="followUser(collaborator.user)"
                            >Unfollow</v-chip
                          >
                        </template>
                        <template
                          v-else-if="collaborator.user.id != currentUser.id"
                        >
                          <v-chip
                            label
                            outline
                            color="teal"
                            @click.native="followUser(collaborator.user)"
                            >Follow</v-chip
                          >
                        </template>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                </v-menu> -->
              </template>

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
        album-comment-page
        v-if="false && currentUser"
      >
        <h4 class="comment-title">Talk to {{ album.user.display_name }}</h4>
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
            <div class="comment-items">
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
                        >{{ comment.user.display_name }}
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
                      v-if="
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

    <v-layout class="secondary-album-details">
      <v-flex xs8 album-comment-page v-if="currentUser">
        <h1>Comment Feature</h1>

        <comments :item="album" :comments="comments" />
      </v-flex>

      <v-flex xs4 album-recent-page v-if="currentUser">
        <div class="album-merch-section" v-if="album.products.length">
          <div class="d-flex justify-space-between">
            <h4 class="__title flex-none">
              Shop {{ album.user.display_name }}
            </h4>
            <label class="link-btn flex-none" @click="goToArtistProfile()">
              View All
            </label>
          </div>
          <div class="merch-detail-section" @click.self="showMerchDialog()">
            <div
              class="merch-avatar"
              :style="`background-image: url(${album.products[0].covers[0].cover.thumb.url})`"
              @click.self="showMerchDialog()"
            ></div>
            <div class="info-section" @click.self="showMerchDialog()">
              <label class="product-name" @click.self="showMerchDialog()">{{
                album.products[0].name
              }}</label>

              <br>

              <label class="merch-name" @click.self="showMerchDialog()">
                {{ album.products[0].merchant.display_name }}
              </label>


              <div class="flex-space-between">
                <label class="merch-price" @click.self="showMerchDialog()">
                  ${{ album.products[0].price | formatNumber }}
                </label>
                <div>
                  <img class="merch-status-icon" src="/static/images/ic_share.svg" />
                  <img class="merch-status-icon" src="/static/images/ic_repost.svg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="album-reposted-section">
          <h4 class="__title">
            Reposted by {{ album.user.display_name }}
          </h4>
          <v-layout row wrap class="recent-content">
            <template v-for="(feed, index) in album.user.recent_items">
              <div
                v-if="
                  ['Album', 'ShopProduct', 'Stream'].indexOf(feed.assoc_type) > -1
                "
                :key="feed.id"
                class="card-container"
              >
                <track-card
                  :objects="album.user.recent_items"
                  :objectIndex="index"
                  v-if="feed.assoc_type == 'Album'"
                />
                <product-card
                  :dataObject="feed"
                  v-if="feed.assoc_type == 'ShopProduct'"
                />
                <video-card
                  :dataObject="feed"
                  v-if="feed.assoc_type == 'Stream'"
                />
              </div>
            </template>
          </v-layout>
        </div>
      </v-flex>

    </v-layout>

    <div class="credits-dialog-wrapper">
      <v-dialog
        v-model="dialog"
        class="album-credits-dialog"
        scrollable
        max-width="600px"
      >
        <v-card class="album-dialog-body">
          <v-card-title>Album Credits</v-card-title>
          <v-btn class="dialog-close-btn" @click.native="dialog = false"
            ><v-icon>highlight_off</v-icon></v-btn
          >
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
            <v-flex
              xs12
              sm12
              v-if="album.location && album.location != ''"
            >
              <label class="album-info-label">Location: </label>
              <label class="album-info-text">{{
                album.location
              }}</label>
            </v-flex>
            <v-flex xs12 sm12>
              <label class="album-info-label">Genre: </label>
              <label class="album-info-text">{{ genres }}</label>
            </v-flex>
            <v-flex
              xs12
              sm12
              v-if="
                album.collaborators && album.collaborators.length > 0
              "
            >
              <label class="album-info-label">Collaborators: </label>
              <label class="album-info-text">
                <template v-for="c in album.collaborators">
                  <div
                    class="collaborator-info"
                    :key="`collaborator-${c.id}`"
                  >
                    <router-link
                      class="user-name"
                      :to="`/${c.user.slug}`"
                      >{{ c.user.display_name }}</router-link
                    >
                    <span> - {{ c.user_role }}</span>
                  </div>
                </template>
              </label>
            </v-flex>
            <v-flex xs12 sm12>
              <label class="album-info-label">Contributors: </label>
              <label class="album-info-text">
                <div class="contributor-info">
                  <router-link
                    class="user-name"
                    :to="`/${album.user.slug}`"
                    >{{ album.user.display_name }}</router-link
                  >
                  <span> - Uploader</span>
                </div>
              </label>
              <label
                class="album-info-text"
                v-if="
                  album.contributors && album.contributors.length > 0
                "
              >
                <template v-for="c in album.contributors">
                  <div
                    class="contributor-info"
                    :key="`contributor-${c.id}`"
                  >
                    <router-link
                      class="user-name"
                      :to="`/${c.user.slug}`"
                      >{{ c.user.display_name }}</router-link
                    >
                    <span> - {{ c.user_role }}</span>
                  </div>
                </template>
              </label>
            </v-flex>
            <v-flex
              xs12
              sm12
              v-if="album.samplings && album.samplings.length > 0"
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
                      >{{ s.sample_user.display_name }}</router-link
                    >
                    <span> - {{ s.sample_track.name }}</span>
                  </div>
                </template>
              </label>
            </v-flex>
            <v-flex
              xs12
              sm12
              v-if="album.labels && album.labels.length > 0"
            >
              <label class="album-info-label">Label: </label>
              <label class="album-info-text">
                <router-link
                  class="user-name"
                  :to="`/${album.labels[0].user.slug}`"
                  >{{ album.labels[0].user.display_name }}</router-link
                >
              </label>
            </v-flex>
            <v-flex xs12 sm12>
              <div class="album-info-label">About the album:</div>
              <label class="album-info-text">{{
                album.description
              }}</label>
            </v-flex>
          </v-card-text>
        </v-card>
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
