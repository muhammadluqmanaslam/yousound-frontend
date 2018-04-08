<template>
  <v-layout row wrap class="page album-detail-page" v-if="isPageReady">
    <canvas id="canvas" class="background-image"></canvas>
    <div id="back_image" class="background-overlay"></div>
    <merch-modal :item="album.products[0]" :dismiss="dimissMerchDialog" v-if="showMerchModal"></merch-modal>
    <download-modal :item="album" :dismiss="dismissDownloadModal" v-if="showDownloadModal"></download-modal>
    <promote-modal :item="album" :dismiss="dismissPromoteModal" :success="saveAndFinish" v-if="showPromoteMessage"></promote-modal>
    <album-finish-modal :item="album" :promote="showPromoteModal" :dismiss="dismissFinishDialog" v-if="isShowFinishModal"></album-finish-modal>
    <share-modal v-if="showShareModal" :item="album" :dismiss="closeShareModal"></share-modal>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 class="album-pages">
      <div class="album-info-page" id="album_info_page">
        <div class="album-image-section">
          <div class="album-image" :style="`background-image: url(${coverImageURL})`"></div>
          <div class="album-hover-section">
            <div class="play-button-section">
              <v-btn dark class="play-button" @click.native="playSong()" v-if="!isPlaying || $store.state.player.isPaused">
                <v-icon class="play">play_arrow</v-icon>
              </v-btn>
              <v-btn dark class="play-button" @click.native="pauseSong()" v-if="isPlaying && !$store.state.player.isPaused">
                <v-icon class="pause">pause</v-icon>
              </v-btn>
            </div>
            <!-- <v-btn class="credit-button">View album credits</v-btn> -->
            <div class="credits-dialog-wrapper">
              <v-dialog v-model="dialog" class="album-credits-dialog" scrollable max-width="600px">
                <v-btn color="primary" dark slot="activator" class="text-btn">View album credits</v-btn>
                <v-card class="album-dialog-body">
                  <v-card-title>Album Credits</v-card-title>
                  <v-btn class="dialog-close-btn" @click.native="dialog=false"><v-icon>highlight_off</v-icon></v-btn>
                  <v-card-text style="height: 300px;">
                    <v-flex xs12 sm12>
                      <label class="album-info-label">Album Name: </label>
                      <label class="album-info-text">{{ album.name }}</label>
                    </v-flex>
                    <v-flex xs12 sm12>
                      <label class="album-info-label">Release Date: </label>
                      <label class="album-info-text">{{ album.released_at | formatDate }}</label>
                    </v-flex>
                    <v-flex xs12 sm12>
                      <label class="album-info-label">Genre: </label>
                      <label class="album-info-text">{{ genres }}</label>
                    </v-flex>
                    <v-flex xs12 sm12 v-if="album.collaborators && album.collaborators.length > 0">
                      <label class="album-info-label">Collaborators: </label>
                      <label class="album-info-text">
                        <template v-for="c in album.collaborators">
                          <div class="collaborator-info">
                            <router-link class="user-name" :to="`/${c.user.slug}`">{{ c.user.display_name }}</router-link> - {{ c.user_role }}</div>
                        </template>
                      </label>
                    </v-flex>
                    <v-flex xs12 sm12 v-if="album.contributors && album.contributors.length > 0">
                      <label class="album-info-label">Contributors: </label>
                      <label class="album-info-text">
                        <template v-for="c in album.contributors">
                          <div class="contributor-info">
                            <router-link class="user-name" :to="`/${c.user.slug}`">{{ c.user.display_name }}</router-link> - {{ c.user_role }}</div>
                        </template>
                      </label>
                    </v-flex>
                    <v-flex xs12 sm12 v-if="album.labels && album.labels.length > 0">
                      <label class="album-info-label">Label: </label>
                      <label class="album-info-text">
                        <router-link class="user-name" :to="`/${album.labels[0].user.slug}`">{{ album.labels[0].user.display_name }}</router-link>
                      </label>
                    </v-flex>
                    <v-flex xs12 sm12>
                      <div class="album-info-label">About the album: </div>
                      <label class="album-info-text">{{ album.description }}</label>
                    </v-flex>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </div>
          </div>
          <div class="album-merch-section" v-if="album.products.length">
            <h3 class="title">Artist Merch</h3>
            <div class="merch-detail-section" @click.self="showMerchDialog()">
              <div class="merch-avatar" :style="`background-image: url(${album.products[0].covers[0].cover.thumb.url})`" @click.self="showMerchDialog()"></div>
              <div class="info-section" @click.self="showMerchDialog()">
                <label class="merch-name" @click.self="showMerchDialog()">{{ album.products[0].name }}</label>
                <label class="merch-price" @click.self="showMerchDialog()">${{ album.products[0].price | formatNumber }}</label>
                <label class="link-btn" @click="goToArtistProfile()">View all artists merch</label>
              </div>
            </div>
          </div> 
        </div> 
        <div class="album-detail-section">
          <div class="album-info-section">
            <label class="album-title">{{ album.album_type }}</label>
            <h4 class="album-name">{{ album.name }}</h4>
            <!-- <div>
              <v-dialog v-model="dialog" class="album-credits-dialog" scrollable max-width="600px">
                <v-btn color="primary" dark slot="activator" class="text-btn">View album credits</v-btn>
                <v-card class="album-dialog-body">
                  <v-card-title>Album Credits</v-card-title>
                  <v-btn class="dialog-close-btn" @click.native="dialog=false"><v-icon>highlight_off</v-icon></v-btn>
                  <v-card-text style="height: 300px;">
                    <v-flex xs12 sm12>
                      <label class="album-info-label">Album Name: </label>
                      <label class="album-info-text">{{ album.name }}</label>
                    </v-flex>
                    <v-flex xs12 sm12>
                      <label class="album-info-label">Release Date: </label>
                      <label class="album-info-text">{{ album.released_at | formatDate }}</label>
                    </v-flex>
                    <v-flex xs12 sm12>
                      <label class="album-info-label">Genre: </label>
                      <label class="album-info-text">{{ genres }}</label>
                    </v-flex>
                    <v-flex xs12 sm12 v-if="album.collaborators && album.collaborators.length > 0">
                      <label class="album-info-label">Collaborators: </label>
                      <label class="album-info-text">
                        <template v-for="c in album.collaborators">
                          <div class="collaborator-info">
                            <router-link class="user-name" :to="`/${c.user.slug}`">{{ c.user.display_name }}</router-link> - {{ c.user_role }}</div>
                        </template>
                      </label>
                    </v-flex>
                    <v-flex xs12 sm12 v-if="album.contributors && album.contributors.length > 0">
                      <label class="album-info-label">Contributors: </label>
                      <label class="album-info-text">
                        <template v-for="c in album.contributors">
                          <div class="contributor-info">
                            <router-link class="user-name" :to="`/${c.user.slug}`">{{ c.user.display_name }}</router-link> - {{ c.user_role }}</div>
                        </template>
                      </label>
                    </v-flex>
                    <v-flex xs12 sm12 v-if="album.labels && album.labels.length > 0">
                      <label class="album-info-label">Label: </label>
                      <label class="album-info-text">
                        <router-link class="user-name" :to="`/${album.labels[0].user.slug}`">{{ album.labels[0].user.display_name }}</router-link>
                      </label>
                    </v-flex>
                    <v-flex xs12 sm12>
                      <div class="album-info-label">About the album: </div>
                      <label class="album-info-text">{{ album.description }}</label>
                    </v-flex>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </div> -->
            <div class="album-detail">
              by <router-link :to="'/' + album.user.slug" class="album-detail">{{ album.user.display_name }}</router-link>
              <template v-for="collaborator in album.collaborators">
                , <router-link :to="'/' + collaborator.user.slug" class="album-detail">{{ collaborator.user.display_name }}</router-link>
              </template> •  2017 <label class="album-stats-btn" @click="goToAlbumStats('playedby')" v-if="showStats">View Stats</label>
              <!-- <div class="album-stats" v-if="showStats">
                <v-btn class="action-btn" @click.native="goToAlbumStats('playedby')">
                  <v-icon>play_arrow</v-icon>{{ album.played }}</v-btn>
                <v-btn class="action-btn" @click.native="goToAlbumStats('downloadedby')">
                  <img src="/static/images/ic_repost_trans.png" />{{ album.downloaded }}</v-btn>
                <v-btn class="action-btn" @click.native="goToAlbumStats('repostedby')">
                  <img src="/static/images/ic_repeat_trans.png" />{{ album.reposted }}</v-btn>
              </div> -->
            </div>
            <div class="album-action-section">
              <template v-if="$store.state.auth.user && album.user.id != $store.state.auth.user.id">
                <v-btn v-if="album.collaborators_count == 0"
                  :class="{ 'follow-btn': true, 'follow': false, 'following': true }"
                  @mouseenter="buttonHover = true"
                  @mouseleave="buttonHover = false"
                  @click.native="followUser(album.user)">{{ followButtonText }}</v-btn>
                <v-menu v-else
                  id="follow_selector"
                  left down
                  offset-y
                  :nudge-top="-5">
                  <v-btn dark slot="activator">Follow All
                    <v-icon dark right>keyboard_arrow_down</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile class="GLOBAL-album-collaborators-follow-item" avatar>
                      <v-list-tile-avatar>
                        <img :src="album.user.avatar.thumb.url"/>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        {{ album.user.display_name }}
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <template v-if="album.user.is_following">
                          <v-chip label outline color="red" @click.native="followUser(album.user)">Unfollow</v-chip>
                        </template>
                        <template v-else-if="album.user.id != $store.state.auth.user.id">
                          <v-chip label outline color="teal" @click.native="followUser(album.user)">Follow</v-chip>
                        </template>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile v-for="collaborator in album.collaborators"
                      :key="collaborator.user.id" class="GLOBAL-album-collaborators-follow-item" avatar>
                      <v-list-tile-avatar>
                        <img :src="collaborator.user.avatar.thumb.url"/>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        {{ collaborator.user.display_name }}
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <template v-if="collaborator.user.is_following">
                          <v-chip label outline color="red" @click.native="followUser(collaborator.user)">Unfollow</v-chip>
                        </template>
                        <template v-else-if="collaborator.user.id != $store.state.auth.user.id">
                          <v-chip label outline color="teal" @click.native="followUser(collaborator.user)">Follow</v-chip>
                        </template>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </template>

              <v-menu offset-y class="more-menu">
                <v-btn dark class="more-btn" slot="activator">
                  <v-icon right>more_horiz</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile key="download" class="default-menu-item" @click.native="openDownloadModal()">
                    <v-list-tile-title>
                      <!-- <img class="track-status-icon" src="/static/images/ic_share.png" /> -->
                      <label>Download album</label>
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile key="share" class="default-menu-item" @click.native="openShareModal()">
                    <v-list-tile-title>
                      <!-- <img class="track-status-icon" src="/static/images/ic_share.png" /> -->
                      <label>Share</label>
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile key="flag" class="default-menu-item">
                    <v-list-tile-title>
                      <!-- <img class="track-status-icon" src="/static/images/ic_flag.png" /> -->
                      <label>Flag</label>
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>
          </div>
          <div class="album-tracks-section">
            <album-track-item v-for="(track, index) in album.tracks"
              :key="index"
              :album="album"
              :trackIndex="index"
              :showStats="showStats"></album-track-item>
          </div>
        </div>
      </div>

      <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 album-comment-page v-if="$store.state.auth.user">
        <h4 class="comment-title">Talk to {{ album.user.display_name }}</h4>
        <label class="description">Comments are only seen by the artist and people you @mention, unless artist makes your comment public.</label>
        <div class="comments-section">
          <div class="tab-section">
            <div class="comment-tab">
              <label class="comment-count">{{ commentsCount }} Comments</label>
            </div>
          </div>
          <div class="content-section">
            <div class="add-comment-section">
              <img class="profile-image" :src="$store.state.auth.user.avatar.thumb.url" />
              <!-- <div class="profile-image" :style="{'background-image': 'url(' + $store.state.auth.user.avatar.thumb.url + ')'}"/></div> -->
              <input 
                type="text" 
                class="comment-input" 
                name="comment_input" 
                placeholder="Spark a conversation..." 
                v-model="commentString" 
                @keyup.enter="addComments()"
                @blur="blurMessage()"
                ref="comment"/>
              <picker v-if="showEmojiPicker"
                title="Pick your emoji…"
                emoji="point_up"
                class="emoji-picker"
                @click="addEmoji"></picker>
              <v-btn 
                class="show-emoji-box-btn" 
                :class="{'selected': showEmojiPicker}"
                @click.native="showEmojiDialog()">
                <v-icon>tag_faces</v-icon>
              </v-btn>
            </div>
            <div class="comment-items">
              <div class="comment-item" v-for="(comment, index) in comments" :key="index">
                <div class="comment-parent-item">
                  <!-- <img class="profile-image" src="/static/images/user1.jpg" /> -->
                  <profile-item :user="comment.user" :className="'comment-user-avatar'"></profile-item>
                  <div class="comment-content relative">
                    <router-link :to="'/' + comment.user.slug"><label class="user-name">{{ comment.user.display_name }} <v-icon class="user-status online" v-if="comment.user.user_type=='artist'">fa-check-circle</v-icon></label></router-link>
                    <i class="fa fa-wifi" v-if="comment.status=='published'"></i>
                    <!-- <p class="comment-text">{{ comment.body }}</p> -->
                    <p class="comment-text" v-html="convertedHTML(comment.body)"></p>
                  </div>
                  <div class="right-section">
                    <v-menu offset-y class="comment-more-action" v-if="$store.state.auth.user.id==album.user.id || $store.state.auth.user.id==comment.user.id">
                      <v-btn dark class="more-btn" slot="activator">
                        <v-icon right>more_horiz</v-icon>
                      </v-btn>
                      <v-list>
                        <v-list-tile key="public" v-if="$store.state.auth.user.id==album.user.id" @click.native="makePublicComment(comment)">
                          <v-list-tile-title class="default-menu-item">
                            <img class="track-status-icon" src="/static/images/ic_comment_public.png" />
                            <label>Make Public</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile key="block" v-if="$store.state.auth.user.id==album.user.id && $store.state.auth.user.id!=comment.user.id" @click.native="blockUser(comment)">
                          <v-list-tile-title class="default-menu-item">
                            <img class="track-status-icon" src="/static/images/ic_comment_flag.png" />
                            <label>Block User</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile key="delete" v-if="$store.state.auth.user.id==album.user.id || $store.state.auth.user.id==comment.user.id" @click.native="deleteComment(comment)">
                          <v-list-tile-title class="default-menu-item">
                            <img class="track-status-icon" src="/static/images/ic_comment_delete.png" />
                            <label>Delete Comment</label>
                          </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                    <label class="comment-time">Now</label>
                  </div>
                </div>
                <div class="child-items" v-if="false">
                  <div class="comment-child-item">
                    <img class="profile-image" src="/static/images/sample_user.png" />
                    <div class="comment-content relative">
                      <label class="user-name">Ruckazoid <v-icon class="user-status online">fa-check-circle</v-icon></label>
                      <p class="comment-text">You da man! Thanks bro.</p>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-flex>
    </v-flex>
    <v-footer>
      <a href="#">FAQ</a>
      <a href="#">Blog</a>
      <a href="#">Help</a>
      <a href="#">Terms</a>
      <a href="#">Contact</a>
      <div class="copyright">© {{ new Date().getFullYear() }} YouSound, Inc.</div>
    </v-footer>
  </v-layout>
</template>
<script type="text/javascript" src="./album.ctrl.js"></script>

