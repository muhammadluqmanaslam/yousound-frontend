<template>
  <v-layout row wrap class="user-item">
    <send-message
      :receiver="userItem"
      :dismiss="dismissMessageModal"
      v-if="showSendMessage"
    ></send-message>
    <v-flex xs12 class="user-item-body" v-bind:class="{ 'last-item': last }">
      <v-layout row wrap>
        <v-flex
          xs12
          sm6
          class="user-item-section"
          v-bind:class="{
            sm6: userItem.recent_reposts,
            'no-reposts': !userItem.recent_reposts,
          }"
        >
          <v-flex xs12 class="user-item-section-body">
            <div class="user-item-profile-avatar-area">
              <router-link :to="'/' + userItem.slug">
                <!-- <img class="user-item-profile-avatar" src="/static/images/user1.jpg"/> -->
                <div
                  class="user-item-profile-avatar"
                  :style="{
                    'background-image':
                      'url(' + userItem.avatar.thumb.url + ')',
                  }"
                ></div>
              </router-link>
            </div>
            <div class="user-item-content-area">
              <div class="user-item-content">
                <router-link :to="'/' + userItem.slug" class="user-name">{{
                  userItem.username
                }}</router-link
                >&nbsp;
                <v-icon
                  class="user-status"
                  v-bind:class="{ online: userItem.status == 'active' }"
                  v-if="userItem.user_type == 'artist'"
                  >fa-check-circle</v-icon
                >&nbsp;
                <label class="follower-count"
                  ><strong>2.8k</strong> Followers</label
                >
              </div>
              <div class="actions-section">
                <user-follow-btn
                  v-if="
                    $store.state.auth.user &&
                    userItem.id != $store.state.auth.user.id
                  "
                  :user="userItem"
                  theme="dark"
                  type="default"
                  @afterFollow="afterFollow"
                />
                <v-menu offset-y class="more-menu">
                  <v-btn dark class="more-btn" slot="activator">
                    <v-icon right>more_horiz</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile key="message">
                      <v-list-tile-title
                        class="default-menu-item"
                        @click.native="showMessageDialog()"
                      >
                        <!-- <img class="track-status-icon" src="/static/images/ic_download.png" /> -->
                        <label>Message</label>
                      </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile key="blockuser">
                      <v-list-tile-title
                        class="default-menu-item"
                        @click.native="blockUser()"
                      >
                        <!-- <img class="track-status-icon" src="/static/images/ic_share.png" /> -->
                        <label>Block User</label>
                      </v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </v-flex>
        </v-flex>
        <v-flex
          xs12
          sm6
          class="user-item-recent-posts"
          v-if="userItem.recent_reposts"
        >
          <p class="recent-posts-section-title">Recent reposts</p>
          <div
            class="recent-post-item"
            :style="{
              'background-image': 'url(' + imageURL(userItem.assoc) + ')',
            }"
            v-for="(repost, index) in userItem.recent_reposts"
            :key="index"
          >
            <!-- <div class="recent-post-item" :style="{'background-image': 'url(/static/images/post1.jpg)'}"> -->
            <router-link
              :to="'/album/' + repost.slug"
              v-if="repost.album_type"
            ></router-link>
            <router-link to="/" v-if="!repost.album_type"></router-link>
          </div>
          <!-- <img class="recent-post-item" src="/static/images/post1.jpg" />
          <img class="recent-post-item" src="/static/images/post2.jpg" />
          <img class="recent-post-item" src="/static/images/post3.jpg" /> -->
        </v-flex>
      </v-layout>
      <!-- <label class="following-time">Now</label> -->
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript">
import sendMessage from "@/components/sendmessage";
import UserFollowBtn from "@/components/userFollowBtn";

export default {
  components: {
    sendMessage,
    UserFollowBtn,
  },

  props: {
    userItem: {
      type: Object,
    },
    last: {
      type: Boolean,
    },
  },

  data() {
    return {
      showSendMessage: false,
      buttonHover: false,
    };
  },

  computed: {
    followButtonText() {
      if (this.userItem.is_following) {
        return this.buttonHover ? "Unfollow" : "Following";
      }
      return "Follow";
    },
  },

  created() {},

  methods: {
    showMessageDialog() {
      this.showSendMessage = true;
    },

    dismissMessageModal() {
      this.showSendMessage = false;
    },

    imageURL(item) {
      if (item.cover) {
        return item.cover.thumb.url;
      } else {
        return item.covers[0].cover.thumb.url;
      }
    },

    blockUser() {},

    afterFollow(isfollowing) {
      if (isfollowing === "unfollow") {
        this.userItem.is_following = false;
      } else if (isfollowing === "follow") {
        this.userItem.is_following = true;
      }
    },
  },
};
</script>
