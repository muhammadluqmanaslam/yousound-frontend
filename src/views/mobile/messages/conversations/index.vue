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
        @click="selectConv(conv)"
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
        content-class="dm-dialog no-border-radius"
        transition="slide-up"
    >
        <DM v-if="DM_active" :conv="selectedConversation" @closeDM="closeDM" />
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>
<style src="../../../../../static/styles/mobile/messages.scss" lang="scss" scoped></style>
