<template>
  <v-layout row wrap class="page messages-page">
    <v-flex xs12 sm12 class="messages-stop-music-section" v-if="show_stopPopup">
      <div class="popup-section">
        <img class="popup-image" src="/static/images/earphone.png"/>
        <p class="popup-title">Direct Messages</p>
        <p class="popup-text">Direct messages is where you can share music + product directly, view repost requests & approve collaborations.</p>
        <v-btn class="gotta-btn" @click.native="setVisitedTime()">Ok. Got it!</v-btn>
      </div>
    </v-flex>

    <!-- <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 class="messages-page-header">
      <v-flex xs12>
        <v-layout row wrap>
          <h2 class="page-title">Messages</h2>
        </v-layout>
        <v-layout row wrap>
          <a href="/settings">
            <label class="settings-text">You can receive message from anyone.</label><v-icon class="settings-icon">settings</v-icon>
          </a>
        </v-layout>
      </v-flex>
    </v-flex> -->

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 class="messages-page-content" v-if="currentUser">
      <v-layout row>
        <v-flex xs12 pa-0 v-if="!conversations || conversations.length == 0" class="message-rooms-section empty-section">
          <p class="empty-title">No messages</p>
          <p class="empty-description">Your conversations will appear here.</p>
        </v-flex>
        <template v-else>
          <v-flex xs12 sm3 pa-0 class="conversations">
            <div class="conversations__header">
              <div class="conversations__title">Inbox</div>
              <div class="conversations__count">{{ conversations.length }} messages</div>
              <!-- <div class="search-box">
                <div class="search-container">
                  <span class="icon">
                    <svg width="20px" height="20px" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <title>Group 22</title>
                      <desc>Created with Sketch.</desc>
                      <defs></defs>
                      <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="searchIcon" transform="translate(-732.000000, -61.000000)" stroke="#FFFFFF" stroke-width="1.5999999">
                          <g id="Group-29" transform="translate(710.000000, 50.000000)">
                            <g id="Group-22" transform="translate(23.000000, 12.000000)">
                              <circle id="Oval-2" cx="11.375" cy="11.375" r="11.375"></circle>
                              <path d="M19.5,19.5 L25.59375,25.59375" id="Line" stroke-linecap="round" stroke-linejoin="round"></path>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <input class="search-field" type="search" id="search" placeholder="Search message" />
                </div>
              </div>
              <v-menu offset-y class="more-menu">
                <v-btn dark slot="activator">
                  <v-icon right>more_horiz</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile key="all" class="default-menu-item" @click.native="showAllMessages()">
                    <v-list-tile-title>
                      <img class="track-status-icon" src="/static/images/ic_repeat.png" />
                      <label>All Messages</label>
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile key="request" class="default-menu-item" @click.native="showRepostRequests()">
                    <v-list-tile-title>
                      <img class="track-status-icon" src="/static/images/ic_download.png" />
                      <label>Repost Requests Only</label>
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu> -->
            </div>
            <div class="conversations__content">
              <div
                v-for="conv in conversations"
                @click="selectedConversation(conv)"
                :key="`conversation-${conv.id}`"
                :class="{'new': conv.last_message && !conv.last_message.is_read, 'selected': conv.id == conversation.id}"
                class="message-room-item"
              >
                <div class="avatar-area">
                  <router-link :to="`/${conv.other.slug}`"><div class="avatar-image" :style="'background-image: url(' + conv.other.avatar.thumb.url + ');'" v-if="!conv.other.length"></div></router-link>
                </div>
                <div class="detail-area">
                  <!-- <router-link class="user-name" :to="'/' + conv.other.slug">{{ conv.other.display_name }}</router-link> -->
                  <div class="user-name">{{ conv.other.display_name }}</div>
                  <div class="short-message">{{ conv.last_message.body }}</div>
                </div>
                <div class="messaged-time">{{ toLocalTimeString(conv.last_message.created_at) }}</div>
              </div>
            </div>
          </v-flex>
          <v-flex
            v-if="conversation && conversation.id > 0"
            xs12 pa-0
            :class="{'sm6': currentUser.user_type === 'artist', 'sm9': currentUser.user_type !== 'artist'}"
            class="message-content-section"
          >
            <div class="header-section">
              <p class="user-name">
                {{ conversation.other.display_name }}
                <v-icon
                  v-if="conversation.other.user_type == 'artist'"
                  class="user-status"
                  :class="{'online': conversation.other.status == 'active'}">fa-check-circle</v-icon>
              </p>
              <!-- <p class="messaged-time">{{ toLocalTimeString(conversation.last_message.created_at) }}</p> -->
              <p class="messaged-time">Repost Price: ${{ conversation.other.repost_price | formatNumber }}</p>
              <v-menu offset-y class="more-menu">
                <v-btn dark slot="activator">
                  <v-icon right>more_horiz</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile key="all" class="default-menu-item" @click.native="openConversationDeleteConfirmDialog(conversation)">
                    <v-list-tile-title>
                      <!-- <img class="track-status-icon" src="/static/images/ic_repeat.png" /> -->
                      <label>Delete entire message</label>
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile key="block" class="default-menu-item" @click.native="openBlockUserConfirmDialog()">
                    <v-list-tile-title>
                      <!-- <img class="track-status-icon" src="/static/images/ic_download.png" /> -->
                      <label>Block User</label>
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>
            <div class="message-list-section" v-if="messages && messages.length > 0">
              <message
                v-for="message in messages"
                :key="message.id"
                :message="message"
                :is-own="conversation.other.id == message.sender.id ? 'other' : 'self'"
              />
            </div>
            <div class="send-message-section">
              <input v-model.trim="message.body"
                type="text"
                maxlength="500"
                class="message-input-box"
                placeholder="Write a message..."
                @keyup.enter="checkMessage()"
                ref="message"
                autofocus
              />
              <picker v-if="showEmojiPicker"
                title="Pick your emoji…"
                emoji="point_up"
                class="emoji-picker"
                @click="addEmoji"
                v-on-click-outside="hideEmojiDialog"
              ></picker>
              <v-btn
                class="show-emoji-box-btn"
                :class="{'selected': showEmojiPicker}"
                @click.native="showEmojiDialog()"
              ><v-icon>tag_faces</v-icon></v-btn>
              <v-btn
                @click.native="checkMessage()"
                :disabled="!message.body"
                class="send-message-btn"
              >Send</v-btn>
            </div>
          </v-flex>

          <v-flex
            v-if="['artist', 'brand', 'label'].indexOf(currentUser.user_type) > -1"
            xs12 sm3 pa-0
            class="requests"
          >
            <div class="requests__header">
              <p class="requests__title">Request repost</p>
              <div class="requests__actions">
                <v-btn
                  v-if="['artist', 'label'].indexOf(currentUser.user_type) > -1"
                  @click.native="onTab('album')"
                  :class="{'btn--active': tab == 'album'}"
                >Album</v-btn>
                <v-btn
                  v-if="['artist', 'brand', 'label'].indexOf(currentUser.user_type) > -1"
                  @click.native="onTab('merch')"
                  :class="{'btn--active': tab == 'merch'}"
                >Product</v-btn>
              </div>
            </div>
            <div class="requests__content">
              <template v-if="tab == 'album'">
                <div
                  v-for="album in albums"
                  :key="album.id"
                  @click="InBanned(album) ? null : selectItem(album)"
                  class="request-item"
                  :class="{'selected': item == album, 'banned': InBanned(album)}"
                >
                  <div class="avatar-area">
                    <div class="avatar-image" :style="`background-image: url(${album.cover.thumb.url})`"></div>
                  </div>
                  <div class="detail-area">
                    <label class="item-name">{{ album.name }}</label>
                    <label class="user-name">{{ album.user.display_name }}</label>
                  </div>
                </div>
              </template>

              <template v-else-if="tab == 'merch'">
                <div
                  v-for="product in products"
                  :key="product.id"
                  @click="InReposted(product) ? null : selectItem(product)"
                  class="request-item"
                  :class="{'selected': item == product, 'banned': InReposted(product)}"
                >
                  <div class="avatar-area">
                    <div class="avatar-image" :style="`background-image: url(${product.covers[0].cover.thumb.url})`"></div>
                  </div>
                  <div class="detail-area">
                    <label class="item-name">{{ product.name }}</label>
                    <label class="user-name">{{ product.merchant.display_name }}</label>
                  </div>
                </div>
              </template>
            </div>
          </v-flex>
        </template>
      </v-layout>
    </v-flex>

    <repost-payment-modal
      v-if="show_repost_payment_modal"
      :item="item"
      :itemType="tab"
      :user="conversation.other"
      :dismiss="closeRepostPaymentModal"
      :finish="sendMessage"
    />

    <v-dialog v-model="show_block_user_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Block a User</v-card-title>
        <v-card-text>Are you sure you want to block &lt;{{ other_name }}&gt;?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="blockUser()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="closeBlockUserConfirmDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="show_conversation_delete_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Delete a Conversation</v-card-title>
        <v-card-text>If you click OK, all messages under the conversation will be deleted. Click OK to delete a conversation with &lt;{{ other_name }}&gt;, or click Cancel.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="deleteEntireMessage()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="closeConversationDeleteConfirmDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
