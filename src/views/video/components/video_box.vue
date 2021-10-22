<template>
  <div class="box">
    <div class="box__content">
      <router-link :to="`/video/${video.id}/show`">
        <div
          class="box__image"
          :style="`background-image: url(${video.cover.url})`"
        ></div>
      </router-link>
    </div>
    <div class="box__footer">
      <div class="box__subtitle">{{ video.name }}</div>
      <router-link :to="`/${video.user.slug}`">
        <div class="box__title">{{ video.user.display_name }}</div>
      </router-link>
        <div class="box__views__duration_wrapper">
          <span class="box__views">0 views</span>
          <span v-if="calcAge" class="ml-1 box__age"> • {{ calcAge }}</span>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    video: Object,
  },
}
</script>

<style lang="scss" scoped>
.box {
  &__content {
    position: relative;
    width: 100%;
  }

  &__footer {
    width: 50%;
  }

  &__image {
    z-index: 1;
    width: 100%;
    padding-bottom: 56.25%;
    background-size: cover;
    overflow: hidden;
    background-position: center;
    border-radius: 7.5px;
    border: none;
  }

  &__title,
  &__subtitle {
    display: block;
    overflow: hidden;
    letter-spacing: -0.6px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__subtitle {
    margin-top: 3px;
    color: #333;
    font-size: 14px;
    font-weight: 700;
    a {
      color: #000000;
    }
  }

  &__title {
    margin-top: 3px;
    color: #000000;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
