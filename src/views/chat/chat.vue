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

    <v-flex xs12 sm12 class="chat-popup requests" v-if="show_requestPopup">-->
      <div class="popup-section">
        <div class="requests-section">
          <div class="header-section">
            <p class="section-title">Attach content to chat</p>
            <div class="option-area">
              <v-btn class="request-option-btn" :class="{'selected':request_tab=='album'}" @click.native="onRequestTab('album')">Album</v-btn>
              <v-btn class="request-option-btn" :class="{'selected':request_tab=='merch'}" @click.native="onRequestTab('merch')">Merch</v-btn>
            </div>
          </div>
          <div class="content-section" v-if="request_tab=='album'">
            <div class="request-item" :class="{'selected':item_index==index}" v-for="(album, index) in albums" :key="index" @click="selectItemIndex(index)">
              <div class="avatar-area">
                <div class="avatar-image" :style="`background-image: url(${album.cover.thumb.url})`"></div> 
              </div>
              <div class="detail-area">
                <label class="item-name">{{ album.name }}</label>
                <label class="user-name">{{ album.user.display_name }}</label>
              </div>
            </div>
          </div>
          <div class="content-section" v-if="request_tab=='merch'">
            <div class="request-item" :class="{'selected':item_index==index}" v-for="(product, index) in products" :key="index" @click="selectItemIndex(index)">
              <div class="avatar-area">
                <div class="avatar-image" :style="`background-image: url(${product.covers[0].cover.thumb.url})`"></div> 
              </div>
              <div class="detail-area">
                <label class="item-name">{{ product.name }}</label>
                <label class="user-name">{{ product.merchant.display_name }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 v-if="user">
      <h2 class="page-title">{{ user.display_name }}</h2><label class="chat-room">CHAT ROOM</label>
    </v-flex>
    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 class="chat-page-content" v-if="user">
      <v-layout row>
        <v-flex xs12 sm9 pa-0 class="chat-content-section">
          <div class="chat-list-section" id="msg-container">
            <!--<div class="chat-item space" v-for="message in conversation.messages" :class="conversation.other.id == message.sender.id ? 'other' : 'self'">-->
              <!--<div class="messaged-time">{{ toLocalTimeString(message.created_at) }}</div>-->
              <!--<div class="message-section">-->
                <!--<div class="user-avatar-image" :style="{'background-image': 'url(' + message.sender.avatar.thumb.url + ')'}"></div>-->
                <!--<div class="message-content text">-->
                  <!--<label class="text-message">{{ message.body }}</label>-->
                <!--</div>-->
                <!--<div class="clear"></div>-->
              <!--</div>-->
            <!--</div>-->
            <center>
            <v-progress-circular class="progress-circular" v-if="disconnected" indeterminate color="primary"></v-progress-circular>
            </center>

            <div class="chat-item other" v-for="message in reverseMessages" v-bind:key="message.id">
              <div class="user-avatar-image" :style="'background-color: gray; background-image: url('+ (message.fromUser ? message.fromUser.avatar.url : new String()) +');'" ></div>
              <div class="chat-section">
                <div class="info-section">
                  <a class="item-user" >{{message.fromUser ? message.fromUser.display_name : message.from}}</a>
                  <label class="messaged-time">{{moment(message.time).calendar()}}</label>
                </div>
                <div class="chat-content text">
                  <label v-if="!isAttachmentLink(message.text)" class="text-message">{{message.text}}</label>
                  <div v-if="isAttachmentLink(message.text) && (!albumLinks[message.text] && !merchLinks[message.text])">Loading...</div>
                  <div class="album-embed-wrapper" v-if="isAlbumLink(message.text) && albumLinks[message.text]">
                    <activity-album-card :object="albumLinks[message.text]" class="chat-album-embed"></activity-album-card>
                    <div class="info-section">
                      <label class="item-title">{{ albumLinks[message.text].name }}</label>
                      <br>
                      <router-link :to="'/'+albumLinks[message.text].user.slug" class="item-user">{{ albumLinks[message.text].user.display_name }}</router-link>
                    </div>
                  </div>
                  <div class="album-embed-wrapper" v-if="isMerchLink(message.text) && merchLinks[message.text]">
                    <activity-product-card :object="merchLinks[message.text]" class="chat-album-embed"></activity-product-card>
                    <div class="info-section">
                      <label class="item-title">{{ merchLinks[message.text].name }}</label>
                      <br>
                      <router-link :to="'/'+merchLinks[message.text].merchant.slug" class="item-user">{{ merchLinks[message.text].merchant.display_name }}</router-link>
                    </div>
                  </div>
                </div>
              </div>
              <div class="clear"></div>
            </div>
          </div>


          <div class="send-chat-section">
             <v-btn v-if="connected" class="show-attachment-box-btn" @click.native="show_requestPopup = true" :class="{'selected': show_broadcastPopup}">
              
            <svg width="33px" height="39px" viewBox="0 0 33 39" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 50.2 (55047) - http://www.bohemiancoding.com/sketch -->
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="25---Chat" transform="translate(-196.000000, -989.000000)">
                        <g id="Group-7" transform="translate(166.000000, 225.000000)">
                            <g id="Group-4">
                                <g id="Group-3" transform="translate(0.000000, 745.000000)">
                                    <g id="Group-14" transform="translate(48.000000, 20.000000)" stroke="#3A92FF" stroke-linecap="square" stroke-width="2">
                                        <path d="M7,8.8817842e-16 L7,14" id="Line-2"></path>
                                        <path d="M14,7 L0,7" id="Line-2"></path>
                                    </g>
                                    <g id="Group-6-Copy" transform="translate(30.000000, 31.000000)" fill="#3A92FF" fill-rule="nonzero">
                                        <path d="M18.5541482,0.776088481 L5.71682145,4.81207182 C5.38504164,4.88870442 5.51264926,5.1952348 5.51264926,5.52730938 L5.51264926,20.7771958 C4.74700353,20.4706654 4.13448694,20.3174002 3.44540579,20.3174002 C1.60785603,20.3174002 0,21.5946101 0,23.1783504 C0,24.7620907 1.42920536,26.0393007 3.26675512,26.0393007 C5.07878335,26.0393007 6.53351023,24.7876349 6.58455328,23.254983 C6.58455328,23.254983 6.45694566,10.5850607 6.45694566,10.5850607 L18.0181962,7.03441708 L18.0181962,16.2814169 C17.5077657,15.9748865 16.9718137,15.8216213 16.3082541,15.8216213 C14.4707043,15.8216213 13.0414989,17.0988312 13.0414989,18.6825715 C13.0414989,20.2663118 14.3430967,21.5435217 16.1806464,21.5435217 C18.0181962,21.5435217 19.2942724,20.2663118 19.2942724,18.6825715 C19.2942724,18.6825715 19.2942724,1.49132604 19.2942724,1.49132604 C19.2942724,1.00598627 19.0390572,0.648367489 18.5541482,0.776088481 Z" id="Music-note"></path>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
            </v-btn>
            <input
              type="text"
              class="chat-input-box"
              placeholder="Write a message..."
              v-model="message"
              @keyup.enter="sendMessage(message)"
              ref="chat"
              autofocus
            />
            <picker
              title="Pick your emoji…"
              emoji="point_up"
              class="emoji-picker"
              @click="addEmoji"
              v-if="showEmojiPicker"
            ></picker>
            <v-btn
              class="show-emoji-box-btn"
              :class="{'selected': showEmojiPicker}"
              @click.native="showEmojiPicker=!showEmojiPicker"
            >
              <v-icon>tag_faces</v-icon>
            </v-btn>


            <v-btn class="send-chat-btn" @click.native="sendMessage()">Send</v-btn>
          </div>
        </v-flex>

        <v-flex xs12 sm3 pa-0 class="requests-section">
          <div class="header-section">
            <!-- <p class="section-title">38 Members</p> -->
            <div class="option-area">
              <v-btn class="request-option-btn" @click.native="meberList=true" :class="{'selected': meberList}"><v-icon>supervisor_account</v-icon></v-btn>
              <v-btn class="request-option-btn" @click.native="meberList=false" :class="{'selected': !meberList}"><v-icon>fa-at</v-icon></v-btn>
            </div>
          </div>
          <div class="content-section" v-if="meberList">
            <center>
            <v-progress-circular class="progress-circular" v-if="disconnected" indeterminate color="primary"></v-progress-circular>
            </center>

            <div v-if="connected" class="member-group">MODERATOR</div>
            <div class="member-item" v-for="adminUser in adminUsers" v-bind:key="adminUser.username">
              <div class="avatar-area">
                <div class="avatar-image" :style="'background-image: url(' + adminUser.avatar.url + ');'"></div>
                <div class="memeber-status online"></div>
              </div>
              <div class="detail-area">
                <a class="user-name">{{ adminUser.display_name }}</a>
              </div>
            </div>

            <div v-if="onlineUsers.length" class="member-group mt-3">ONLINE: {{ room.online.length }}</div>
            <div v-if="onlineUsers.length" class="member-item" v-for="onlineUser in onlineUsers" v-bind:key="onlineUser.username">
              <div class="avatar-area">
                <div class="avatar-image" :style="'background-image: url(' + onlineUser.avatar.url + ');'"></div>
                <div class="memeber-status online"></div>
              </div>
              <div class="detail-area">
                <a v-if="onlineUser" class="user-name">{{ onlineUser.display_name }}</a>
              </div>
            </div>
            <div v-if="idleUsers.length" class="member-group mt-3">IDLE: {{ room.idle.length }}</div>
            <div v-if="idleUsers.length" class="member-item" v-for="idleUser in idleUsers" v-bind:key="idleUser.username">
              <div class="avatar-area">
                <div class="avatar-image" :style="'background-image: url(' + idleUser.avatar.url + ');'"></div>
                <div class="memeber-status idle"></div>
              </div>
              <div class="detail-area">
                <a v-if="idleUser" class="user-name">{{ idleUser.display_name }}</a>
              </div>
            </div>
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
.progress-circular {

}
</style>
