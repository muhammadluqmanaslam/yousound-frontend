<template>
  <v-layout row wrap class="page messages-page">

    <!-- <payment-modal v-if="showPaymentModal"
      :type="''"
      :amount="current_repost_price"
      :dismiss="hidePaymentDialog"
      :finish="sendMessage"></payment-modal> -->

    <repost-payment-modal v-if="show_repost_payment_modal"
      :item="item"
      :itemType="tab"
      :user="conversation.other"
      :dismiss="closeRepostPaymentModal"
      :finish="sendMessage"></repost-payment-modal>

    <v-flex xs12 sm12 class="messages-stop-music-section" v-if="show_stopPopup">
      <div class="popup-section">
        <img class="popup-image" src="/static/images/earphone.png"/>
        <p class="popup-title">Direct Messages</p>
        <p class="popup-text">Messages is where artists submit music for you to listen to and potentially repost.</p>
        <v-btn class="gotta-btn" @click.native="setVisitedTime()">Ok. Got it!</v-btn>
      </div>
    </v-flex>

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

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 class="messages-page-content" v-if="$store.state.auth.user">
      <v-layout row>
        <v-flex xs12 pa-0 v-if="!conversations || conversations.length == 0" class="message-rooms-section empty-section">
          <p class="empty-title">No messages</p>
          <p class="empty-description">Your conversations will appear here.</p>
        </v-flex>
        <template v-else>
          <v-flex xs12 sm3 pa-0 class="message-rooms-section">
            <div class="header-section">
              <div class="search-box">
                <div class="search-container">
                  <span class="icon">
                    <svg width="20px" height="20px" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <!-- Generator: Sketch 45.2 (43514) - http://www.bohemiancoding.com/sketch -->
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
                  <!-- <img src="/static/images/ic_more.png"/></v-icon> -->
                  <v-icon right>more_horiz</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile key="all" class="default-menu-item" @click.native="showAllMesssages()">
                    <v-list-tile-title>
                      <!-- <img class="track-status-icon" src="/static/images/ic_repeat.png" /> -->
                      <label>All Messages</label>
                    </v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile key="request" class="default-menu-item" @click.native="showRepostRequests()">
                    <v-list-tile-title>
                      <!-- <img class="track-status-icon" src="/static/images/ic_download.png" /> -->
                      <label>Repost Requests Only</label>
                    </v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>
            <div class="content-section">
              <div class="message-room-item " v-for="(conv, index) in conversations" :key="index" :class="{'new': !conv.last_message.is_read, 'selected': index==selected_index}" @click="selectedConversation(index)">
                <div class="avatar-area">
                  <router-link :to="`/${conv.other.slug}`"><div class="avatar-image" :style="'background-image: url(' + conv.other.avatar.thumb.url + ');'" v-if="!conv.other.length"></div></router-link>
                </div>
                <div class="detail-area">
                  <!-- <router-link class="user-name" :to="'/' + conv.other.slug">{{ conv.other.display_name }}</router-link> -->
                  <label class="user-name">{{ conv.other.display_name }}</label>
                  <label class="short-message">{{ conv.last_message.body }}</label>
                </div>
                <label class="messaged-time">{{ toLocalTimeString(conv.last_message.created_at) }}</label>
              </div>
            </div>
          </v-flex>
          <v-flex xs12 pa-0 class="message-content-section" :class="{'sm6':$store.state.auth.user.user_type === 'artist', 'sm9':$store.state.auth.user.user_type !== 'artist'}" v-if="selected_index >= 0">
            <div class="header-section">
              <p href="" class="user-name">
                {{ conversations[selected_index].other.display_name }}
                <v-icon v-if="conversations[selected_index].other.user_type == 'artist'"
                  class="user-status" 
                  :class="{'online': conversations[selected_index].other.status == 'active'}">fa-check-circle</v-icon>
              </p>
              <!-- <p class="messaged-time">{{ toLocalTimeString(conversations[selected_index].last_message.created_at) }}</p> -->
              <p class="messaged-time">RepostPrice: ${{ conversations[selected_index].other.repost_price|formatNumber }}</p>
              <v-menu offset-y class="more-menu">
                <v-btn dark slot="activator">
                  <v-icon right>more_horiz</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile key="all" class="default-menu-item" @click.native="openConversationDeleteConfirmDialog(conversations[selected_index])">
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
            <div class="message-list-section" v-if="conversation.messages && conversation.messages.length > 0">
              <div class="message-item space" v-for="message in conversation.messages" :class="conversation.other.id == message.sender.id ? 'other' : 'self'">
                <div class="messaged-time">{{ toLocalTimeString(message.created_at) }}</div>
                <div class="message-section">
                  <router-link :to="`/${message.sender.slug}`"><div class="user-avatar-image" :style="{'background-image': 'url(' + message.sender.avatar.thumb.url + ')'}"></div></router-link>

                  <template v-if="message.attachment">
                    <template v-if="message.attachment.attachment_type=='repost'">
                      <div class="message-content text request no-top-corner">
                        <div>
                          <div class="repost-status-section">
                            <div v-if="message.sender.id==$store.state.auth.user.id || message.attachment.status!='pending'">
                              <label class="status-title">Repost request: </label>
                              <v-btn class="status-btn" :class="message.attachment.status">{{ message.attachment.status }}</v-btn>
                            </div>
                            <div v-else>
                              <label class="status-title">Repost request: </label>
                              <v-btn class="status-btn" @click.native="acceptRepostRequest(message)">Accept</v-btn>
                              <v-btn class="status-btn" @click.native="denyRepostRequest(message)">Deny</v-btn>
                              <v-btn class="status-btn">Repost free</v-btn>
                            </div>
                          </div>

                          <div class="content-section" v-if="message.attachment.attachable_type=='Album'">
                            <div class="repost-item-image">
                              <activity-album-card :object="message.attachment.assoc"></activity-album-card>
                            </div>
                            <div class="info-section">
                              <label class="item-title">{{ message.attachment.assoc.name }}</label>
                              <a class="item-user">{{ message.sender.display_name }}</a>
                            </div>
                          </div>
                          <div class="content-section" v-else-if="message.attachment.attachable_type=='ShopProduct'">
                            <div class="repost-item-image">
                              <activity-product-card :object="message.attachment.assoc" :price-show="false"></activity-product-card>
                            </div>
                            <div class="info-section">
                              <label class="item-title">{{ message.attachment.assoc.name }}</label>
                              <a class="item-user">{{ message.sender.display_name }}</a>
                            </div>
                          </div>
                        </div>
                        <!-- <label class="text-message">{{ message.body }}</label> -->
                      </div>
                    </template>

                    <template v-else-if="message.attachment.attachment_type=='collaboration'">
                      <div class="message-content text request no-top-corner">
                        <div>
                          <!-- <div class="content-section" v-if="message.attachment.attachable_type=='User'"> -->
                          <div class="content-section">
                            <div class="label-message-section">
                              <div class="label-message">{{ message.body }}</div>
                            </div>

                            <template v-if="message.attachment.attachable_type=='Album'">
                              <div class="repost-item-image">
                                <activity-album-card :object="message.attachment.assoc"></activity-album-card>
                              </div>
                              <div class="info-section">
                                <label class="item-title">{{ message.attachment.assoc.name }}</label>
                                <a class="item-user">{{ message.sender.display_name }}</a>
                              </div>
                              <div class="artist-list">
                                <div class="artist" v-for="collaborator in message.attachment.assoc.collaborators">
                                  <span>{{ collaborator.user.display_name }}</span>
                                  <span>{{ collaborator.user_role }}</span>
                                </div>
                              </div>
                            </template>
                            <template v-else-if="message.attachment.attachable_type=='ShopProduct'">
                              <div class="repost-item-image">
                                <activity-product-card :object="message.attachment.assoc" :price-show="false"></activity-product-card>
                              </div>
                              <div class="info-section">
                                <label class="item-title">{{ message.attachment.assoc.name }}</label>
                                <a class="item-user">{{ message.sender.display_name }}</a>
                              </div>
                              <div class="artist-list">
                                <div class="artist" v-for="collaborator in message.attachment.assoc.collaborators">
                                  <span>{{ collaborator.user.display_name }}</span>
                                  <span>{{ collaborator.user_share }} %</span>
                                </div>
                              </div>
                            </template>

                            <div class="repost-status-section label">
                              <div v-if="message.sender.id==$store.state.auth.user.id || message.attachment.status!='pending'">
                                <v-btn class="status-btn" :class="message.attachment.status">{{ message.attachment.status }}</v-btn>
                              </div>
                              <div v-else>
                                <v-btn to="/albums#pending" class="status-btn" v-if="message.attachment.attachable_type=='Album'">View Pending Collaboration</v-btn>
                                <v-btn to="/sell#pendings" class="status-btn" v-else-if="message.attachment.attachable_type=='ShopProduct'">View Pending Collaboration</v-btn>
                              </div>
                              <!-- <div v-else>
                                <v-btn class="status-btn" @click.native="acceptCollaboration(message)">Accept</v-btn>
                                <v-btn class="status-btn" @click.native="denyCollaboration(message)">Deny</v-btn>
                              </div> -->
                            </div>
                          </div>
                        </div>
                        <label class="text-message" v-if="false"></label>
                      </div>
                    </template>

                    <template v-else-if="message.attachment.attachment_type=='label_user'">
                      <div class="message-content text request no-top-corner">
                        <div>
                          <div class="content-section">
                            <div class="label-message-section">
                              <div class="label-message">{{ message.body }}</div>
                            </div>

                            <template v-if="message.attachment.attachable_type=='User'">
                              <div class="repost-item-image avatar" :style="{'background-image': 'url(' +  message.attachment.assoc.avatar.thumb.url + ')'}"></div>
                              <div class="info-section">
                                <label class="item-title">{{ message.attachment.assoc.display_name }}</label>
                              </div>
                            </template>

                            <div class="repost-status-section label">
                              <div v-if="message.sender.id==$store.state.auth.user.id || message.attachment.status!='pending'">
                                <v-btn class="status-btn" :class="message.attachment.status">{{ message.attachment.status }}</v-btn>
                              </div>
                              <div v-else>
                                <v-btn class="status-btn" @click.native="acceptLabelUser(message)">Accept</v-btn>
                                <v-btn class="status-btn" @click.native="denyLabelUser(message)">Deny</v-btn>
                              </div>
                            </div>
                          </div>
                        </div>
                        <label class="text-message" v-if="false"></label>
                      </div>
                    </template>

                    <template v-else-if="message.attachment.attachment_type=='label_album'">
                      <div class="message-content text request no-top-corner">
                        <div>
                          <div class="content-section">
                            <div class="label-message-section">
                              <div class="label-message">{{ message.body }}</div>
                            </div>

                            <template v-if="message.attachment.attachable_type=='Album'">
                              <div class="repost-item-image avatar" :style="{'background-image': 'url(' +  message.attachment.assoc.cover.url + ')'}"></div>
                              <div class="info-section">
                                <label class="item-title">{{ message.attachment.assoc.name }}</label>
                              </div>
                            </template>

                            <div class="repost-status-section label">
                              <div v-if="message.sender.id==$store.state.auth.user.id || message.attachment.status!='pending'">
                                <v-btn class="status-btn" :class="message.attachment.status">{{ message.attachment.status }}</v-btn>
                              </div>
                              <div v-else>
                                <v-btn class="status-btn" @click.native="acceptLabelAlbum(message)">Accept</v-btn>
                                <v-btn class="status-btn" @click.native="denyLabelAlbum(message)">Deny</v-btn>
                              </div>
                            </div>
                          </div>
                        </div>
                        <label class="text-message" v-if="false"></label>
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <div class="message-content text">
                      <label class="text-message">{{ message.body }}</label>
                    </div>
                  </template>

                  <div class="clear"></div>
                </div>
              </div>
            </div>
            <div class="send-message-section">
              <input v-model="message.body"
                type="text"
                maxlength="500"
                class="message-input-box"
                placeholder="Write a message..."
                @keyup.enter="checkMessage()"
                ref="message"
                autofocus/>
              <picker v-if="showEmojiPicker"
                title="Pick your emoji…"
                emoji="point_up"
                class="emoji-picker"
                @click="addEmoji"
                v-on-click-outside="hideEmojiDialog"></picker>
              <v-btn
                class="show-emoji-box-btn"
                :class="{'selected': showEmojiPicker}"
                @click.native="showEmojiDialog()">
                <v-icon>tag_faces</v-icon>
              </v-btn>
              <v-btn class="send-message-btn" @click.native="checkMessage()" :disabled="!message.body">Send</v-btn>
            </div>
          </v-flex>
          <v-flex xs12 sm3 pa-0 class="requests-section" v-if="['artist', 'brand', 'label'].indexOf($store.state.auth.user.user_type)!=-1">
            <div class="header-section">
              <p class="section-title">Request repost</p>
              <div class="option-area">
                <v-btn v-if="['artist', 'label'].indexOf($store.state.auth.user.user_type)!=-1"
                  class="request-option-btn" :class="{'selected':tab=='album'}" @click.native="onTab('album')">Album</v-btn>
                <v-btn v-if="['artist', 'brand', 'label'].indexOf($store.state.auth.user.user_type)!=-1"
                  class="request-option-btn" :class="{'selected':tab=='merch'}" @click.native="onTab('merch')">Merch</v-btn>
              </div>
            </div>
            <div class="content-section" v-if="tab=='album'">
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
            <div class="content-section" v-if="tab=='merch'">
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
          </v-flex>
        </template>
      </v-layout>
    </v-flex>

  </v-layout>
</template>

<script type="text/javascript" src="./messages.ctrl.js"></script>
