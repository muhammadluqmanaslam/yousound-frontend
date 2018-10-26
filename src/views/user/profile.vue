<template>
  <div>
    <div>&nbsp;</div>

    <div class="page profile-slider-page image-container" v-if="!grid_show">
      <canvas id="canvas" class="background-image" v-if="slide_tab!='merch'"></canvas>
      <div id="back_image" class="background-overlay" v-if="slide_tab!='merch'"></div>

      <div id="slider_profile_container" class="relative">
        <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 id="user_info_page">
          <div id="profile_section">
            <div class="user-profile-section" id="profile_section">
              <div class="user-profile-image-section">
                <div class="user-profile-image" :style="{'background-image': 'url(' + user.avatar.url + ')'}"></div>
              </div>
              <div class="user-info-section">
                <div class="user-name-section">
                  <label>{{ user.display_name }}</label>
                  <v-icon class="user-status online" v-if="['artist', 'label', 'brand'].indexOf(user.user_type) > -1">fa-check-circle</v-icon>
                </div>
              </div>
            </div>
            <div class="user-follow-section" id="profile_action_buttons">
              <div class="user-status-section">
                <label class="follower-count"><strong>{{ user.followers }}</strong> Followers</label>
                <label class="vertical-divider"></label>
                <label class="user-role">{{ user.user_type }}</label>
                <template v-if="user.user_type === 'listener' && user.inviter">
                  <label class="vertical-divider"></label>
                  <label class="user-inviter-name">Invited by <router-link :to="`/${user.inviter.slug}`">{{ user.inviter.display_name }}</router-link></label>
                </template>
              </div>
              <div class="user-action-section">
                <template v-if="user.user_type === 'listener'">
                  <v-btn v-if="!user.inviter" class="invite-btn" @click.native="openInviteConfirmDialog()">Invite</v-btn></template>
                <v-btn v-else class="play-btn" @click.native="playSong()"><v-icon>play_arrow</v-icon>Play</v-btn>
                <v-btn v-if="show_stream_live_button" class="green px-2" dark @click.native="viewStream()"><v-icon>videocam</v-icon>Streaming Live</v-btn>
                <v-btn v-if="currentUser && user.id!=currentUser.id"
                  :class="{ 'follow-btn': true, 'follow': !user.is_following, 'following': user.is_following }"
                  @mouseenter="buttonHover = true"
                  @mouseleave="buttonHover = false"
                  @click.native="followUser()">{{ followButtonText }}</v-btn>
                <v-menu offset-y class="more-menu" v-if="currentUser && user.id!=currentUser.id">
                  <v-btn dark class="more-btn" slot="activator">
                    <v-icon right>more_horiz</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile key="message" @click.native="showMessageDialog()">
                      <v-list-tile-title class="default-menu-item">
                        <!-- <img class="track-status-icon" src="/static/images/ic_download.png" /> -->
                        <label>Message</label>
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile key="send_love" @click.native="showLoveDialog()" v-if="currentUser && user.id!=currentUser.id">
                      <v-list-tile-title class="default-menu-item">
                        <label>Send Love</label>
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile key="chat" @click.native="goToChat()">
                      <v-list-tile-title class="default-menu-item">
                        <label>Chat</label>
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile key="share" class="default-menu-item">
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
                    <v-list-tile key="block" @click.native="openBlockUserConfirmDialog()">
                      <v-list-tile-title class="default-menu-item">
                        <label>Block</label>
                      </v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>
          <div class="profile-slider-tab">
            <v-tabs dark v-model="slide_tab">
              <v-tabs-bar class="transparent">
                <v-spacer></v-spacer>
                <v-tabs-item v-for="tab in tabs"
                  v-if="isAvailableForSlideView(tab)"
                  :key="tab.id"
                  :id="tab.id"
                  :href="'#' + tab.id"
                  @click.native="onTab(tab.id)"
                  ripple>{{ tab.title }}</v-tabs-item>
                <v-tabs-slider color="black"></v-tabs-slider>
                <v-btn dark class="more-btn" @click.native="setGridView(true)">
                  <!-- <v-icon>widgets</v-icon> -->
                  <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <!-- Generator: Sketch 47 (45396) - http://www.bohemiancoding.com/sketch -->
                    <title>ic-grid2</title>
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="Icons" transform="translate(-591.000000, -56.000000)" fill="#FFFFFF">
                        <path d="M591,56 L596,56 L596,61 L591,61 L591,56 Z M591,63.5 L596,63.5 L596,68.5 L591,68.5 L591,63.5 Z M591,71 L596,71 L596,76 L591,76 L591,71 Z M598.5,56 L603.5,56 L603.5,61 L598.5,61 L598.5,56 Z M598.5,63.5 L603.5,63.5 L603.5,68.5 L598.5,68.5 L598.5,63.5 Z M598.5,71 L603.5,71 L603.5,76 L598.5,76 L598.5,71 Z M606,56 L611,56 L611,61 L606,61 L606,56 Z M606,63.5 L611,63.5 L611,68.5 L606,68.5 L606,63.5 Z M606,71 L611,71 L611,76 L606,76 L606,71 Z" id="ic-grid2"></path>
                      </g>
                    </g>
                  </svg>
                </v-btn>
                <v-spacer></v-spacer>
              </v-tabs-bar>
              <v-tabs-items>
                <v-tabs-content v-for="tab in tabs"
                  :key="tab.id"
                  :id="tab.id"></v-tabs-content>
              </v-tabs-items>
            </v-tabs>
          </div>
        </v-flex>
      </div>

      <carousel-3d v-if="['catalog', 'songs', 'downloaded', 'reposted', 'playlists'].indexOf(slide_tab) > -1"
        :perspective="0"
        :space="390"
        :count="albums.length"
        :display="albumDisplayCount"
        :inverseScaling="100"
        @after-slide-change="onAfterAlbumSlideChange"
        :startIndex="startIndex"
        ref="albumCarousel"
      >
        <slide :index="index" v-for="(album, index) in albums" :key="index">
          <album-slide-card :objects="albums" :objectIndex="index"></album-slide-card>
        </slide>
      </carousel-3d>

      <carousel-3d v-else-if="slide_tab=='merch'"
        :perspective="0"
        :space="390"
        :count="products.length"
        :display="merchDisplayCount"
        :inverseScaling="100"
        @after-slide-change="onAfterMerchSlideChange"
        :startIndex="startIndex"
        ref="merchCarousel"
      >
        <slide v-for="(product, index) in products" :key="index" :index="index">
          <product-slide-card
            :dataObject="product"
            :showButtonAction="openPageMerchModal"
          ></product-slide-card>
        </slide>
      </carousel-3d>

      <merch-modal v-if="showPageMerchModal"
        key="PAGE-merch-modal"
        :item="selectedProduct"
        :dismiss="closePageMerchModal"
        :shareProduct="openPageShareModal"
      />

      <share-modal v-if="showPageShareModal"
        key="PAGE-share-modal"
        :item="selectedProduct"
        :dismiss="closePageShareModal"
      />
    </div>

    <div class="page profile-grid-page" v-if="grid_show">
      <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 id="no_id" style="height:inherit !important;">
        <div class="user-profile-section" v-if="user">
          <div class="user-profile-image-section">
            <div class="user-profile-image" :style="{'background-image': 'url(' + user.avatar.url + ')'}"></div>
            <div
              v-if="show_stream_live_button"
              @click="viewStream()"
              class="user-profile-image--live"
            >
              <i class="fa fa-circle"></i>
              <span class="live">Live</span>
            </div>
          </div>
          <div class="user-info-section">
            <div class="user-name-section">
              <label>{{ user.display_name }} <v-icon class="user-status online" v-if="['artist', 'label', 'brand'].indexOf(user.user_type) > -1">fa-check-circle</v-icon></label>
            </div>
            <div class="user-status-section">
              <label class="follower-count" @click="followersClickHandler()"><strong>{{ user.followers }}</strong> Followers</label>
              <label class="vertical-divider"></label>
              <label class="user-role">{{ user.user_type }}</label>
              <template v-if="user.user_type === 'listener' && user.inviter">
                <label class="vertical-divider"></label>
                <label class="user-inviter-name">Invited by <router-link :to="`/${user.inviter.slug}`">{{ user.inviter.display_name }}</router-link></label>
              </template>
            </div>
            <div class="user-action-section">
              <template v-if="user.user_type === 'listener'">
                <v-btn v-if="!user.inviter" class="invite-btn" @click.native="openInviteConfirmDialog()">Invite</v-btn></template>
              <v-btn v-else class="play-btn" @click.native="playSong()">
                <v-icon>play_arrow</v-icon>Play</v-btn>
              <v-btn v-if="currentUser && user.id!=currentUser.id"
                :class="{ 'follow-btn': true, 'follow': !user.is_following, 'following': user.is_following }"
                @mouseenter="buttonHover = true"
                @mouseleave="buttonHover = false"
                @click.native="followUser()">{{ followButtonText }}</v-btn>
              <v-menu offset-y class="more-menu" v-if="currentUser && user.id!=currentUser.id">
                <v-btn dark class="more-btn" slot="activator">
                  <v-icon right>more_horiz</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile key="message" @click.native="showMessageDialog()">
                    <v-list-tile-title class="default-menu-item">
                      <!-- <img class="track-status-icon" src="/static/images/ic_download.png" /> -->
                      <label>Message</label>
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile key="view_direct_messages" @click.native="viewDirectMessages()" v-if="enabledViewDirectMessage">
                    <v-list-tile-title class="default-menu-item">
                      <label>View Direct Messages</label>
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile key="send_love" @click.native="showLoveDialog()" v-if="currentUser && user.id!=currentUser.id">
                    <v-list-tile-title class="default-menu-item">
                      <label>Send Love</label>
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile key="chat" @click.native="goToChat()">
                    <v-list-tile-title class="default-menu-item">
                      <label>Chat</label>
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile key="share">
                    <v-list-tile-title class="default-menu-item">
                      <!-- <img class="track-status-icon" src="/static/images/ic_share.png" /> -->
                      <label>Share</label>
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile key="flag">
                    <v-list-tile-title class="default-menu-item">
                      <!-- <img class="track-status-icon" src="/static/images/ic_flag.png" /> -->
                      <label>Flag</label>
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile key="block" @click.native="openBlockUserConfirmDialog()">
                    <v-list-tile-title class="default-menu-item">
                      <label>Block</label>
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
        <div class="profile-grid-tab">
          <v-tabs dark v-model="currentTab">
            <v-tabs-bar class="transparent">
              <v-tabs-item v-for="tab in tabs"
                v-if="isAvailableForGridView(tab)"
                :key="tab.id"
                :href="'#' + tab.id"
                @click.native="onTab(tab.id)"
                ripple>{{ tab.title }}</v-tabs-item>
              <v-tabs-slider color="black"></v-tabs-slider>
              <v-spacer></v-spacer>
              <v-btn dark class="more-btn" @click.native="setGridView(false)" v-if="currentTab!='followings'">
                <!-- <v-icon>slideshow</v-icon> -->
                <svg width="40px" height="30px" viewBox="0 0 40 30" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <!-- Generator: Sketch 47 (45396) - http://www.bohemiancoding.com/sketch -->
                  <title>ic-carousel1</title>
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Icons" transform="translate(-425.000000, -49.000000)" fill-rule="nonzero" fill="#000000">
                      <path d="M426.42968,73.858 C425.63904,73.858 425,73.21892 425,72.42832 L425,55.28472 C425,54.4972 425.63908,53.85816 426.42968,53.85816 L426.42968,73.858 Z M463.5704,73.858 L463.5704,53.85816 C464.361,53.85816 465.00008,54.4972 465.00008,55.28472 L465.00008,72.42832 C465.00008,73.21892 464.3626,73.858 463.5704,73.858 Z M430.71256,52.4284 L430.714122,75.2848 L429.287562,75.2848 C428.498482,75.2848 427.857882,74.64572 427.857882,73.85824 L427.857882,53.85824 C427.857882,53.0676 428.496962,52.42856 429.286002,52.42856 L430.71256,52.4284 Z M459.28744,52.4284 L460.713998,52.42856 C461.503038,52.42856 462.142118,53.0676 462.142118,53.85824 L462.142118,73.85824 C462.142118,74.64572 461.501518,75.2848 460.712438,75.2848 L459.285878,75.2848 L459.28744,52.4284 Z M433.5704,51 L456.429602,51.00004 C457.213962,51.00004 457.857722,51.6438 457.857722,52.42816 L457.85616,75.28456 C457.85616,76.07204 457.21396,76.71424 456.4296,76.71424 L433.5704,76.71424 C432.78448,76.71424 432.14384,76.07048 432.14384,75.28456 L432.14384,52.42656 C432.14384,51.6422 432.78448,51 433.5704,51 Z M448.45928,70.89516 C448.86864,70.89516 451.8452,70.54048 451.843793,68.3762872 L451.843793,55.4154872 C451.843793,55.1107832 451.782857,54.8826596 451.52192,54.8498472 L451.462544,54.8357844 C451.489107,54.8357844 451.500045,54.846722 451.52192,54.8498472 L440.49832,57.5795272 C440.176448,57.6685672 440.0702,57.9982712 440.0702,58.3576472 L440.0702,68.0796472 C440.0702,68.0702712 438.89676,67.9421472 437.94676,68.2733952 C436.23428,68.8671552 435.188964,70.2421552 435.58584,71.4718352 C435.86396,72.3265152 436.78272,72.8765152 437.98116,72.8765152 C438.4484,72.8765152 442.36716,72.3468352 442.36716,69.6796352 L442.36716,61.2732352 L449.66396,59.6435552 L449.66396,66.1295552 C449.66396,66.1154924 449.19832,65.777992 448.24364,66.13268 C446.55928,66.75296 445.46868,68.14048 445.88116,69.3936 C446.17492,70.3108 447.21084,70.89516 448.45928,70.89516 Z" id="Combined-Shape"></path>
                    </g>
                  </g>
                </svg>
              </v-btn>
              <v-menu offset-y id="followings_selector" class="filter_menu" v-if="currentTab=='followings'">
                <v-btn dark slot="activator">Following<v-icon dark right>keyboard_arrow_down</v-icon></v-btn>
                <v-list>
                  <v-list-tile @click.native="setFollowingsSelector('followings', 'Following')">
                    <v-list-tile-title>Following</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click.native="setFollowingsSelector('followers', 'Follower')">
                    <v-list-tile-title>Followers</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-tabs-bar>
            <v-tabs-items>
              <v-tabs-content v-for="tab in tabs" :key="tab.id" :id="tab.id">
                <div v-if="tab.id=='followings' || tab.id=='followers'">
                  <div v-if="!users || users.length == 0" class="empty-section">
                    <p class="empty-title">Profile is Empty</p>
                    <p class="empty-description">It’s a little lonely in here...</p>
                    <router-link to="/discover" class="empty-discover-btn" v-if="currentUser && user.id==currentUser.id">Discover</router-link>
                  </div>
                  <v-layout row wrap class="covers-content" v-else>
                    <div class="card-container" v-for="(user, index) in users" :key="index">
                      <artist-item :artist="user" :key="index"></artist-item>
                    </div>
                  </v-layout>
                </div>
                <div v-else-if="tab.id=='artists'">
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
                        <p class="empty-description">This user has not added any user</p>
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <v-layout row wrap class="covers-content">
                      <div class="card-container" v-for="(user, index) in users" :key="index">
                        <artist-item :artist="user" :key="index"></artist-item>
                      </div>
                    </v-layout>
                  </template>
                </div>
                <div v-else-if="tab.id=='merch'">
                  <template v-if="!products || products.length == 0">
                    <template v-if="currentUser && currentUser.id == user.id">
                      <div class="empty-section">
                        <p class="empty-title">Empty</p>
                        <p class="empty-description">You have not uploaded any merch</p>
                        <router-link to="/product/add" class="empty-discover-btn">Upload</router-link>
                      </div>
                    </template>
                    <template v-else>
                      <div class="empty-section">
                        <p class="empty-title">Empty</p>
                        <p class="empty-description">This user has no merch</p>
                      </div>
                    </template>
                  </template>

                  <v-layout row wrap class="covers-content" v-else>
                    <div class="card-container" v-for="(product, index) in products" :key="index">
                      <product-card :dataObject="product"></product-card>
                    </div>
                  </v-layout>
                  <v-btn class="loadmore-btn" @click.native="getItems(tab.id, true)" v-show="page_index < total_pages">Load More</v-btn>
                </div>
                <!-- <div v-else-if="tab.id=='reposted'">
                  <v-layout row wrap class="covers-content">
                    <div class="card-container" v-for="(feed, index) in feeds" :key="index" v-else-if="feed.assoc_type=='Album' || feed.assoc_type=='ShopProduct'">
                      <track-card :objects="user.recent_items" :objectIndex="index" v-if="feed.assoc_type=='Album'"></track-card>
                      <product-card :dataObject="feed" v-if="feed.assoc_type=='ShopProduct'"></product-card>
                    </div>
                  </v-layout>
                </div> -->
                <div v-else>
                  <template v-if="!albums || albums.length == 0">
                    <template v-if="tab.id == 'songs'">
                      <template v-if="currentUser && currentUser.id == user.id">
                        <div class="empty-section">
                          <p class="empty-title">Empty</p>
                          <p class="empty-description">You have no uploaded albums</p>
                          <router-link to="/upload/album" class="empty-discover-btn">Upload</router-link>
                        </div>
                      </template>
                      <template v-else>
                        <div class="empty-section">
                          <p class="empty-title">Empty</p>
                          <p class="empty-description">This user has no uploaded albums</p>
                        </div>
                      </template>
                    </template>
                    <template v-else-if="tab.id == 'downloaded'">
                      <template v-if="currentUser && currentUser.id == user.id">
                        <div class="empty-section">
                          <p class="empty-title">Empty</p>
                          <p class="empty-description">You have no downloaded albums</p>
                          <router-link to="/discover" class="empty-discover-btn">Discover</router-link>
                        </div>
                      </template>
                      <template v-else>
                        <div class="empty-section">
                          <p class="empty-title">Empty</p>
                          <p class="empty-description">This user has not any downloaded albums</p>
                        </div>
                      </template>
                    </template>
                    <template v-else-if="tab.id == 'reposted'">
                      <template v-if="currentUser && currentUser.id == user.id">
                        <div class="empty-section">
                          <p class="empty-title">Empty</p>
                          <p class="empty-description">You have no reposts</p>
                          <router-link to="/discover" class="empty-discover-btn">Discover</router-link>
                        </div>
                      </template>
                      <template v-else>
                        <div class="empty-section">
                          <p class="empty-title">Empty</p>
                          <p class="empty-description">This user has no reposts</p>
                        </div>
                      </template>
                    </template>
                    <template v-else-if="tab.id == 'playlists'">
                      <template v-if="currentUser && currentUser.id == user.id">
                        <div class="empty-section">
                          <p class="empty-title">Empty</p>
                          <p class="empty-description">You have no playlists</p>
                          <router-link to="/discover" class="empty-discover-btn">Discover</router-link>
                        </div>
                      </template>
                      <template v-else>
                        <div class="empty-section">
                          <p class="empty-title">Empty</p>
                          <p class="empty-description">This user has no playlists</p>
                        </div>
                      </template>
                    </template>
                    <template v-else-if="tab.id == 'playlists'">
                      <template v-if="currentUser && currentUser.id == user.id">
                        <div class="empty-section">
                          <p class="empty-title">Empty</p>
                          <p class="empty-description">You have no playlists</p>
                          <router-link to="/discover" class="empty-discover-btn">Discover</router-link>
                        </div>
                      </template>
                      <template v-else>
                        <div class="empty-section">
                          <p class="empty-title">Empty</p>
                          <p class="empty-description">This user has no playlists</p>
                        </div>
                      </template>
                    </template>
                    <template v-else-if="tab.id == 'catalog'">
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
                    <div class="card-container" v-for="(feed, index) in albums" :key="index">
                      <track-card :objects="albums" :objectIndex="index"></track-card>
                    </div>
                  </v-layout>
                  <v-btn class="loadmore-btn" @click.native="getItems(tab.id, true)" v-show="page_index < total_pages">Load More</v-btn>
                </div>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </div>
      </v-flex>
    </div>

    <send-message v-if="showSendMessage"
      :receiver="user"
      :dismiss="dismissMessageModal"
    />

    <send-love-modal v-if="showSendLoveModal"
      :item="user"
      :dismiss="dismissLoveDialog"
    />

    <v-dialog v-model="show_block_user_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Block a User</v-card-title>
        <v-card-text>Are you sure you want to block this?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="blockUser()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="closeBlockUserConfirmDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="show_invite_confirm_dialog" content-class="my-dialog-1">
      <v-card>
        <v-card-media :src="user.avatar.url" height="125px" contain></v-card-media>
        <v-card-text>
          <div class="headline">Do you want to invite this user?</div>
          <div>This user's account is pending verification. Only verified users can invite pending accounts. Inviting this user will expedite their verification process</div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" dark @click.native="closeInviteConfirmDialog()">No, cancel!</v-btn>
          <v-btn color="green" dark @click.native="inviteUser()">Yes, Invite!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./profile.ctrl.js"></script>
