<template>
  <div
    class="tag user_tag" 
    :class="{'cursor-pointer' : clickUser, fitContent}"
     @click="clickUser ? gotoUser() : ''"
  >
    <div
      v-if="showAvatar"
      class="tag__image"
      :style="`background-image: url(${user.avatar.url});width: ${width}px;height: ${height}px; margin-right: ${marginRight ? marginRight : ''}`"
    ></div>
    <div class="bio-wrapper">
      <div v-if="!hideName" class="tag__name text-capitalize">{{ user.username }}</div>
      <div v-if="showUserType" class="tag__usertype text-capitalize">{{ user.user_type }}</div>
    </div>
    <v-icon
      v-if="['artist', 'label', 'brand'].indexOf(user.user_type) > -1 && !hideTick"
      class="user-status online"
      >fa-check-circle</v-icon
    >
  </div>
</template>

<script>
export default {
  props: {
    user: Object,
    showAvatar: Boolean,
    hideName: Boolean,
    showUserType: Boolean,
    hideTick: Boolean,
    fitContent: Boolean,
    marginRight: {
      type: String,
    },
    width: {
      type: [ String, Number ],
      default: 20,
    },
    height: {
      type: [ String, Number ],
      default: 20,
    },
    clickUser: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    gotoUser() {
      this.$router.push(`/${this.user.slug}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.tag {
  display: flex;
  align-items: center;
  font-weight: 700;

  &.fitContent {
    display: inline-flex;
  }

  &__image {
    border-radius: 50%;
    background-size: contain;
    background-repeat: no-repeat;
    margin-right: 10px;
  }

  &__usertype {
    margin-top: -7px;
  }
  
    .bio-wrapper {
      text-align: left;
    }

  i {
    margin-left: 4px;
    vertical-align: super;
    font-size: 0.8em;
    color: #31bb25;
  }
}
</style>
