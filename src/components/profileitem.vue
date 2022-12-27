<template>
  <div :class="className" class="profile-item-section">
    <send-message
      :receiver="user"
      :dismiss="dismissMessageModal"
      v-if="showSendMessage"
    ></send-message>
    <router-link :to="'/' + user.slug">
      <div
        class="activity-item-profile-avatar"
        :style="{ 'background-image': 'url(' + user.avatar.thumb.url + ')' }"
      ></div>
    </router-link>
    <div
      v-if="false && user.id != $store.state.auth.user.id"
      class="activity-item-profile-cover"
    >
      <div class="profile-cover-arrow"><div></div></div>
      <div class="profile-cover">
        <div class="profile-cover-body">
          <div class="profile-cover-avatar">
            <router-link :to="'/' + user.slug">
              <div
                class="activity-item-profile-avatar"
                :style="{
                  'background-image': 'url(' + user.avatar.thumb.url + ')',
                }"
              ></div>
            </router-link>
          </div>
          <div class="profile-cover-content">
            <router-link class="user-name" :to="'/' + user.slug">{{
              user.username
            }}</router-link
            >&nbsp;
            <v-icon
              class="user-status"
              :class="{ online: user.status == 'active' }"
              v-if="user.user_type == 'artist'"
              >fa-check-circle</v-icon
            >
            <label class="user-followers"
              ><b>{{ user.followers }}</b> Followers</label
            >
          </div>
        </div>
        <!-- <div class="profile-cover-action-buttons" v-if="user.id != $store.state.auth.user.id"> -->
        <div class="profile-cover-action-buttons">
          <user-follow-btn
            v-if="user.id != $store.state.auth.user.id"
            :user="user"
            theme="dark"
            type="default"
            @afterFollow="afterFollow"
          />
          <v-btn class="text-button" @click.native="showMessageDialog()"
            >Message</v-btn
          >
          <v-menu offset-y class="more-menu">
            <v-btn dark class="image-button" slot="activator">
              <v-icon right>more_horiz</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile key="repost">
                <v-list-tile-title
                  class="default-menu-item"
                  @click.native="blockUser()"
                >
                  <label>Block User</label>
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>
  </div>
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
    user: {
      type: Object,
    },
    className: {
      type: String,
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
      if (this.user.is_following) {
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

    blockUser() {},

    afterFollow(isfollowing) {
      if (isfollowing === "unfollow") {
        this.user.is_following = false;
      } else if (isfollowing === "follow") {
        this.user.is_following = true;
      }
    },
  },
};
</script>
