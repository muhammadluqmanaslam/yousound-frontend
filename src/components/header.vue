<template>
  <v-layout
    row
    wrap
    class="my-header"
    :class="{ fixed: $store.getters['navigator/isHeaderFixed'] }"
  >
    <v-flex v-if="currentUser" mx-5>
      <v-toolbar class="header">
        <router-link to="/album">
          <v-toolbar-title></v-toolbar-title>
        </router-link>

        <v-btn
          v-if="['video'].indexOf(currentPage) > -1"
          class="btn-live"
          :to="`/video#follows`"
          >Live</v-btn
        >
        <!-- <v-toolbar-title></v-toolbar-title> -->
        <v-spacer></v-spacer>

        <v-tooltip bottom>
          <v-btn
            icon
            slot="activator"
            :class="{ active: currentPage === 'album' }"
            @click.native="choosePage('album')"
          >
            <img
              class="active"
              src="/static/images/ic_music_active.svg"
              width="20"
              style="margin-top: 3px"
            />
            <img
              src="/static/images/ic_music.svg"
              width="20"
              style="margin-top: 3px"
            />
          </v-btn>
          <span>Album</span>
        </v-tooltip>

        <v-tooltip bottom>
          <v-btn
            icon
            slot="activator"
            :class="{ active: currentPage === 'product' }"
            @click.native="choosePage('product')"
          >
            <img
              class="active"
              src="/static/images/ic_tag_active.svg"
              width="18"
              style="margin-top: -2px"
            />
            <img
              src="/static/images/ic_tag.svg"
              width="18"
              style="margin-top: -2px"
            />
          </v-btn>
          <span>Shop</span>
        </v-tooltip>

        <v-tooltip bottom>
          <v-btn
            icon
            slot="activator"
            :class="{ active: ['video'].indexOf(currentPage) > -1 }"
            @click.native="choosePage('video')"
          >
            <img
              class="active"
              src="/static/images/ic_video_active.svg"
              width="20"
            />
            <img src="/static/images/ic_video.svg" width="20" />
          </v-btn>
          <span>Video</span>
        </v-tooltip>

        <v-badge color="red">
          <span slot="badge" v-if="$store.state.activity.badge.stream > 0">{{
            $store.state.activity.badge.stream
          }}</span>
          <v-tooltip bottom>
            <v-btn
              icon
              slot="activator"
              :class="{ active: currentPage === 'feed' }"
              @click.native="choosePage('feed')"
            >
              <img
                class="active"
                src="/static/images/ic_home_active.svg"
                width="20"
              />
              <img src="/static/images/ic_home.svg" width="20" />
            </v-btn>
            <span>Feed</span>
          </v-tooltip>
        </v-badge>

        <v-badge color="red">
          <span slot="badge" v-if="$store.state.activity.badge.activity > 0">{{
            $store.state.activity.badge.activity
          }}</span>
          <v-tooltip bottom>
            <v-btn
              icon
              slot="activator"
              :class="{ active: currentPage === 'activity' }"
              @click.native="choosePage('activity')"
            >
              <img
                class="active"
                src="/static/images/ic_alarm_active.svg"
                width="18"
              />
              <img src="/static/images/ic_alarm.svg" width="18" />
            </v-btn>
            <span>Activity</span>
          </v-tooltip>
        </v-badge>

        <v-badge color="red">
          <span slot="badge" v-if="$store.state.activity.badge.message > 0">{{
            $store.state.activity.badge.message
          }}</span>
          <v-tooltip bottom>
            <v-btn
              icon
              slot="activator"
              :class="{ active: currentPage === 'messages' }"
              @click.native="choosePage('messages')"
            >
              <img
                class="active"
                src="/static/images/ic_message_active.svg"
                width="20"
              />
              <img src="/static/images/ic_message.svg" width="20" />
            </v-btn>
            <span>Messages</span>
          </v-tooltip>
        </v-badge>

        <v-badge color="red">
          <span slot="badge" v-if="$store.state.activity.badge.cart > 0">{{
            $store.state.activity.badge.cart
          }}</span>
          <v-tooltip bottom>
            <v-btn
              icon
              slot="activator"
              :class="{ active: currentPage === 'cart' }"
              @click.native="choosePage('cart')"
            >
              <img
                class="active"
                src="/static/images/ic_cart_active.svg"
                width="20"
              />
              <img src="/static/images/ic_cart.svg" width="20" />
            </v-btn>
            <span>Cart</span>
          </v-tooltip>
        </v-badge>

        <v-badge
          color="red"
          v-if="
            currentUser &&
            ['artist', 'brand', 'label'].indexOf(currentUser.user_type) > -1
          "
        >
          <span slot="badge" v-if="$store.state.activity.badge.sell > 0">{{
            $store.state.activity.badge.sell
          }}</span>
          <v-tooltip bottom>
            <v-btn
              icon
              slot="activator"
              :class="{ active: currentPage === 'sell' }"
              @click.native="choosePage('sell')"
            >
              <img
                class="active"
                src="/static/images/ic_delivery_active.svg"
                width="20"
                style="margin-top: 2px"
              />
              <img
                src="/static/images/ic_delivery.svg"
                width="20"
                style="margin-top: 2px"
              />
            </v-btn>
            <span>Sell</span>
          </v-tooltip>
        </v-badge>

        <v-menu
          v-if="currentUser"
          bottom
          left
          offset-y
          :nudge-top="-5"
          :nudge-left="0"
          class="profile-menu"
          content-class="profile-menu__content"
        >
          <v-btn icon slot="activator">
            <div
              class="profile-image"
              :style="{
                'background-image': 'url(' + currentUser.avatar.thumb.url + ')',
              }"
              v-if="currentUser"
            ></div>
          </v-btn>
          <v-list two-line>
            <v-list-tile avatar :to="'/' + currentUser.slug" class="profile">
              <v-list-tile-avatar>
                <img v-bind:src="currentUser.avatar.url" />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ currentUser.username }}
                  <v-icon
                    class="user-status online"
                    v-if="
                      ['artist', 'label', 'brand'].indexOf(
                        currentUser.user_type
                      ) > -1
                    "
                    >fa-check-circle</v-icon
                  >
                </v-list-tile-title>
                <v-list-tile-sub-title>View Profile</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <!-- <v-list-tile
              v-if="currentUser.user_type=='artist' || (!$store.getters['app/disabledLiveVideo'] && currentUser.enabled_live_video && ['artist', 'brand', 'label'].indexOf(currentUser.user_type) > -1)"
              class="chat"
            >
              <label
                v-if="currentUser.user_type=='artist'"
                @click="$router.push(`/upload/album`)"
              >Upload</label>
              <label
                v-if="!$store.getters['app/disabledLiveVideo'] && currentUser.enabled_live_video && ['artist', 'brand', 'label'].indexOf(currentUser.user_type) > -1"
                @click="$router.push(`/user/${currentUser.slug}/video`)"
              >Live Video</label>
              <label
                @click="$router.push(`/user/${currentUser.slug}/chat`)"
              >Chat</label>
            </v-list-tile> -->
            <v-divider></v-divider>
            <v-list-tile
              :to="`/user/${currentUser.slug}/video`"
              v-if="
                !$store.getters['app/disabledLiveVideo'] &&
                currentUser.enabled_live_video &&
                ['artist', 'brand', 'label'].indexOf(currentUser.user_type) > -1
              "
            >
              <v-list-tile-content>
                <v-list-tile-title>Live Video</v-list-tile-title>
                <v-list-tile-sub-title
                  >Broadcast a live stream</v-list-tile-sub-title
                >
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              to="/upload/album"
              v-if="currentUser.user_type == 'artist' || currentUser.user_type == 'brand'"
            >
              <v-list-tile-content>
                <v-list-tile-title>Upload</v-list-tile-title>
                <v-list-tile-sub-title>Upload an album</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              key="manage"
              to="/albums"
              v-if="currentUser.user_type == 'artist'"
            >
              <v-list-tile-content>
                <v-list-tile-title>Manage</v-list-tile-title>
                <v-list-tile-sub-title>Edit your albums</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile key="settings" to="/settings">
              <v-list-tile-content>
                <v-list-tile-title>Settings</v-list-tile-title>
                <v-list-tile-sub-title
                  >Edit profile, password, bank info</v-list-tile-sub-title
                >
              </v-list-tile-content>
            </v-list-tile>
            <!-- <v-list-tile key="moderator">
              <v-list-tile-title class="profile-menu-item">
                <v-icon right>fa-users</v-icon>
                <label>Moderator</label>
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile key="main_landing" to="/">
              <v-list-tile-title class="profile-menu-item">
                <label>Main Landing</label>
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile key="landing" to="/home">
              <v-list-tile-title class="profile-menu-item">
                <label>Landing</label>
              </v-list-tile-title>
            </v-list-tile> -->
            <v-list-tile
              v-if="
                ['listener', 'artist', 'label'].indexOf(currentUser.user_type) >
                -1
              "
              key="payments"
              to="/payments"
            >
              <v-list-tile-content>
                <v-list-tile-title>Payments</v-list-tile-title>
                <v-list-tile-sub-title
                  >View transactions, refunds</v-list-tile-sub-title
                >
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              key="admin"
              to="/admin"
              v-if="['admin', 'moderator'].indexOf(currentUser.user_type) > -1"
            >
              <v-list-tile-content>
                <v-list-tile-title>Admin</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <!-- <v-list-tile key="labels" to="/labels" v-if="['artist', 'label'].indexOf(currentUser.user_type) > -1">
              <v-list-tile-content v-if="currentUser.user_type=='artist'">
                <v-list-tile-title>My Labels</v-list-tile-title>
                <v-list-tile-sub-title>Manage your labels</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content v-else>
                <v-list-tile-title>Record Labels</v-list-tile-title>
                <v-list-tile-sub-title>Manage record labels</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile> -->
            <v-list-tile
              v-if="
                ['artist', 'brand', 'label'].indexOf(currentUser.user_type) > -1
              "
              key="invite"
              @click="openInviteDialog()"
            >
              <v-list-tile-content>
                <v-list-tile-title>Invite artist/brand</v-list-tile-title>
                <v-list-tile-sub-title>Invite your team</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile key="support" @click="goSupport">
              <v-list-tile-content>
                <v-list-tile-title>Support</v-list-tile-title>
                <v-list-tile-sub-title>Help docs</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile key="signout" @click="signOut">
              <v-list-tile-content>
                <v-list-tile-title>Sign Out</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar>
      <div class="search-box">
        <div class="search-container">
          <span class="icon">
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 28 28"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <!-- Generator: Sketch 45.2 (43514) - http://www.bohemiancoding.com/sketch -->
              <title>Group 22</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g
                id="Design"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  id="searchIcon"
                  transform="translate(-732.000000, -61.000000)"
                  stroke="#FFFFFF"
                  stroke-width="1.5999999"
                >
                  <g id="Group-29" transform="translate(710.000000, 50.000000)">
                    <g
                      id="Group-22"
                      transform="translate(23.000000, 12.000000)"
                    >
                      <circle
                        id="Oval-2"
                        cx="11.375"
                        cy="11.375"
                        r="11.375"
                      ></circle>
                      <path
                        d="M19.5,19.5 L25.59375,25.59375"
                        id="Line"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          </span>
          <input
            class="search-field"
            type="search"
            id="search"
            v-model="keyword"
            placeholder="Search artist, song or keyword"
            @keyup.enter="goToSearch()"
          />
        </div>
      </div>
    </v-flex>

    <v-flex v-else xs12 sm10 offset-sm1>
      <v-toolbar class="header">
        <router-link to="/album"
          ><v-toolbar-title></v-toolbar-title
        ></router-link>
        <v-spacer></v-spacer>
        <v-btn flat class="my-0" @click.native="choosePage('login')"
          >Login</v-btn
        >
        <!-- <router-link to="/login">Login</router-link> -->
        <v-btn
          dark
          round
          color="green"
          class="my-0"
          @click.native="choosePage('register')"
          >Sign Up</v-btn
        >
      </v-toolbar>
    </v-flex>

    <v-dialog
      v-model="show_invite_dialog"
      content-class="invite-dialog"
      width="440"
    >
      <v-card>
        <v-card-title class="headline">Invite Artist/Brand</v-card-title>
        <v-card-text
          >Link expires in 72 hours and can only be used once</v-card-text
        >
        <v-card-actions>
          <v-btn dark block color="black" @click.native="createInvitation()"
            ><v-icon class="mr-3">fa-link</v-icon> Copy Link</v-btn
          >
        </v-card-actions>
        <div v-show="link_copied" class="link-copied">link has been copied</div>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script type="text/javascript" src="./header.ctrl.js"></script>
