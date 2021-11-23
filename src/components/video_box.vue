<template>
  <div class="box">
    <div
      class="box__content"
      :class="{ 'cursor-pointer': !hoverOverlay }"
      @click="!hoverOverlay ? $router.push(`/video/${item.id}/show`) : ''"
    >
      <span v-if="durationTag" class="duration__tag">{{ durationTag }}</span>
      <div
        class="box__image"
        :style="`background-image: url(${_.get(item, 'cover.url')})`"
      ></div>
      <div class="box__caption" v-if="isLive">Live</div>

      <div v-if="hoverOverlay" class="box__overlay">
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
      <div class="box__subtitle">
        <span v-if="item.accounts.length > 0" class="box__acc-wrapper">
          <!-- <span v-for="(acc, i) in item.accounts" :key="i" class="box__acc">{{ acc.username }}</span> -->
        </span>
        <!-- <span v-else class="box__acc">{{ item.user.username }}</span> -->
        <span>{{ item.name }}</span>
      </div>
      <div class="box__title app-grey--text">
        <div class="box__author">
          <router-link :to="`/${_.get(item, 'user.slug')}`">
            {{ _.get(item, "user.username") }}

            <v-icon
              v-if="item.user.user_type == 'artist'"
              class="user-status online"
            >
              fa-check-circle
            </v-icon>
          </router-link>
        </div>
        <div class="box__views__duration_wrapper">
          <span class="box__views">0 views</span>
          <span v-if="calcAge" class="ml-1 box__age"> • {{ calcAge }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoDetailBox from "./video_detail_box";

export default {
  components: {
    VideoDetailBox,
  },

  props: {
    item: Object,
    hoverOverlay: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    isLive() {
      return this._.get(this.item, "status") === "running";
    },
    calcAge() {
      const d = new Date();
      let created;
      if (this.item.assoc != null) {
        created = new Date(this.item.assoc.created_at);
      } else {
        return null;
      }
      let relative;

      const vid_dd = created.getDay();
      const vid_mm = created.getMonth();
      const vid_yy = created.getFullYear();

      const dd = d.getDay();
      const mm = d.getMonth();
      const yy = d.getFullYear();

      if (yy > vid_yy) {
        const duration = yy - vid_yy;
        const rel_str = duration > 1 ? "years" : "year";
        relative = `${duration} ${rel_str} ago`;
      } else if (mm > vid_mm) {
        const duration = yy - vid_yy;
        const rel_str = duration > 1 ? "months" : "month";
        relative = `${duration} ${rel_str} ago`;
      } else if (dd > vid_dd) {
        const duration = dd - vid_dd;
        const rel_str = duration > 1 ? "days" : "day";
        relative = `${duration} ${rel_str} ago`;
      }

      return relative || null;
    },
    durationTag() {
      let duration = this.item.duration;

      if (duration == null) {
        return null;
      }

      if (duration < 60) {
        duration = `00:${duration}`;
      } else if (duration > 60) {
        const min = Math.floor(duration / 60);
        const sec = duration - min * 60;
        duration = `${min}:${sec.toFixed(0)}`;
      }

      return duration;
    },
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.box {
  //display: flex;
  //flex-direction: column;

  &__content {
    position: relative;
    width: 100%;

    .duration__tag {
      position: absolute;
      bottom: 5px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.3);
      padding: 2px 7px;
      border-radius: 6px;
      font-weight: bolder;
      color: #ffffff;
    }
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
    border-radius: 0px;
    margin-top: 14px;
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
    font-size: 14px;
    font-weight: 700;

    .box__views__duration_wrapper {
      margin: 0;
      font-size: 12px;
      vertical-align: unset;
    }
    .user-status {
      margin: 0;
      font-size: 12px;
      vertical-align: unset;
    }
    a {
      color: inherit;
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
