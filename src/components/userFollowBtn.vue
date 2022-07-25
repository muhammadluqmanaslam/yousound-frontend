<template>
  <div class="user-follow-btn" :class="[`is_${theme}`]">
    <v-btn
      :class="{
        'follow-btn': true,
        follow: !user.is_following,
        following: user.is_following,
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
  },
  data() {
    return {
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
