<template>
  <div v-scroll="handleScroll">
    <div class="page profile-grid-page mx-5" :class="{ onMobile }">
      <!-- Own Account -->
      <content-top-header
        height="auto"
        class="border-bottom-x"
        v-if="
          !(
            currentUser &&
            user.id != currentUser.id &&
            user.username != PublicRelationsUsername
          )
        "
      >
        <template slot="topHeader">
          <ul class="user-top-wrapper">
            <li v-if="user" class="user-profile-section">
              <div
                class="user-profile-image-section"
                :class="{ live: show_stream_live_button }"
                @click="
                  show_stream_live_button &&
                    !view_stream_clicked &&
                    viewStream()
                "
              >
                <div
                  class="user-profile-image-own"
                  :style="{
                    'background-image': 'url(' + user.avatar.url + ')',
                  }"
                ></div>
              </div>

              <div class="user-info-section">
                <div class="user-name-section">
                  <label class="display-name-own">
                    {{ user.username }}
                    <v-icon
                      v-if="
                        ['artist', 'label', 'brand'].indexOf(user.user_type) >
                        -1
                      "
                      class="user-status online"
                      >fa-check-circle</v-icon
                    >
                  </label>
                </div>
                <div
                  v-if="followMetaVisible && !onMobile"
                  class="user-status-section mt-0"
                >
                  <!-- <label class="vertical-divider"></label> -->
                  <div
                    @click="onTab('followers')"
                    class="follower-count stat-count"
                  >
                    <strong class="_count">{{
                      user.followers | formatLargeNumber
                    }}</strong>
                    Followers
                  </div>
                  <div
                    @click="onTab('followings')"
                    class="follower-count stat-count"
                  >
                    <strong class="_count">{{ user.followings }}</strong>
                    Following
                  </div>
                  <div class="follower-count stat-count stat-count">
                    <strong class="_count">{{
                      smsCount | formatLargeNumber
                    }}</strong>
                    SMS
                  </div>

                  <template
                    v-if="user.user_type === 'listener' && user.inviter"
                  >
                    <div class="vertical-divider"></div>
                    <div class="user-inviter-name">
                      Invited by
                      <router-link :to="`/${user.inviter.slug}`">{{
                        user.inviter.username
                      }}</router-link>
                    </div>
                  </template>
                </div>
              </div>
            </li>
            <v-spacer></v-spacer>
            <li class="user-action-section">
              <v-btn @click.native="playSong()" class="play-btn">
                <v-icon>play_arrow</v-icon>
                <span>Play</span>
              </v-btn>
            </li>

            <template
              v-if="
                currentUser &&
                user.id != currentUser.id &&
                user.username != PublicRelationsUsername
              "
            >
              <li>
                <user-follow-btn
                  :user="user"
                  theme="dark"
                  type="default"
                  borderRadius
                />
              </li>

              <li>
                <img
                  style="opacity: 0.8"
                  :src="require('@/assets/mail_icon_outline.svg')"
                  alt="mail icon"
                  width="25"
                  class="message-btn mt-2"
                  @click="showMessageDialog()"
                />
              </li>

              <li
                v-if="
                  currentUser &&
                  currentUser.creator_verified &&
                  user.stripe_connected &&
                  user.creator_verified &&
                  user.id != currentUser.id
                "
              >
                <img
                  :src="require('../../../static/images/ic_dollar.svg')"
                  alt="circled dollar icon"
                  class="donate-btn mt-2"
                  width="25"
                  style="opacity: 0.8"
                  @click="showLoveDialog()"
                />
              </li>
            </template>

            <li>
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
                      user.stripe_connected &&
                      user.creator_verified
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
            </li>
          </ul>
        </template>
      </content-top-header>

      <!-- Other Account -->
      <content-top-header
        height="auto"
        v-if="
          currentUser &&
          user.id != currentUser.id &&
          user.username != PublicRelationsUsername &&
          !show_following_scroll
        "
      >
        <template slot="topHeader">
          <ul class="user-top-wrapper">
            <li v-if="user" class="user-profile-section">
              <div
                class="user-profile-image-section"
                :class="{ live: show_stream_live_button }"
                @click="
                  show_stream_live_button &&
                    !view_stream_clicked &&
                    viewStream()
                "
              >
                <div
                  class="user-profile-image"
                  :style="{
                    'background-image': 'url(' + user.avatar.url + ')',
                  }"
                ></div>

                <div
                  v-if="followMetaVisible && onMobile"
                  class="user-status-section mt-2"
                >
                  
                  <label @click="onTab('followers')" class="follower-count">
                    <strong class="_count">{{
                      user.followers | formatLargeNumber
                    }}</strong>
                    <div class="_label">Followers</div>
                  </label>

                  <label class="vertical-divider"></label>

                  <label @click="onTab('followings')" class="follower-count">
                    <strong class="_count">{{
                      user.followings | formatLargeNumber
                    }}</strong>
                    <div class="_label">Following</div>
                  </label>
                </div>

                <div class="live-btn">Live</div>
              </div>

              <div class="user-info-section">
                <div class="user-name-section">
                  <span class="user-role">{{ user.user_type }}</span>
                  <div class="display-name">
                    {{ user.username }}
                    <v-icon
                      v-if="
                        ['artist', 'label', 'brand'].indexOf(user.user_type) >
                        -1
                      "
                      class="user-status online"
                      >fa-check-circle</v-icon
                    >
                  </div>
                </div>

                <div class="dflex align-center mt-2">
                  <!-- 
                  <li v-if="user.user_type === 'listener'" class="user-action-section">
                    <v-btn
                      v-if="
                        currentUser &&
                        ['listener'].indexOf(currentUser.user_type) == -1 &&
                        !user.inviter &&
                        user.request_status === 'pending'
                      "
                      depressed
                      @click.native="openInviteConfirmDialog()"
                      class="invite-btn ml-0"
                      :class="{'mb-3': onMobile}"
                    >
                      Invite
                    </v-btn>
      
                    <v-btn v-else @click.native="playSong()" class="play-btn">
                      <v-icon>play_arrow</v-icon>
                      <span>Play</span>
                    </v-btn>
                  </li> -->

                  <template
                    v-if="
                      currentUser &&
                      user.id != currentUser.id &&
                      user.username != PublicRelationsUsername
                    "
                  >
                    <div>
                      <user-follow-btn
                        :user="user"
                        theme="blue"
                        type="default"
                        borderRadius
                      />
                    </div>

                    <!-- <div>
                                  <img
                                    style="opacity: 0.8"
                                    :src="require('@/assets/mail_icon_outline.svg')"
                                    alt="mail icon"
                                    width="25"
                                    class="message-btn mt-2"
                                    @click="showMessageDialog()"
                                  />
                                </div> -->

                    <!-- <div
                      v-if="
                        currentUser &&
                        currentUser.creator_verified &&
                        user.stripe_connected &&
                        user.creator_verified &&
                        user.id != currentUser.id
                      "
                    >
                      <img
                        :src="require('../../../static/images/ic_dollar.svg')"
                        alt="circled dollar icon"
                        class="donate-btn mt-2"
                        width="25"
                        style="opacity: 0.8"
                        @click="showLoveDialog()"
                      />
                    </div> -->
                  </template>

                  <div class="ml-2">
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
                            user.stripe_connected &&
                            user.creator_verified
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
                        <!-- <v-list-tile @click="flagUser()">
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
                                    </v-list-tile> -->
                        <v-list-tile>
                          <v-list-tile-title class="default-menu-item">
                            <div class="dlfex align-center menu-list-div px-2">
                              <img
                                src="../../assets/message_icon.svg"
                                width="12"
                                class="mr-2"
                              />

                              <label>Message</label>
                            </div>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-title class="default-menu-item">
                            <div class="dlfex align-center menu-list-div px-2">
                              <img
                                src="../../assets/dollar.svg"
                                width="12"
                                class="mr-2"
                              />

                              <label>Donate</label>
                            </div>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile
                          key="block"
                          @click="openBlockUserConfirmDialog()"
                        >
                          <v-list-tile-title class="default-menu-item">
                            <div class="dlfex align-center menu-list-div px-2">
                              <img
                                src="../../assets/vlovk.svg"
                                width="12"
                                class="mr-2"
                              />

                              <label>Block</label>
                            </div>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="flagUser()">
                          <v-list-tile-title class="default-menu-item">
                            <div
                              class="dlfex align-center menu-list-div px-2"
                              @click="flagUser()"
                            >
                              <img
                                src="../../assets/report.svg"
                                width="12"
                                class="mr-2"
                              />

                              <label>Report</label>
                            </div>
                          </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
              </div>
            </li>

            <v-spacer></v-spacer>
            <div
              v-if="followMetaVisible && !onMobile"
              class="user-status-section"
            >
              <label
                @click="onTab('followers')"
                class="follower-count stat-count"
              >
                <strong class="_count">{{
                  user.followers | formatLargeNumber
                }}</strong>
                Followers</label
              >
              <label
                @click="onTab('followings')"
                class="follower-count stat-count"
                ><strong class="_count">{{ user.followings }}</strong>
                Following</label
              >
              <!-- <label class="vertical-divider"></label> -->
              <label class="follower-count stat-count">
                <strong class="_count">{{
                  smsCount | formatLargeNumber
                }}</strong>
                SMS
              </label>

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
          </ul>

          <!-- <ul>
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
          </ul> -->
        </template>
      </content-top-header>

      <!-- Other account scroll -->

      <content-top-header
        height="auto"
        class="special-scroll-header"
        v-if="
          currentUser &&
          user.id != currentUser.id &&
          user.username != PublicRelationsUsername &&
          show_following_scroll
        "
      >
        <template slot="topHeader">
          <ul class="user-top-wrapper align-center">
            <li v-if="user">
              <div class="dflex align-center">
                <div class="user-profile-section my-0">
                  <div
                    class="user-profile-image-section mr-3"
                    :class="{ live: show_stream_live_button }"
                    @click="
                      show_stream_live_button &&
                        !view_stream_clicked &&
                        viewStream()
                    "
                  >
                    <div
                      class="user-profile-image small-img"
                      :style="{
                        'background-image': 'url(' + user.avatar.url + ')',
                      }"
                    ></div>

                    <div
                      v-if="followMetaVisible && onMobile"
                      class="user-status-section mt-2"
                    >
                      <label @click="onTab('followers')" class="follower-count">
                        <strong class="_count">{{
                          user.followers | formatLargeNumber
                        }}</strong>
                        <div class="_label">Followers</div>
                      </label>

                      <label class="vertical-divider"></label>


                      <label @click="onTab('followings')" class="follower-count">
                        <strong class="_count">{{
                          user.followings | formatLargeNumber
                        }}</strong>
                        <div class="_label">Following</div>
                      </label>

                    </div>

                    <div class="live-btn">Live</div>
                  </div>

                  <div class="user-info-section">
                    <div class="user-name-section small-text">
                      <div class="display-name ">
                        {{ user.username }}
                        <v-icon
                          v-if="
                            ['artist', 'label', 'brand'].indexOf(user.user_type) >
                            -1
                          "
                          class="user-status online"
                          >fa-check-circle</v-icon
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <div class="ml-4">
                  <ul class="width100">
                    <template v-for="tab in tabs">
                      <li
                        v-if="isAvailableForGridView(tab)"
                        v-show="['followings', 'followers'].indexOf(tab.id) == -1"
                        :key="tab.id"
                        :href="`#${tab.id}`"
                        class="nav-li"
                        :class="[
                          { 'active tab-active': isActiveTab(tab.id) },
                          `nav-${tab.id}`,
                        ]"
                      >
                        <label class="nav-label" @click="onTab(tab.id)">
                          {{ tab.title }}
                        </label>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
            </li>

            <v-spacer></v-spacer>

            <div class="dflex align-center">
              <div
                v-if="followMetaVisible && !onMobile"
                class="user-status-section"
              >
                <label
                  @click="onTab('followers')"
                  class="follower-count stat-count"
                >
                  <strong class="_count">{{
                    user.followers | formatLargeNumber
                  }}</strong>
                  Followers</label
                >
                
                <label
                  @click="onTab('followings')"
                  class="follower-count stat-count"
                  ><strong class="_count">{{ user.followings }}</strong>
                  Following</label
                >
                <!-- <label class="vertical-divider"></label> -->
                
                <label class="follower-count stat-count">
                  <strong class="_count">{{
                    smsCount | formatLargeNumber
                  }}</strong>
                  SMS
                </label>

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

              <div class="mb-2 ml-5">
                <div class="dflex align-center mt-2">
                  <template
                    v-if="
                      currentUser &&
                      user.id != currentUser.id &&
                      user.username != PublicRelationsUsername
                    "
                  >
                    <div>
                      <user-follow-btn
                        :user="user"
                        theme="blue"
                        type="default"
                        borderRadius
                      />
                    </div>

                    <div
                      v-if="
                        currentUser &&
                        currentUser.creator_verified &&
                        user.stripe_connected &&
                        user.creator_verified &&
                        user.id != currentUser.id
                      "
                    >
                      <img
                        :src="require('../../../static/images/ic_dollar.svg')"
                        alt="circled dollar icon"
                        class="donate-btn mt-2"
                        width="25"
                        style="opacity: 0.8"
                        @click="showLoveDialog()"
                      />
                    </div>
                  </template>

                  <div class="ml-2">
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
                            user.stripe_connected &&
                            user.creator_verified
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
                        <!-- <v-list-tile @click="flagUser()">
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
      </v-list-tile> -->
                        <v-list-tile>
                          <v-list-tile-title class="default-menu-item">
                            <div class="dlfex align-center menu-list-div px-2">
                              <img
                                src="../../assets/message_icon.svg"
                                width="12"
                                class="mr-2"
                              />

                              <label>Message</label>
                            </div>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile>
                          <v-list-tile-title class="default-menu-item">
                            <div class="dlfex align-center menu-list-div px-2">
                              <img
                                src="../../assets/dollar.svg"
                                width="12"
                                class="mr-2"
                              />

                              <label>Donate</label>
                            </div>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile
                          key="block"
                          @click="openBlockUserConfirmDialog()"
                        >
                          <v-list-tile-title class="default-menu-item">
                            <div class="dlfex align-center menu-list-div px-2">
                              <img
                                src="../../assets/vlovk.svg"
                                width="12"
                                class="mr-2"
                              />

                              <label>Block</label>
                            </div>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="flagUser()">
                          <v-list-tile-title class="default-menu-item">
                            <div
                              class="dlfex align-center menu-list-div px-2"
                              @click="flagUser()"
                            >
                              <img
                                src="../../assets/report.svg"
                                width="12"
                                class="mr-2"
                              />

                              <label>Report</label>
                            </div>
                          </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
              </div>
            </div>
          </ul>

          <!-- <ul>
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
          </ul> -->
        </template>
      </content-top-header>
      <div class="followers-header" v-if="show_following">
        <div class="followers-title">Followers</div>
      </div>

      <content-top-header absolute v-if="!show_following">
        <template slot="topHeader">
          <ul class="width100">
            <template v-for="tab in tabs">
              <li
                v-if="isAvailableForGridView(tab)"
                v-show="['followings', 'followers'].indexOf(tab.id) == -1"
                :key="tab.id"
                :href="`#${tab.id}`"
                class="nav-li"
                :class="[
                  { 'active tab-active': isActiveTab(tab.id) },
                  `nav-${tab.id}`,
                ]"
              >
                <label class="nav-label" @click="onTab(tab.id)">
                  {{ tab.title }}
                </label>
              </li>
            </template>
          </ul>
        </template>
      </content-top-header>

      <div class="page-content">
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
              class="card-container min-240"
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
              <product-card :dataObject="product" hideOverlay></product-card>
            </v-flex>
          </v-layout>
          <v-btn
            v-show="page_index < total_pages"
            @click.native="getItems(active_tab, true)"
            class="loadmore-btn"
            >Load More</v-btn
          >
        </div>

        <div v-else-if="active_tab === 'sms_group' && user.id == currentUser.id">
          <div class="sms-group pa-2">
          <div class="dflex align-center justify-space-between">
            <div class="sms-info">
              <div class="dflex align-center"> 
                <div class="sms-img"></div>
                <div class="ml-2">
                  <div class="sms-name dflex align-center">
                    Tribe Nohbi
                    <img src="../../assets/true.svg" width="10" class="ml-1">
                  </div>
                  <div class="user-type">
                    Artist
                  </div>
                </div>
              </div>
            </div>

            <div class="sms-btn-group mr-4">
              <v-btn class="join-btn" round>Join SMS</v-btn>
              <v-btn class="ml-2 joined-btn" round>Joined SMS</v-btn>
            </div>

          </div>
        </div>
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
          <div class="dflex justify-space-between align-center">
            <div class="text-big">Popular</div>
          </div>
          <v-layout row wrap>
            <v-flex xs4 class="pr-3" v-for="video in 3" :key="video">
              <video-box :hoverOverlay="false" :item="ownVideos[video]" />
            </v-flex>
          </v-layout>
          <div class="dflex justify-space-between align-center margin-top-x">
            <div class="text-big">Videos</div>
            <div class="text-small cursor-pointer">View all</div>
          </div>
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
                  <p class="empty-description">You have no downloaded albums</p>
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
          <div v-else>
            <div class="_body list-track-view list-track-view-trackCard">
              <div class="dflex justify-space-between align-center mt-3 mb-3">
                <div class="text-big">Popular</div>
              </div>
              <div
                v-for="(track, index) in albums.slice(0, 5)"
                :key="index"
                class="list-track-view-item px-5"
              >
                <track-card
                  :objects="albums"
                  :objectIndex="index"
                  hideMoreMenu
                  hideTrackLength
                  displayDuration
                />
              </div>
            </div>
            <div class="dflex justify-space-between align-center mt-5 mb-3">
              <div class="text-big">Albums</div>
            </div>
            <v-layout row wrap class="covers-content">
              <v-flex
                xs6
                class="custom-lg5"
                v-for="(feed, index) in albums"
                :key="index"
              >
                <track-card :objects="albums" :objectIndex="index"></track-card>
              </v-flex>
            </v-layout>

            <div class="dflex justify-space-between align-center mt-5 mb-3">
              <div class="text-big">Appears on</div>
            </div>
            <v-layout row wrap class="covers-content">
              <v-flex
                xs6
                class="custom-lg5"
                v-for="(feed, index) in albums"
                :key="index"
              >
                <track-card :objects="albums" :objectIndex="index"></track-card>
              </v-flex>
            </v-layout>
          </div>

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
<style src="../../../static/styles/repost.scss" lang="scss" scoped></style>
