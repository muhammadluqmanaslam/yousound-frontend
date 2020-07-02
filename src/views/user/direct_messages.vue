<template>
  <v-layout row wrap class="page messages-page">
    <v-flex
      v-if="$store.state.auth.user"
      xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1
      class="messages-page-content"
    >
      <v-layout row>
        <v-flex
          v-if="!conversations || conversations.length == 0"
          xs12 pa-0
          class="message-rooms-section empty-section"
        >
          <p class="empty-title">No messages</p>
          <p class="empty-description">Conversations will appear here.</p>
        </v-flex>
        <template v-else>
          <v-flex xs12 sm3 pa-0 class="conversations">
            <div class="conversations__header">
              <div class="conversations__title">Inbox</div>
              <div class="conversations__count">{{ conversations.length }} messages</div>
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
                  <label class="user-name">{{ conv.other.display_name }}</label>
                  <label class="short-message">{{ conv.last_message.body }}</label>
                </div>
                <label class="messaged-time">{{ toLocalTimeString(conv.last_message.created_at) }}</label>
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
                  :class="{'online': conversation.other.status == 'active'}"
                >fa-check-circle</v-icon>
              </p>
              <p class="messaged-time">Repost Price: ${{ conversation.other.repost_price | formatNumber }}</p>
            </div>
            <div class="message-list-section" v-if="messages && messages.length > 0">
              <message
                v-for="message in messages"
                :key="message.id"
                :message="message"
                :is-own="conversation.other.id != message.sender.id"
                @updated="refreshMessages"
              />
            </div>
          </v-flex>
        </template>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript" src="./direct_messages.ctrl.js"></script>
