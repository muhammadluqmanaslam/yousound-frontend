<template>
  <v-layout row wrap class="page messages-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 class="messages-page-content" v-if="$store.state.auth.user">
      <v-layout row>
        <v-flex xs12 pa-0 v-if="!conversations || conversations.length == 0" class="message-rooms-section empty-section">
          <p class="empty-title">No messages</p>
          <p class="empty-description">Conversations will appear here.</p>
        </v-flex>
        <template v-else>
          <v-flex xs12 sm3 pa-0 class="message-rooms-section">
            <div class="header-section">
              <div class="header-title">
                <label>Inbox</label>
                <span>{{ conversations.length }} messages</span>
              </div>
            </div>
            <div class="content-section">
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
                  :class="{'online': conversation.other.status == 'active'}">fa-check-circle</v-icon>
              </p>
              <p class="messaged-time">Repost Price: ${{ conversation.other.repost_price | formatNumber }}</p>
            </div>
            <div class="message-list-section" v-if="messages && messages.length > 0">
              <div class="message-item space" v-for="message in messages" :class="conversation.other.id == message.sender.id ? 'other' : 'self'">
                <div class="messaged-time">{{ toLocalTimeString(message.created_at) }}</div>
                <template v-if="message.attachment">
                  <div class="message-section">
                    <router-link :to="`/${message.sender.slug}`"><div class="user-avatar-image" :style="{'background-image': 'url(' + message.sender.avatar.thumb.url + ')'}"></div></router-link>
                    <div class="message-content text">
                      <label class="text-message">{{ message.body }}</label>
                    </div>
                    <div class="clear"></div>
                  </div>

                  <div class="message-section">
                    <router-link :to="`/${message.sender.slug}`"><div class="user-avatar-image" :style="{'background-image': 'url(' + message.sender.avatar.thumb.url + ')'}"></div></router-link>

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
                              <v-btn class="status-btn">Accept</v-btn>
                              <v-btn class="status-btn">Deny</v-btn>
                              <v-btn class="status-btn">Repost free</v-btn>
                            </div>
                          </div>

                          <div class="content-section" v-if="message.attachment.attachable_type=='Album'">
                            <div class="repost-item-image">
                              <activity-album-card :object="message.attachment.assoc" />
                            </div>
                            <div class="info-section">
                              <label class="item-title">{{ message.attachment.assoc.name }}</label>
                              <a class="item-user">{{ message.sender.display_name }}</a>
                            </div>
                          </div>
                          <div class="content-section" v-else-if="message.attachment.attachable_type=='ShopProduct'">
                            <div class="repost-item-image">
                              <activity-product-card :object="message.attachment.assoc" :price-show="false" />
                            </div>
                            <div class="info-section">
                              <label class="item-title">{{ message.attachment.assoc.name }}</label>
                              <a class="item-user">{{ message.sender.display_name }}</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>

                    <template v-else-if="message.attachment.attachment_type=='collaboration'">
                      <div class="message-content text request no-top-corner">
                        <div>
                          <div class="content-section">
                            <template v-if="message.attachment.attachable_type=='Album'">
                              <div class="label-message-section">
                                <div class="label-message">{{ message.attachment.assoc.user.display_name }} wants to upload this album collaboration</div>
                              </div>
                              <div class="repost-item-image">
                                <activity-album-card :object="message.attachment.assoc" />
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
                              <div class="label-message-section">
                                <!-- <div class="label-message">{{ message.body }}</div> -->
                                <div class="label-message">{{ message.attachment.assoc.merchant.display_name }} wants to upload this product collaboration</div>
                              </div>
                              <div class="repost-item-image">
                                <activity-product-card :object="message.attachment.assoc" :price-show="false" />
                              </div>
                              <div class="info-section">
                                <label class="item-title">{{ message.attachment.assoc.name }}</label>
                                <a class="item-user">{{ message.sender.display_name }}</a>
                              </div>
                              <div class="artist-list">
                                <div class="artist">
                                  <span>{{ message.attachment.assoc.merchant.display_name }}( Owner )</span>
                                  <span>{{ message.attachment.assoc.creator_share }} %</span>
                                </div>
                                <div class="artist">
                                  <span>Recoup Cost</span>
                                  <span>${{ message.attachment.assoc.creator_recoup_cost | formatNumber }}</span>
                                </div>
                                <div class="artist" v-for="collaborator in message.attachment.assoc.collaborators">
                                  <span>{{ collaborator.user.display_name }}</span>
                                  <span>{{ collaborator.user_share }} %</span>
                                </div>
                              </div>
                            </template>

                            <div class="repost-status-section label">
                              <div v-if="message.sender.id==$store.state.auth.user.id || message.attachment.status!='pending'">
                                <v-btn v-if="message.attachment.attachable_type=='Album'"
                                  to="/albums#pending"
                                  class="status-btn"
                                  :class="message.attachment.status">View Collaboration</v-btn>
                                <v-btn v-else-if="message.attachment.attachable_type=='ShopProduct'"
                                  to="/sell#pendings"
                                  class="status-btn"
                                  :class="message.attachment.status">View Collaboration</v-btn>
                              </div>
                              <div v-else>
                                <v-btn to="/albums#pending" class="status-btn" v-if="message.attachment.attachable_type=='Album'">View Pending Collaboration</v-btn>
                                <v-btn to="/sell#pendings" class="status-btn" v-else-if="message.attachment.attachable_type=='ShopProduct'">View Pending Collaboration</v-btn>
                              </div>
                            </div>
                          </div>
                        </div>
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
                                <v-btn class="status-btn">Accept</v-btn>
                                <v-btn class="status-btn">Deny</v-btn>
                              </div>
                            </div>
                          </div>
                        </div>
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
                                <v-btn class="status-btn">Accept</v-btn>
                                <v-btn class="status-btn">Deny</v-btn>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>

                    <div class="clear"></div>
                  </div>
                </template>
                <template v-else>
                  <div class="message-section">
                    <router-link :to="`/${message.sender.slug}`"><div class="user-avatar-image" :style="{'background-image': 'url(' + message.sender.avatar.thumb.url + ')'}"></div></router-link>
                    <div class="message-content text">
                      <label class="text-message" v-html="message.body"></label>
                    </div>
                    <div class="clear"></div>
                  </div>
                </template>
              </div>
            </div>
          </v-flex>
        </template>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript" src="./direct_messages.ctrl.js"></script>
