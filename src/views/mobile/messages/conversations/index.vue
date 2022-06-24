<template>
  <div class="messages-page">
    <v-flex
      v-if="!conversations || conversations.length == 0"
      xs12
      pa-0
      class="no-message"
    >
      <p class="__text">You have no messages</p>
    </v-flex>

    <div v-if="!DM_active" class="conversations">
      <div
        v-for="(conv, i) in conversations"
        :key="i"
        :class="{
          new: conv.last_message && !conv.last_message.is_read,
          selected: conv.id == conversation.id,
        }"
        class="conversation message-room-item"
        @click="selectConversation(conv)"
      >
        <user-tag :user="conv.other" width="55" height="55" showAvatar hideName hideTick :clickUser="false" />

        <div class="conversation-preview">
            <user-tag :user="conv.other" :clickUser="false" />
            <div class="last-message" v-html="conv.last_message.body"></div>
        </div>

        <!-- <div class="detail-area">
          <div class="user-name">{{ conv.other.username }}</div>
          <div class="short-message" v-html="conv.last_message.body"></div>
        </div> -->

        <!-- <div class="messaged-time">
          {{ toLocalTimeString(conv.last_message.created_at) }}
        </div> -->
      </div>
    </div>

    <v-dialog
        v-model="DM_active"
        fullscreen
        content-class="dm-dialog"
    >
        <DM :conv="selectedConversation" @closeDM="closeDM" />
    </v-dialog>

    <!-- <v-container
      fluid
      grid-list-md
      class="messages-page-content"
      v-if="currentUser"
    >
      <v-layout wrap row>
        <template>
          <v-flex xs12 sm3 pa-0 class="conversations">
            <div class="conversations__header">
              <div class="conversations__count">
                <span class="__count">
                  {{
                    conversations.length < 99 ? conversations.length : "99+"
                  }}</span
                >
                messages
              </div>
            </div>
            <div class="conversations__content">
              <div
                v-for="conv in conversations"
                @click="selectedConversation(conv)"
                :key="`conversation-${conv.id}`"
                :class="{
                  new: conv.last_message && !conv.last_message.is_read,
                  selected: conv.id == conversation.id,
                }"
                class="message-room-item"
              >
                <div class="avatar-area">
                  <router-link :to="`/${conv.other.slug}`">
                    <div
                      class="avatar-image"
                      :style="
                        'background-image: url(' +
                        conv.other.avatar.thumb.url +
                        ');'
                      "
                      v-if="!conv.other.length"
                    ></div>
                  </router-link>
                </div>
                <div class="detail-area">
                  <div class="user-name">{{ conv.other.username }}</div>
                  <div
                    class="short-message"
                    v-html="conv.last_message.body"
                  ></div>
                </div>
                <div class="messaged-time">
                  {{ toLocalTimeString(conv.last_message.created_at) }}
                </div>
              </div>
            </div>
          </v-flex>

          <v-flex
            v-if="conversation && conversation.id > 0"
            xs12
            sm9
            pa-0
            class="message-content-section"
          >
            <div class="header-section">
              <p class="user-name">
                {{ conversation.other.username }}
                <v-icon
                  v-if="conversation.other.user_type == 'artist'"
                  class="user-status"
                  :class="{ online: conversation.other.status == 'active' }"
                  >fa-check-circle</v-icon
                >
              </p>
              <p class="messaged-time">
                Repost Price: ${{
                  conversation.other.repost_price | formatNumber
                }}
              </p>
              <v-menu offset-y class="more-menu">
                <v-btn dark slot="activator">
                  <v-icon right>more_horiz</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile
                    key="all"
                    class="default-menu-item"
                    @click.native="
                      openConversationDeleteConfirmDialog(conversation)
                    "
                  >
                    <v-list-tile-title>
                      <label>Delete entire message</label>
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile
                    key="block"
                    class="default-menu-item"
                    @click.native="openBlockUserConfirmDialog()"
                  >
                    <v-list-tile-title>
                      <label>Block User</label>
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>
            <div
              class="message-list-section"
              v-if="messages && messages.length > 0"
            >
              <message
                v-for="message in messages"
                :key="message.id"
                :message="message"
                :is-own="conversation.other.id != message.sender.id"
                @updated="refreshMessages"
              />
            </div>

            <div class="send-message-section">
              <input
                v-model.trim="message.body"
                type="text"
                maxlength="500"
                class="message-input-box"
                placeholder="Write a message..."
                @keyup.enter="checkMessage()"
                ref="message"
                autofocus
              />
              <picker
                v-if="showEmojiPicker"
                title="Pick your emoji…"
                emoji="point_up"
                class="emoji-picker"
                @click="addEmoji"
                v-on-click-outside="hideEmojiDialog"
              ></picker>
              <v-btn
                :ripple="false"
                depressed
                width="10"
                class="repost-btn no-Btn-bg transparent mr-2"
                @click="openRepostModal()"
              >
                <img src="/static/images/ic_repost.svg" width="20" />
              </v-btn>
              <v-btn
                v-if="otherStripeConnected"
                class="send-love-btn"
                @click="openSendLoveModal()"
              >
                <img src="/static/images/ic_send_love.png" />
              </v-btn>
              <v-btn
                class="show-emoji-box-btn"
                :class="{ selected: showEmojiPicker }"
                @click.native="showEmojiDialog()"
                ><v-icon>tag_faces</v-icon></v-btn
              >
              <v-btn
                @click.native="checkMessage()"
                :disabled="!message.body"
                class="send-message-btn"
                >Send</v-btn
              >
            </div>
          </v-flex>
        </template>
      </v-layout>
    </v-container> -->

    <v-dialog v-model="show_repost_modal">
      <v-card class="pa-5">
        <div
          v-if="
            ['artist', 'brand', 'label'].indexOf(currentUser.user_type) > -1
          "
          xs12
          sm3
          pa-0
          class="requests"
        >
          <template v-if="otherStripeConnected">
            <div class="requests__header">
              <div class="requests__actions">
                <div class="requests__title">Repost Request</div>
                <div class="d-flex justify-content-center">
                  <v-btn
                    v-if="
                      ['artist', 'label'].indexOf(currentUser.user_type) > -1
                    "
                    @click.native="onTab('album')"
                    :class="{ 'btn--active': tab == 'album' }"
                    >Album</v-btn
                  >
                  <v-btn
                    v-if="
                      ['artist', 'brand', 'label'].indexOf(
                        currentUser.user_type
                      ) > -1
                    "
                    @click.native="onTab('merch')"
                    :class="{ 'btn--active': tab == 'merch' }"
                    >Product</v-btn
                  >
                </div>
              </div>
            </div>
            <div class="requests__content">
              <template v-if="tab == 'album'">
                <div
                  v-for="album in albums"
                  :key="album.id"
                  @click="InBanned(album) ? null : selectItem(album)"
                  class="request-item"
                  :class="{
                    selected: item == album,
                    banned: InBanned(album),
                  }"
                >
                  <div class="avatar-area">
                    <div
                      class="avatar-image"
                      :style="`background-image: url(${album.cover.thumb.url})`"
                    ></div>
                  </div>
                  <div class="detail-area">
                    <label class="item-name">{{ album.name }}</label>
                    <label class="user-name">{{ album.user.username }}</label>
                  </div>
                </div>
              </template>

              <template v-else-if="tab == 'merch'">
                <div
                  v-for="product in products"
                  :key="product.id"
                  @click="InReposted(product) ? null : selectItem(product)"
                  class="request-item"
                  :class="{
                    selected: item == product,
                    banned: InReposted(product),
                  }"
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
                      product.merchant.username
                    }}</label>
                  </div>
                </div>
              </template>
            </div>
          </template>
          <template v-else>
            <div class="requests__body">
              <h5>Repost Request</h5>
              <p>
                To promote albums and products<br />
                receiver must first connect to Stripe
              </p>
            </div>
          </template>
        </div>
      </v-card>
    </v-dialog>

    <repost-payment-modal
      v-if="show_repost_payment_modal"
      :item="item"
      :itemType="tab"
      :receiver="conversation.other"
      :dismiss="closeRepostPaymentModal"
      :finish="sendMessage"
    />

    <send-love-modal
      v-if="show_send_love_modal"
      :item="conversation.other"
      :dismiss="closeSendLoveModal"
    />

    <v-dialog v-model="show_block_user_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Block a User</v-card-title>
        <v-card-text
          >Are you sure you want to block &lt;{{ otherName }}&gt;?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="blue--text darken-1"
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

    <v-dialog v-model="show_conversation_delete_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Delete a Conversation</v-card-title>
        <v-card-text
          >If you click OK, all messages under the conversation will be deleted.
          Click OK to delete a conversation with &lt;{{ otherName }}&gt;, or
          click Cancel.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="deleteEntireMessage()"
            >Ok</v-btn
          >
          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="closeConversationDeleteConfirmDialog()"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../../../static/styles/mobile/messages.scss" lang="scss" scoped></style>
