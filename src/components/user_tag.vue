<template>
  <div
    class="tag" 
    :class="{'cursor-pointer' : clickUser}"
     @click="clickUser ? gotoUser() : ''"
  >
    <div
      v-if="showAvatar"
      class="tag__image"
      :style="`background-image: url(${user.avatar.url});width: ${width};height: ${height}`"
    ></div>
    <div v-if="!hideName" class="text-capitalize">{{ user.username }}</div>
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
    hideTick: Boolean,
    width: {
      type: String,
      default: '20px',
    },
    height: {
      type: String,
      default: '20px',
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

  &__image {
    border-radius: 50%;
    background-size: contain;
    background-repeat: no-repeat;
    margin-right: 10px;
  }

  i {
    margin-left: 4px;
    vertical-align: super;
    font-size: 0.8em;
    color: #31bb25;
  }
}
</style>
