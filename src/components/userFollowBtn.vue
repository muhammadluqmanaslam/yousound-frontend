<template>
  <div class="user-follow-btn" :class="[`is_${theme}`]">
    <v-btn
      class="follow-btn"
      :class="{
        'follow-btn': true,
        follow: !userIsFollowing,
        following: userIsFollowing,
        btnBlock,
        borderRadius,
      }"
      @click.native="followUser()"
      @mouseenter="buttonHover = true"
      @mouseleave="buttonHover = false"
      style="background-color: red"
    >
      {{ followButtonText }}
    </v-btn>
  </div>
</template>

<script>
import UserService from "@/services/user"
import { MyEvents } from "@/helper"

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    theme: {
      type: String,
      default: "light",
    },
    followParam: {
      type: Object,
    },
    btnBlock: Boolean,
    borderRadius: Boolean,
  },
  data() {
    return {
      buttonHover: false,
    };
  },
  methods: {
    followUser() {
      if (!this.isUserSignedUp) {
        return this.$store.dispatch('app/toggleGlobalSMS', true)
      }

      if (this.userIsFollowing) {
        UserService.unfollowUser(this.user.id)
          .then((response) => {
            this.$store.dispatch('error/showSuccessToast', [
              'You have unfollowed ' + this.user.display_name,
            ])

            this.postFollow("unfollow")
          })
          .catch((e) => {
            console.log('unfollowUser error', e)
            this.$store.dispatch("error/showErrorToast", [
              "There was an issue unfollowing " + this.user.display_name,
            ]);
          })
      } else {
        UserService.followUser(this.user.id, this.followParam)
          .then((response) => {
            this.$store.dispatch('error/showSuccessToast', [
              'You just followed ' + this.user.display_name,
            ])

            this.postFollow("follow")
          })
          .catch((e) => {
            console.log('followUser error', e)

            this.$store.dispatch("error/showErrorToast", [
              "There was an issue following " + this.user.display_name,
            ]);
          })
      }
    },
    postFollow(isfollowing) {
      if (this.type === "player") {
        if (isfollowing === "unfollow") {
          this.$store.dispatch('player/updateFollowingStatus', false)
        } else if (isfollowing === "follow") {
          this.$store.dispatch('player/updateFollowingStatus', true)
        }
      } else if (this.type === "default") {
        if (isfollowing === "unfollow") {
          this.$root.$emit(MyEvents.USER_FOLLOW, this.user.id, false)
        } else if (isfollowing === "follow") {
          this.$root.$emit(MyEvents.USER_FOLLOW, this.user.id, true)
        }
      }

      // update triggerer
      this.$emit("afterFollow", isfollowing)
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    isUserSignedUp() {
      return this.currentUser.phone_number;
    },
    userIsFollowing() {
      return this.user.is_following
    },
    followButtonText() {
      if (this.userIsFollowing) {
        return this.buttonHover ? "Unfollow" : "Following";
      }
      return "Follow";
    },
  },
};
</script>

<style lang="scss" scoped>
.user-follow-btn {
  .follow-btn {
    height: 30px;
    min-width: 100px;
    width: 90px;
    float: right;
    text-transform: none;
    box-shadow: none;
    background: transparent !important;
    border-radius: 37.5px;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0;
    border-radius: 4px;
    &.follow {
      color: #076AFF !important;
      border: 1px solid #076AFF;

      &.btnBlock {
        border-radius: 0;
      }
      &.borderRadius {
        border-radius: 4px;
      }
    }
    &.following {
      color: #000;
      border: 1px solid #0009;

      &.borderRadius {
        border-radius: 4px;
      }

      &:hover {
        color: #dc3545 !important;
        border: 1px solid #dc3545;
      }
    }
  }

  &.is_blue {
    .follow-btn {
      height: 36px;

      &.follow {
        color: #ffffff !important;
        background: #076AFF!important;
        border: 0.75px solid #076AFF;
        font-weight: 700;
        font-size: 16px;
      }
      &.following {
        color: #000;
        border: 1px solid #0009;
      }
    }
  }
  &.is_dark {
    .follow-btn {
      &.follow {
        color: #ffffff !important;
        background: #000000 !important;
        border: 0.75px solid #000000;
        min-width: 6px;
        width: 75px
      }
      &.following {
        color: #000;
        border: 1px solid #0009;
      }
    }
  }
}
</style>
