<template>
  <div v-scroll="handleScroll">
    <div class="page profile-grid-page mx-5" :class="{onMobile}">
      <content-top-header>
        <template slot="topHeader">
          <div class="user-profile-image-wrapper">
            <div
              class="user-profile-image"
              :style="{
                'background-image': 'url(' + user.avatar.url + ')',
              }"
            ></div>
            <label>{{ user.username }}'s</label>
          </div>
          <ul class="width100">
            <template v-for="tab in tabs">
              <li
                v-if="isAvailableForGridView(tab)"
                v-show="['followings', 'followers'].indexOf(tab.id) == -1"
                :key="tab.id"
                :href="`#${tab.id}`"
                class="nav-li"
                :class="[{ active: isActiveTab(tab.id) }, `nav-${tab.id}`]"
              >
                <label class="nav-label"  @click="onTab(tab.id)">
                  <img :src="tab.icon" width="18" class="li-icon">
                  {{ tab.title }}
                </label>
              </li>
            </template>
          </ul>
        </template>
      </content-top-header>

      <div class="page-content">
        <div v-if="user" class="user-profile-section">
          <div
            class="user-profile-image-section"
            :class="{ live: show_stream_live_button }"
            @click="
              show_stream_live_button && !view_stream_clicked && viewStream()
            "
          >
            <div
              class="user-profile-image"
              :style="{
                'background-image': 'url(' + user.avatar.url + ')',
              }"
            ></div>

            <div v-if="followMetaVisible && onMobile" class="user-status-section mt-2">
              <label @click="onTab('followings')" class="follower-count">
                <strong class="_count">{{ user.followings | formatLargeNumber }}</strong> 
                <div class="_label">Following</div>
              </label>
              <label class="vertical-divider"></label>
              <label @click="onTab('followers')" class="follower-count">
                <strong class="_count">{{ user.followers | formatLargeNumber }}</strong> 
                <div class="_label">Followers</div>
              </label>
            </div>

            <div class="live-btn">Live</div>
          </div>

          <div class="user-info-section">
            <div class="user-name-section">
              <label class="display-name">
                {{ user.username }}
                <v-icon
                  v-if="
                    ['artist', 'label', 'brand'].indexOf(user.user_type) > -1
                  "
                  class="user-status online"
                  >fa-check-circle</v-icon
                >
              </label>
              <span class="user-role">{{ user.user_type }}</span>
            </div>
            <div v-if="followMetaVisible && !onMobile" class="user-status-section mt-2">
              <label @click="onTab('followings')" class="follower-count"
                ><strong class="_count">{{ user.followings }}</strong> Following</label
              >
              <label class="vertical-divider"></label>
              <label @click="onTab('followers')" class="follower-count"
                ><strong class="_count">{{ user.followers }}</strong> Followers</label
              >
              <template v-if="user.user_type === 'listener' && user.inviter">
                <label class="vertical-divider"></label>
                <label class="user-inviter-name">
                  Invited by
                  <router-link :to="`/${user.inviter.slug}`">{{
                    user.inviter.username
                  }}</router-link>
                </label>
              </template>
            </div>
            <div class="user-action-section">
              <template v-if="user.user_type === 'listener'">
                <v-btn
                  v-if="
                    currentUser &&
                    ['listener'].indexOf(currentUser.user_type) == -1 &&
                    !user.inviter &&
                    user.request_status === 'pending'
                  "
                  @click.native="openInviteConfirmDialog()"
                  class="invite-btn ml-0"
                  :class="{'mb-3': onMobile}"
                  >Invite</v-btn
                >
              </template>

              <v-btn v-else @click.native="playSong()" class="play-btn">
                <v-icon>play_arrow</v-icon>
                <span>Play</span>
              </v-btn>

              <div
                v-if="
                  currentUser &&
                  user.id != currentUser.id &&
                  user.username != PublicRelationsUsername
                "
                class="__top_actions"
              >
                <user-follow-btn
                  :user="user"
                  theme="dark"
                  type="default"
                />

                <v-btn
                  depressed
                  outline
                  class="message-btn no-Btn-bg sqr-plain-btn"
                  @click="showMessageDialog()"
                >
                  <div class="default-menu-item">
                    <label>Message</label>
                  </div>
                </v-btn>

                <v-btn v-if="currentUser && currentUser.creator_verified && user.stripe_connected &&
                  user.creator_verified && user.id != currentUser.id"
                  depressed
                  outline
                  class="donate-btn no-Btn-bg sqr-plain-btn"
                  key="send_love"
                  @click="showLoveDialog()"
                >
                  <div class="default-menu-item">
                    <label>Donate</label>
                  </div>
                </v-btn>

                <v-menu
                  v-if="
                    currentUser &&
                    user.id != currentUser.id &&
                    user.username != PublicRelationsUsername
                  "
                  offset-y
                  class="more-menu"
                >
                  <v-btn dark class="more-btn" slot="activator">
                    <v-icon right>more_horiz</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile
                      key="view_direct_messages"
                      @click="viewDirectMessages()"
                      v-if="enabledViewDirectMessage"
                    >
                      <v-list-tile-title class="default-menu-item">
                        <label>View Direct Messages</label>
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile
                      v-if="
                        currentUser &&
                        currentUser.creator_verified &&
                        user.id != currentUser.id &&
                        user.stripe_connected && user.creator_verified
                      "
                      key="send_love"
                      @click="showLoveDialog()"
                    >
                      <v-list-tile-title class="default-menu-item">
                        <label>Donate</label>
                      </v-list-tile-title>
                    </v-list-tile>
                    <!-- <v-list-tile key="chat" @click="goToChat()">
                      <v-list-tile-title class="default-menu-item">
                        <label>Chat</label>
                      </v-list-tile-title>
                    </v-list-tile> -->
                    <v-list-tile @click="flagUser()">
                      <v-list-tile-title class="default-menu-item">
                        <label>Flag</label>
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile
                      key="block"
                      @click="openBlockUserConfirmDialog()"
                    >
                      <v-list-tile-title class="default-menu-item">
                        <label>Block</label>
                      </v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>
        </div>

        <div v-if="active_tab == 'followings' || active_tab == 'followers'">
          <div v-if="!users || users.length == 0" class="empty-section">
            <p class="empty-title">Profile is Empty</p>
            <p class="empty-description">It’s a little lonely in here...</p>
            <router-link
              v-if="currentUser && user.id == currentUser.id"
              to="/album"
              class="empty-discover-btn"
              >Discover</router-link
            >
          </div>

          <v-layout row wrap class="covers-content" v-else>
            <v-flex
              xs12
              sm2
              class="card-container"
              v-for="(user, index) in users"
              :key="index"
            >
              <artist-item :artist="user" :key="index"></artist-item>
            </v-flex>
          </v-layout>
          <v-btn
            v-show="page_index < total_pages"
            @click.native="getItems(active_tab, true)"
            class="loadmore-btn"
            >Load More</v-btn
          >
        </div>

        <div v-else-if="active_tab == 'artists'">
          <template v-if="!users || users.length == 0">
            <template v-if="currentUser && currentUser.id == user.id">
              <div class="empty-section">
                <p class="empty-title">Empty</p>
                <p class="empty-description">You have not added any user</p>
              </div>
            </template>
            <template v-else>
              <div class="empty-section">
                <p class="empty-title">Empty</p>
                <p class="empty-description">
                  This user has not added any user
                </p>
              </div>
            </template>
          </template>

          <v-layout row wrap class="covers-content" v-else>
            <v-flex
              xs12
              sm2
              class="card-container"
              v-for="(user, index) in users"
              :key="index"
            >
              <artist-item :artist="user" :key="index"></artist-item>
            </v-flex>
          </v-layout>
          <v-btn
            v-show="page_index < total_pages"
            @click.native="getItems(active_tab, true)"
            class="loadmore-btn"
            >Load More</v-btn
          >
        </div>

        <div v-else-if="active_tab == 'merch'">
          <template v-if="!products || products.length == 0">
            <template v-if="currentUser && currentUser.id == user.id">
              <div v-if="currentUser.creator_verified" class="empty-section">
                <p class="empty-title">Empty</p>
                <p class="empty-description">
                  You have not uploaded any products
                </p>
                <router-link to="/product/add" class="empty-discover-btn"
                  >Upload</router-link
                >
              </div>
            </template>
            <template v-else>
              <div class="empty-section">
                <p class="empty-title">Empty</p>
                <p class="empty-description">This user has no products</p>
              </div>
            </template>
          </template>

          <v-layout row wrap class="covers-content" v-else>
            <v-flex
              xs12
              sm4
              class="card-container"
              v-for="(product, index) in products"
              :key="index"
            >
              <product-card :dataObject="product"></product-card>
            </v-flex>
          </v-layout>
          <v-btn
            v-show="page_index < total_pages"
            @click.native="getItems(active_tab, true)"
            class="loadmore-btn"
            >Load More</v-btn
          >
        </div>

        <!-- <div v-else-if="active_tab == 'reposted'">
          <v-layout row wrap class="covers-content">
            <div class="card-container flex custom-lg5" v-for="(feed, index) in feeds" :key="index" v-else-if="feed.assoc_type=='Album' || feed.assoc_type=='ShopProduct'">
              <track-card :objects="user.recent_items" :objectIndex="index" v-if="feed.assoc_type=='Album'"></track-card>
              <product-card :dataObject="feed" v-if="feed.assoc_type=='ShopProduct'"></product-card>
            </div>
          </v-layout>
        </div> -->

        <div v-else-if="active_tab == 'video'">
          <v-layout row wrap>
            <v-flex
              xs3
              v-for="video in ownVideos"
              :key="video.name"
              class="card-container"
            >
              <video-box :hoverOverlay="false" :item="video" />
            </v-flex>
          </v-layout>
        </div>

        <v-container fluid grid-list-md px-0 v-else>
          <template v-if="!albums || albums.length == 0">
            <template v-if="active_tab == 'songs'">
              <template v-if="currentUser && currentUser.id == user.id">
                <div v-if="currentUser.creator_verified" class="empty-section">
                  <p class="empty-title">Empty</p>
                  <p class="empty-description">You have no uploaded albums</p>
                  <router-link to="/upload/album" class="empty-discover-btn"
                    >Upload</router-link
                  >
                </div>
              </template>
              <template v-else>
                <div class="empty-section">
                  <p class="empty-title">Empty</p>
                  <p class="empty-description">
                    This user has no uploaded albums
                  </p>
                </div>
              </template>
            </template>
            <template v-else-if="active_tab == 'downloaded'">
              <template v-if="currentUser && currentUser.id == user.id">
                <div class="empty-section">
                  <p class="empty-title">Empty</p>
                  <p class="empty-description">
                    You have no downloaded albums
                  </p>
                  <router-link to="/album" class="empty-discover-btn"
                    >Discover</router-link
                  >
                </div>
              </template>
              <template v-else>
                <div class="empty-section">
                  <p class="empty-title">Empty</p>
                  <p class="empty-description">
                    This user has not downloaded any albums
                  </p>
                </div>
              </template>
            </template>
            <template v-else-if="active_tab == 'reposted'">
              <template v-if="currentUser && currentUser.id == user.id">
                <div class="empty-section">
                  <p class="empty-title">Empty</p>
                  <p class="empty-description">You have no reposts</p>
                  <router-link to="/album" class="empty-discover-btn"
                    >Discover</router-link
                  >
                </div>
              </template>
              <template v-else>
                <div class="empty-section">
                  <p class="empty-title">Empty</p>
                  <p class="empty-description">This user has no reposts</p>
                </div>
              </template>
            </template>
            <!-- <template v-else-if="active_tab == 'playlists'">
              <template v-if="currentUser && currentUser.id == user.id">
                <div class="empty-section">
                  <p class="empty-title">Empty</p>
                  <p class="empty-description">You have no playlists</p>
                  <router-link to="/album" class="empty-discover-btn">Discover</router-link>
                </div>
              </template>
              <template v-else>
                <div class="empty-section">
                  <p class="empty-title">Empty</p>
                  <p class="empty-description">This user has no playlists</p>
                </div>
              </template>
            </template> -->
            <template v-else-if="active_tab == 'catalog'">
              <template v-if="currentUser && currentUser.id == user.id">
                <div class="empty-section">
                  <p class="empty-title">Empty</p>
                  <p class="empty-description">You have no catalog</p>
                </div>
              </template>
              <template v-else>
                <div class="empty-section">
                  <p class="empty-title">Empty</p>
                  <p class="empty-description">This user has no catalog</p>
                </div>
              </template>
            </template>
          </template>

          <v-layout row wrap class="covers-content" v-else>
            <v-flex
              xs6
              class="custom-lg5"
              v-for="(feed, index) in albums"
              :key="index"
            >
              <track-card :objects="albums" :objectIndex="index"></track-card>
            </v-flex>
          </v-layout>
          <v-btn
            v-show="page_index < total_pages"
            class="loadmore-btn"
            @click.native="getItems(active_tab, true)"
            >Load More</v-btn
          >
        </v-container>
      </div>
    </div>

    <send-message
      v-if="showSendMessage"
      :receiver="user"
      :dismiss="dismissMessageModal"
    />

    <send-love-modal
      v-if="showSendLoveModal"
      :item="user"
      :dismiss="dismissLoveDialog"
    />

    <v-dialog v-model="show_block_user_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Block a User</v-card-title>
        <v-card-text>Are you sure you want to block this?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="red--text darken-1"
            flat="flat"
            @click.native="blockUser()"
            >Ok</v-btn
          >
          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="closeBlockUserConfirmDialog()"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="show_invite_confirm_dialog" content-class="my-dialog-1">
      <v-card>
        <v-card-media
          :src="user.avatar.url"
          height="125px"
          contain
        ></v-card-media>
        <v-card-text>
          <div class="headline">Do you want to invite this user?</div>
          <div>
            This user's account is pending verification. Only verified users can
            invite pending accounts. Inviting this user will expedite their
            verification process
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" dark @click.native="closeInviteConfirmDialog()"
            >No, cancel!</v-btn
          >
          <v-btn color="green" dark @click.native="inviteUser()"
            >Yes, Invite!</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./profile.ctrl.js"></script>
<style lang="scss" src="../../../static/styles/profile.scss" scoped></style>
