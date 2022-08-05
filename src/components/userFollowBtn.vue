<template>
  <div class="user-follow-btn" :class="[`is_${theme}`]">
    <v-btn
      class="follow-btn"
      :class="{
        'follow-btn': true,
        follow: !userIsFollowing,
        following: userIsFollowing,
        btnBlock
      }"
      @click.native="followUser()"
      @mouseenter="buttonHover = true"
      @mouseleave="buttonHover = false"
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
    user: {
      type: Object,
      required: true,
    },
    theme: {
      type: String,
      default: "light",
    },
    btnBlock: Boolean,
  },
  data() {
    return {
      buttonHover: false,
    };
  },
  methods: {
    followUser() {
      if (this.userIsFollowing) {
        UserService.unfollowUser(this.user.id)
          .then((response) => {
            this.$store.dispatch('error/showSuccessToast', [
              'You just unfollowed ' + this.user.display_name,
            ])
            if (this.type === "product") {
              this.$store.dispatch('player/updateFollowingStatus', false)
            } else {
              this.$root.$emit(MyEvents.USER_FOLLOW, this.user.id, false)
            }
          })
          .catch((e) => {
            this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
            )
          })
      } else {
        UserService.followUser(this.user.id)
          .then((response) => {
            this.$store.dispatch('error/showSuccessToast', [
              'You just followed ' + this.user.display_name,
            ])
            // this.user.is_following = true
            // this.$store.dispatch('player/setUpdatedUser', _.cloneDeep(this.user))
            this.$root.$emit(MyEvents.USER_FOLLOW, this.user.id, true)
          })
          .catch((e) => {
            this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
            )
          })
      }
    },
  },
  computed: {
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
    margin: 6px 0px;
    float: right;
    text-transform: none;
    box-shadow: none;
    background: transparent !important;
    border-radius: 37.5px;
    font-size: 13.5px;
    letter-spacing: 0;
    &.follow {
      color: #3a92ff !important;
      border: 0.75px solid #3a92ff;

      &.btnBlock {
        border-radius: 0;
      }
    }
    &.following {
      color: #000 !important;
      border: 1px solid #0009;
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
        background: #1872ff!important;
        border: 0.75px solid #1872ff
      }
      &.following {
        color: #000 !important;
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
        color: #000 !important;
        border: 1px solid #0009;
      }
    }
  }
}
</style>
