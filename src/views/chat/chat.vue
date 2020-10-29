<template>
  <div class="page chat-page">
    <!--<v-flex xs12 sm12 class="chat-popup" v-if="show_broadcastPopup">-->
    <!--<div class="popup-section">-->
    <!--<img class="popup-image" src="/static/images/earphone.png"/>-->
    <!--<p class="popup-title">Get ready to broadcast!</p>-->
    <!--<p class="popup-text">When users select your broadcast, they will hear everything you play.</p>-->
    <!--<v-btn class="gotta-btn" @click.native="startBroadcasting()">Start broadcasting</v-btn>-->
    <!--</div>-->
    <!--</v-flex>-->

    <!--<v-flex xs12 sm12 class="chat-popup listen" v-if="show_confirmPopup">-->
    <!--<div class="popup-section">-->
    <!--<p class="popup-title">You are about to listen to</p>-->
    <!--<div class="artist-section">-->
    <!--<div class="user-avatar-image" :style="`background-image: url(${$store.state.auth.user.avatar.url})`"></div>-->
    <!--<label class="user-name">{{ $store.state.auth.user.display_name }}-->
    <!--<v-icon class="user-status" -->
    <!--v-bind:class="{'online': $store.state.auth.user.status == 'active'}" -->
    <!--v-if="$store.state.auth.user.user_type == 'artist'"-->
    <!--&gt;fa-check-circle</v-icon>-->
    <!--</label>-->
    <!--</div>-->
    <!--<p class="popup-text">When users select your broadcast, they will hear everything you play.</p>-->
    <!--<v-btn class="gotta-btn" @click.native="startListenning()">Yes, I want to listen!</v-btn>-->
    <!--</div>-->
    <!--</v-flex>-->

    <v-snackbar
      :timeout="0"
      :bottom="true"
      :right="true"
      :multi-line="false"
      :vertical="false"
      v-model="disconnected"
    >
      Connecting...
    </v-snackbar>
    <v-snackbar v-model="isMessageErr" :color="'error'" :timeout="5000">
      {{ messageError }}
    </v-snackbar>
    <transition name="fade">
      <v-flex xs12 sm12 class="chat-popup requests" v-if="show_requestPopup">
        <div class="dismiss-section" @click="show_requestPopup = false"></div>
        <div class="popup-section">
          <div class="requests-section">
            <div class="header-section">
              <p class="section-title">Attach content to chat</p>
              <div class="option-area">
                <v-btn
                  class="request-option-btn"
                  :class="{ selected: request_tab == 'album' }"
                  @click.native="onRequestTab('album')"
                  >Album</v-btn
                >
                <v-btn
                  class="request-option-btn"
                  :class="{ selected: request_tab == 'merch' }"
                  @click.native="onRequestTab('merch')"
                  >Product</v-btn
                >
                <v-btn
                  class="request-option-btn"
                  :class="{ selected: request_tab == 'users' }"
                  @click.native="onRequestTab('users')"
                  >User</v-btn
                >
              </div>
            </div>
            <div class="content-section" v-if="request_tab == 'album'">
              <div
                class="request-item"
                :class="{ selected: item_index == index }"
                v-for="(album, index) in albums"
                :key="index"
                @click="selectItemIndex(index)"
              >
                <div class="avatar-area">
                  <div
                    class="avatar-image"
                    :style="`background-image: url(${album.cover.thumb.url})`"
                  ></div>
                </div>
                <div class="detail-area">
                  <label class="item-name">{{ album.name }}</label>
                  <label class="user-name">{{ album.user.display_name }}</label>
                </div>
              </div>
            </div>
            <div class="content-section" v-if="request_tab == 'merch'">
              <div
                class="request-item"
                :class="{ selected: item_index == index }"
                v-for="(product, index) in products"
                :key="index"
                @click="selectItemIndex(index)"
              >
                <div class="avatar-area">
                  <div
                    class="avatar-image"
                    :style="`background-image: url(${product.covers[0].cover.thumb.url})`"
                  ></div>
                </div>
                <div class="detail-area">
                  <label class="item-name">{{ product.name }}</label>
                  <label class="user-name">{{
                    product.merchant.display_name
                  }}</label>
                </div>
              </div>
            </div>
            <div class="content-section" v-if="request_tab == 'users'">
              <!-- <v-layout row wrap class="popup-section"> -->
              <v-flex xs12 class="title-section">
                <!-- <h2 class="text-xs-center">hi</h2> -->
                <v-flex xs12 class="search-section">
                  <div class="search-box">
                    <div class="search-container">
                      <span class="icon">
                        <img src="/static/images/ic_search.svg" width="20" />
                      </span>
                      <input
                        class="search-field"
                        v-model="userSearchKeyword"
                        type="search"
                        id="search"
                        placeholder="Search"
                        @keyup.enter="loadUsers()"
                      />
                    </div>
                  </div>
                </v-flex>
              </v-flex>
              <v-flex xs12 class="list-section">
                <v-flex
                  v-for="(user, index) in users"
                  xs12
                  class="user-item"
                  :key="index"
                  @click.self="onSelectUser(user)"
                >
                  <div
                    class="avatar-image"
                    @click="onSelectUser(user)"
                    :style="{
                      'background-image': 'url(' + user.avatar.thumb.url + ')',
                    }"
                  ></div>
                  <label class="user-name" @click="onSelectUser(user)">
                    {{ user.display_name }}
                    <v-icon
                      v-if="user.user_type == 'artist'"
                      class="user-status"
                      :class="{ online: user.status == 'active' }"
                      >fa-check-circle</v-icon
                    >
                  </label>
                </v-flex>
              </v-flex>
              <!-- </v-layout> -->
            </div>
          </div>
        </div>
      </v-flex>
    </transition>

    <v-flex xs12 sm10 offset-sm1 v-if="user">
      <h2 class="page-title">{{ user.display_name }}</h2>
      <label class="chat-room">CHAT ROOM ({{ room.online.length }})</label>
      <v-btn
        v-if="show_stream_live_button"
        class="live-btn px-1"
        outline
        round
        @click.native="viewStream()"
      >
        <i class="fa fa-circle"></i>
        <span class="live">Live</span>
      </v-btn>
    </v-flex>
    <v-flex xs12 sm10 offset-sm1 class="chat-page-content" v-if="user">
      <v-layout row>
        <v-flex xs12 sm9 pa-0 class="chat-content-section">
          <div
            v-chat-scroll="{ always: false, smooth: false }"
            id="msg-container"
            class="chat-list-section"
          >
            <div
              style="
                font-weight: 600;
                margin-left: 8px;
                font-size: 16px;
                padding-bottom: 5px;
              "
              v-bind:style=""
            >
              <P>
                Start chatting! Chat conversations are deleted permanently every
                24 hours. Be respectful.
              </P>
            </div>
            <v-divider :inset="inset"></v-divider>

            <!-- <div class="chat-item space" v-for="message in conversation.messages" :class="conversation.other.id == message.sender.id ? 'other' : 'self'">
              <div class="messaged-time">{{ toLocalTimeString(message.created_at) }}</div>
              <div class="message-section">
                <div class="user-avatar-image" :style="{'background-image': 'url(' + message.sender.avatar.thumb.url + ')'}"></div>
                <div class="message-content text">
                  <label class="text-message">{{ message.body }}</label>
                </div>
                <div class="clear"></div>
              </div>
            </div> -->
            <center>
              <transition name="fade">
                <v-progress-circular
                  class="progress-circular"
                  v-if="disconnected"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </transition>
            </center>
            <!-- <transition-group name="fade"> -->
            <div
              class="chat-item other"
              v-for="message in reverseMessages"
              v-bind:key="message.id"
            >
              <div
                class="user-avatar-image"
                :style="
                  'background-color: gray; background-image: url(' +
                  (message.fromUser
                    ? message.fromUser.avatar.url
                    : new String()) +
                  ');'
                "
              ></div>
              <div class="chat-section">
                <div class="info-section">
                  <router-link :to="'/' + message.from" class="item-user">{{
                    message.fromUser
                      ? message.fromUser.display_name
                      : message.from
                  }}</router-link>
                  <label class="messaged-time">{{
                    moment(message.time).calendar()
                  }}</label>
                </div>
                <div class="chat-content text">
                  <label
                    v-if="!isAttachmentLink(message.text)"
                    class="text-message"
                    >{{ message.text }}</label
                  >
                  <!-- <div v-if="isAttachmentLink(message.text) && (!albumLinks[message.text] && !merchLinks[message.text])">Loading...</div> -->
                  <div
                    class="album-embed-wrapper"
                    v-if="isAlbumLink(message.text) && albumLinks[message.text]"
                  >
                    <activity-album-card
                      :object="albumLinks[message.text]"
                      class="chat-album-embed"
                    />
                    <div class="info-section">
                      <router-link
                        :to="'/album/' + albumLinks[message.text].slug"
                        ><label class="item-title">{{
                          albumLinks[message.text].name
                        }}</label></router-link
                      >
                      <br />
                      <router-link
                        :to="'/' + albumLinks[message.text].user.slug"
                        class="item-user"
                        >{{
                          albumLinks[message.text].user.display_name
                        }}</router-link
                      >
                    </div>
                  </div>
                  <div
                    class="album-embed-wrapper"
                    v-if="isMerchLink(message.text) && merchLinks[message.text]"
                  >
                    <activity-product-card
                      :object="merchLinks[message.text]"
                      class="chat-album-embed"
                    />
                    <div class="info-section">
                      <label class="item-title">{{
                        merchLinks[message.text].name
                      }}</label>
                      <br />
                      <router-link
                        :to="'/' + merchLinks[message.text].merchant.slug"
                        class="item-user"
                        >{{
                          merchLinks[message.text].merchant.display_name
                        }}</router-link
                      >
                    </div>
                  </div>
                  <div
                    class="album-embed-wrapper"
                    v-if="isUserLink(message.text) && userLinks[message.text]"
                  >
                    <activity-user-card
                      :object="userLinks[message.text]"
                      class="chat-album-embed"
                    />
                    <div class="info-section" v-if="!!userLinks[message.text]">
                      <label class="item-title">{{
                        userLinks[message.text].display_name
                      }}</label>
                      <br />
                      <router-link
                        :to="'/' + userLinks[message.text].slug"
                        class="item-user"
                        >{{
                          userLinks[message.text].followers | formatLargeNumber
                        }}
                        followers</router-link
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="clear"></div>
            </div>
            <!-- </transition-group> -->
          </div>

          <div class="send-chat-section">
            <v-btn
              v-if="connected"
              @click.native="show_requestPopup = true"
              :class="{ selected: show_broadcastPopup }"
              class="show-attachment-box-btn"
            >
              <img src="/static/images/ic_attach_add.svg" width="36" />
            </v-btn>
            <input
              v-model="message"
              @keyup.enter="sendMessage(message)"
              ref="chat"
              type="text"
              class="chat-input-box"
              placeholder="Write a message..."
              autofocus
            />
            <picker
              v-if="showEmojiPicker"
              @click="addEmoji"
              title="Pick your emoji…"
              emoji="point_up"
              class="emoji-picker"
            ></picker>
            <v-btn
              class="show-emoji-box-btn"
              :class="{ selected: showEmojiPicker }"
              @click.native="showEmojiPicker = !showEmojiPicker"
            >
              <v-icon>tag_faces</v-icon>
            </v-btn>
            <v-btn class="send-chat-btn" @click.native="sendMessage(message)"
              >Send</v-btn
            >
          </div>
        </v-flex>

        <v-flex xs12 sm3 pa-0 class="requests-section">
          <!-- <div class="header-section" :class="{'streaming': show_stream_live_button}">
            <div class="option-area">
              <v-btn class="request-option-btn" @click.native="meberList=true" :class="{'selected': meberList}"><v-icon>supervisor_account</v-icon></v-btn>
              <v-btn class="request-option-btn" @click.native="meberList=false" :class="{'selected': !meberList}"><v-icon>fa-at</v-icon></v-btn>
            </div>
          </div> -->
          <div class="content-section" v-if="meberList">
            <center>
              <v-progress-circular
                v-if="disconnected"
                indeterminate
                color="primary"
                class="progress-circular"
              />
            </center>
            <div v-if="connected" class="member-group">MODERATOR</div>
            <transition-group name="fade">
              <div
                v-for="adminUser in adminUsers"
                :key="`admin-${adminUser.username}`"
                class="member-item"
              >
                <div class="avatar-area">
                  <div
                    class="avatar-image"
                    :style="
                      'background-image: url(' + adminUser.avatar.url + ');'
                    "
                  ></div>
                  <div
                    class="memeber-status"
                    :class="
                      room.online.indexOf(adminUser.slug) > -1
                        ? 'online'
                        : room.idle.indexOf(adminUser.slug) > -1
                        ? 'idle'
                        : 'offline'
                    "
                  ></div>
                </div>
                <div class="detail-area">
                  <router-link :to="'/' + adminUser.slug" class="user-name">{{
                    adminUser.display_name
                  }}</router-link>
                </div>
              </div>
            </transition-group>
            <transition-group name="fade">
              <div
                v-if="onlineUsers.length"
                :key="'onlineHeader'"
                class="member-group mt-3"
              >
                ONLINE: {{ room.online.length }}
              </div>
              <div
                v-for="onlineUser in onlineUsers"
                v-if="onlineUsers.length"
                :key="`online-${onlineUser.username}`"
                class="member-item"
              >
                <div class="avatar-area">
                  <div
                    class="avatar-image"
                    :style="
                      'background-image: url(' + onlineUser.avatar.url + ');'
                    "
                  ></div>
                  <div class="memeber-status online"></div>
                </div>
                <div class="detail-area">
                  <router-link
                    v-if="onlineUser"
                    :to="'/' + onlineUser.slug"
                    class="user-name"
                    >{{ onlineUser.display_name }}</router-link
                  >
                </div>
              </div>
              <div
                v-if="idleUsers.length"
                :key="'idleHeader'"
                class="member-group mt-3"
              >
                IDLE: {{ room.idle.length }}
              </div>
              <div
                v-for="idleUser in idleUsers"
                v-if="idleUsers.length"
                :key="`idle-${idleUser.username}`"
                class="member-item"
              >
                <div class="avatar-area">
                  <div
                    class="avatar-image"
                    :style="
                      'background-image: url(' + idleUser.avatar.url + ');'
                    "
                  ></div>
                  <div class="memeber-status idle"></div>
                </div>
                <div class="detail-area">
                  <router-link
                    v-if="idleUser"
                    :to="'/' + idleUser.slug"
                    class="user-name"
                    >{{ idleUser.display_name }}</router-link
                  >
                </div>
              </div>
            </transition-group>
            <v-menu
              v-if="admin"
              class="settings-menu"
              down
              offset-y
              :nudge-top="-5"
              :close-on-content-click="false"
            >
              <v-btn round class="settings-btn" slot="activator">
                <v-icon dark right>more_horiz</v-icon>
              </v-btn>
              <v-list two-line>
                <v-list-tile class="settings-list-tile">
                  <v-list-tile-content class="default-menu-item">
                    <v-list-tile-title
                      >Allow users to attach content</v-list-tile-title
                    >
                    <v-switch
                      v-model="room.settings.attachments"
                      @change="updateSettings()"
                      hide-details
                      class="pl-3"
                    ></v-switch>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile class="settings-list-tile">
                  <v-list-tile-content class="default-menu-item">
                    <v-list-tile-title
                      >Allow users to send links</v-list-tile-title
                    >
                    <v-switch
                      v-model="room.settings.links"
                      @change="updateSettings()"
                      hide-details
                      class="pl-3"
                    ></v-switch>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile class="settings-list-tile">
                  <v-list-tile-content class="default-menu-item">
                    <v-list-tile-title
                      >Enable a character limit</v-list-tile-title
                    >
                    <v-switch
                      v-model="room.settings.charLimitBool"
                      @change="updateSettings()"
                      hide-details
                      class="pl-3"
                    ></v-switch>
                    <!-- <v-text-field v-if="room.settings.charLimitBool" placeholder="# of characters" v-model="room.settings.charLimit" :rules="[rules.number]"></v-text-field> -->
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-menu>
          </div>
        </v-flex>
      </v-layout>
      <!-- <div class="full-height" style="position: relative;">
        <div id="msg-container">
          <center>
            <v-progress-circular v-if="!last" indeterminate class="primary--text text-xs-center"></v-progress-circular>
          </center>
          <div v-for="(message, i) in reverseMessages" :key="message.localId">
            <message :message="message" :i="i" :messages="reverseMessages"></message>
          </div>
          <div v-for="(message, i) in sendingMessages" :key="message.localId">
            <message :sending="true" :message="message" :i="i" :messages="reverseMessages"></message>
          </div>
        </div>
        <br>
        <br>
        <message-input :user="user" :settings="room.settings" v-on:submit="sendMessage"></message-input>
      </div> -->
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./chat.ctrl.js"></script>

<style scoped>
/*.progress-circular {
}

.default-menu-item {
  display: block;
  position: relative;
  left: -10px;
}

settings-list-tile {
  padding-bottom: 10px;
  padding-top: 10px;
}*/
</style>
