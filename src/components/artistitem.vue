<template>
  <v-flex class="artist-card">
    <v-flex xs12 class="item-info" pa-0>
      <v-flex xs12 class="artist-info-section">
        <div
          class="artist-cover"
          :style="{ 'background-image': 'url(' + artist.avatar.url + ')' }"
        ></div>
        <v-flex v-if="canViewProfile" xs12 class="artist-actions">
          <router-link :to="`/${artist.slug}`">
            <!-- <div class="avatar-cover">
              <div class="hover-title">View Profile</div>
            </div> -->
          </router-link>

          <div v-if="followButtonVisible" class="follow-section">
            <user-follow-btn
              class="mt-3"
              :user="artist"
              type="default"
              @afterFollow="afterFollow"
            />
          </div>
        </v-flex>
        <div class="artist-name">
          {{ artist.username }}
          <v-icon
            v-if="artist.user_type !== 'listener'"
            class="user-status"
            :class="{ online: artist.status == 'active' }"
            >fa-check-circle</v-icon
          >
        </div>
        <div class="artist-title">
          Artist
        </div>
      </v-flex>
    </v-flex>
  </v-flex>
</template>

<script type="text/javascript">
import { PublicRelationsUsername } from "@/helper";
import UserFollowBtn from "@/components/userFollowBtn";

export default {
  components: {
    UserFollowBtn,
  },

  props: {
    artist: {
      type: Object,
    },
  },

  data() {
    return {
      PublicRelationsUsername: PublicRelationsUsername,
      buttonHover: false,
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },

    followButtonText() {
      if (this.artist.is_following) {
        return this.buttonHover ? "Unfollow" : "Following";
      }
      return "Follow";
    },

    followButtonVisible() {
      return (
        this.currentUser &&
        this.currentUser.id !== this.artist.id &&
        ["admin", "superadmin"].indexOf(this.artist.user_type) === -1 &&
        this.artist.username !== PublicRelationsUsername
      );
    },

    canViewProfile() {
      return ["admin", "superadmin"].indexOf(this.artist.user_type) === -1;
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
        this.artist.is_following = false
      } else if (isfollowing === "follow") {
        this.artist.is_following = true
      }
    },
  },
};
</script>
