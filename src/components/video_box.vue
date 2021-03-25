<template>
  <div class="box">
    <div class="box__content">
      <div
        class="box__image"
        :style="`background-image: url(${_.get(item, 'cover.url')})`"
      ></div>
      <div class="box__caption" v-if="isLive">Live</div>

      <div class="box__overlay">
        <!--
          <video-detail-box :item="item" />
          isLive ? `/${_.get(item, 'user.slug')}` : `/video/${item.id}/show`
         -->
        <v-btn block dark class="box__cta" :to="`/video/${item.id}/show`"
          >Watch Now</v-btn
        >
      </div>
    </div>
    <div class="box__footer">
      <div class="box__subtitle">{{ item.name }}</div>
      <div class="box__title">
        <router-link :to="`/${_.get(item, 'user.slug')}`">{{
          _.get(item, 'user.display_name')
        }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import VideoDetailBox from './video_detail_box'

export default {
  components: {
    VideoDetailBox,
  },

  props: {
    item: Object,
  },

  computed: {
    isLive() {
      return this._.get(this.item, 'status') === 'running'
    },
  },

  methods: {},
}
</script>

<style lang="scss" scoped>
.box {
  //display: flex;
  //flex-direction: column;

  &__content {
    position: relative;
    width: 100%;
  }

  &__overlay {
    z-index: 2;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: none;
    align-items: flex-end;
    padding: 10px;
    // background-color: #ffffff;
    // border: 1px solid #e0e0e0;
    // border-radius: 7.5px;
  }

  &__cta {
    margin: 0;
    border-radius: 3.75px;
    background-color: #0074ff !important;
    text-transform: initial;
    font-weight: 700;
    letter-spacing: 0.6px;
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

  &__caption {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 5px 6px 4px 10px;
    border-radius: 3px;
    background-color: #ff0042;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2.6px;
    text-transform: uppercase;
  }

  &__title,
  &__subtitle {
    display: block;
    overflow: hidden;
    letter-spacing: -0.6px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__title {
    color: #333;
    font-size: 14px;
    font-weight: 700;
    a {
      color: #000000;
    }
  }

  &__subtitle {
    margin-top: 10px;
    color: #000000;
    font-size: 16px;
    font-weight: 500;
  }

  &__content:hover {
    .box__overlay {
      display: flex;
    }
  }
}
</style>
