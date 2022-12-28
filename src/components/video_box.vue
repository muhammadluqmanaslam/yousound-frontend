<template>
  <div class="box" :class="{'side-tab-view': sideTabView, onMobile}">
    <div
      class="box__content"
      :class="{ 'cursor-pointer': !hoverOverlay }"
      @click="!hoverOverlay && currentUser != null ? $router.push(`/video/${item.id}/show`) : fetchSpotlightVideo()"
    >
      <span v-if="durationTag && !coverOnly" class="duration__tag">{{ durationTag }}</span>
      <div
        class="box__image"
        :class="{coverRadius}"
        :style="`background-image: url(${_.get(item, 'cover.url')})`"
      >
        <div v-if="showFullOverlay" class="full-overlay">
          <v-icon class="full-overlay_icon icon play-button-2 iconHasWhiteBG black--text">play_arrow</v-icon>
          <div class="hover-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="artist-name">{{ item.user.username }}</div>
          </div>
        </div>
      </div>
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
    <div v-if="!coverOnly" class="box__footer dflex align-start mt-2" :class="{'px-2': onMobile}">
      <user-tag v-if="!hideUser" showAvatar hideName hideTick width="40" height="40" :user="item.user" />

      <div class="box_subtitle-wrapper" :class="{'dgrid': sideTabView}">
        <div class="box__subtitle">
          <span v-if="item.accounts.length > 0" class="box__acc-wrapper">
            <!-- <span v-for="(acc, i) in item.accounts" :key="i" class="box__acc">{{ acc.username }}</span> -->
          </span>
          <span class="stream_name">{{ item.name }}</span>
          <div v-if="showUsername" class="user_name">
            <b class="text-capitalize">{{ item.user.username }}</b>
          </div>
        </div>

        <div v-if="!noMeta" class="box__title">
          <div class="box__author"></div>
          <div class="box__views__duration_wrapper dflex align-center">
            <span class="box__views mr-2" v-if="showViews">0 views</span>
            <!-- <span v-if="calcAge" class="mr-2 box__age dflex align-center"> -->
              <!-- <span v-if="!onMobile" class="mr-2">•</span> -->
              <!-- {{ calcAge }}
            </span> -->

            <!-- <div class="discover-action"  @click="$router.push({name: 'VideoIndex', hash: '#recommended'})">View All</div> -->
            <span
              v-if="!hideFreeTag && isVideoFree && !sideTabView"
              class="user-name"
            >
              {{ item.user.username }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="altMeta" class="mt-2 box__footer alt-meta" :class="{'px-2': onMobile}">
      <div class="alt-meta-name">{{ item.name }}</div>
      <div class="alt-meta-user">
        <b class="text-capitalize">{{ item.user.username }}</b>
      </div>
    </div>
    <!-- Show MOdal 1 -->

    <v-dialog v-model="show_modalCard1" content-class="dialog-w_auto dialog-no_shadow">
      <div class="modal-card">
        <div>
          <img src="../assets/nav_logo_white.png" width="135px">
            </div>
            <div class="modal-card-img">
              <div class="modal-card-img-inner" :style="{'background-image': 'url(' + item.user.avatar.thumb.url + ')',}">
              </div>
          </div>
          <div class="text-center user-box">
            <p>Sign up to experience</p>
            <div class="user-div">
              <p class="user-text"> {{ item.user.username }}</p>
              <img src="../assets/check-white.svg" width="15px">
          </div>
        </div>

        <div class="button-wrapper">
          <router-link to="/signup">
            <button class="modal-button">
              Create account
            </button>
          </router-link>
        </div>

      </div>
    </v-dialog>

    <!-- Show MOdal 2 -->

    <v-dialog v-model="show_modalCard2" content-class="dialog-w_auto dialog-no_shadow">
      <div class="modal-card">
        <div>
          <img src="../assets/nav_logo_white.png" width="135px">
            </div>
            <div class="modal-card-img">
              <div class="modal-card-img-inner" :style="{'background-image': 'url(' + item.user.avatar.thumb.url + ')',}"></div>
          </div>
          <div class="text-center user-box">
            <p>Sign up to experience</p>
            <div class="user-div">
              <p class="user-text"> {{ item.user.username }}</p>
              <img src="../assets/check-white.svg" width="15px">
          </div>
        </div>

        <div class="text-center font-inter">
          <p>Get full access. <b>50%</b> of your subscription is shared with creators you stream most. See who you support!</p>
        </div>

        <div class="button-wrapper">
          <router-link to="/settings">
            <button class="modal-button">
              Start 30 day free trial
            </button>
          </router-link>
        </div>

      </div>
    </v-dialog>

    <!-- Show MOdal 3 -->

    <v-dialog v-model="show_modalCard3" content-class="dialog-w_50 dialog-no_shadow">
      <div class="modal-card-main">
        <div class="modal-card-split">
          <div>
            <img src="../assets/nav_logo_white.png" width="135px">
              </div>
              <div class="modal-card-img">
              <div class="modal-card-img-inner" :style="{'background-image': 'url(' + item.user.avatar.thumb.url + ')',}"></div>
            </div>
            <div class="user-box">
              <p>Sign up to experience</p>
              <div class="user-div">
                <p class="user-text">{{ item.user.username }}</p>
                <img src="../assets/check-white.svg" width="15px">
            </div>
          </div>

          <!-- <div class="text-center">
            <p>Get full access. <b>50%</b> of your subscription is shared with creators you stream most. See who you support!</p>
          </div> -->

          <div class="button-wrapper">
            <router-link to="/signup">
              <button class="modal-button">
                Create account
              </button>
            </router-link>
          </div>

        </div>

        <div class="modal-card-title-img" :style="`background-image: url(${videoLoading})`">
          <video playsinline autoplay loop id="bgvid">
            <source v-if="spotlightVideoSource" :src="`https://stream.mux.com/${spotlightVideoSource}/low.mp4`" type="video/mp4">
          </video>
          <div class="volume-button">
            <img src="../assets/mute-icon.svg" width="17px">
          </div>

        </div>
      </div>
    </v-dialog>

    <!-- Show MOdal 4 -->

    <v-dialog v-model="show_modalCard4" content-class="dialog-w_50 dialog-no_shadow">
      <div class="modal-card-main">
        <div class="modal-card-split">
          <div>
            <img src="../assets/nav_logo_white.png" width="135px">
              </div>
              <div class="modal-card-img">
              <div class="modal-card-img-inner" :style="{'background-image': 'url(' + item.user.avatar.thumb.url +')',}"></div>
            </div>
            <div class="user-box">
              <p>Sign up to experience</p>
              <div class="user-div">
                <p class="user-text">{{ item.user.username }}</p>
                <img src="../assets/check-white.svg" width="15px">
            </div>
          </div>

          <div class="font-inter">
            <p>Get full access. <b>50%</b> of your subscription is shared with creators you stream most. See who you support!</p>
          </div>

          <div class="button-wrapper">
            <router-link to="/settings">
              <button class="modal-button">
                Start 30 day free trial
              </button>
            </router-link>
          </div>

        </div>

        <div class="modal-card-title-img" :style="`background-image: url(${videoLoading})`">
          <video playsinline autoplay loop id="bgvid">
            <source v-if="spotlightVideoSource" :src="`https://stream.mux.com/${spotlightVideoSource}/low.mp4`" type="video/mp4">
          </video>
          <button class="volume-button">
            <img src="../assets/mute-icon.svg" width="17px">
          </button>

        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import VideoDetailBox from "./video_detail_box";
import UserTag from '@/components/user_tag';
import StreamService from '@/services/stream'

export default {
  components: {
    VideoDetailBox,
    UserTag,
  },

  props: {
    item: Object,
    hideFreeTag: {
      type: Boolean,
      default: false,
    },
    sideTabView: {
      type: Boolean,
      default: false,
    },
    showUsername: {
      type: Boolean,
      default: false,
    },
    showViews: {
      type: Boolean,
      default: false,
    },
    hideUser: {
      type: Boolean,
      default: false,
    },
    noMeta: {
      type: Boolean,
      default: false,
    },
    altMeta: {
      type: Boolean,
      default: false,
    },
    hoverOverlay: {
      type: Boolean,
      default: true,
    },
    showFullOverlay: Boolean,
    coverOnly: {
      type: Boolean,
      default: false,
    },
    coverRadius: Boolean,
  },

  data() {
    return {
      bgDemoImg: require('../assets/tile-1.jpeg'),
      videoLoading: require('../assets/loading.gif'),
      show_modalCard1: false,
      show_modalCard2: false,
      show_modalCard3: false,
      show_modalCard4: false,
      spotlightVideoSource: null,
    }
  },

  computed: {
    isVideoFree() {
      return this.item.view_price < 1 ? 'Free' : ''
    },
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
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

    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  methods: {
    fetchSpotlightVideo() {
      StreamService.getSpotlightStream(this.item.user.id)
        .then((response) => {
          console.log("response", response)
          this.spotlightVideoSource = response.body.mp_channel_1_ep_1_id
          if (this.currentUser == null) {
            this.show_modalCard3 = true
          } else {
            this.show_modalCard4 = true
          }
        })
        .catch((e) => {
          if (this.currentUser == null) {
            this.show_modalCard1 = true
          } else {
            this.show_modalCard2 = true
          }
        })
    },
  },
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
    position: relative;

    &:hover {
      .full-overlay {
        display: grid;
        opacity: 1;
      }
    }

    &.coverRadius {
      border-radius: 4px;
    }
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
      font-size: 14px;
      font-weight: 400;
      vertical-align: unset;
      color: #606060;

      .user-name{
      font-weight: 600;
      color: black;
      font-family: 'Inter', sans-serif;
    }
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
    // margin-top: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    color: #000000;
    letter-spacing: -0.3px;
    text-align: left;
    margin-left: 0;
    width: 75%;
  }

  &__content:hover {
    .box__overlay {
      display: flex;
    }
  }

  &.side-tab-view {
    display: flex;
    align-items: center;

    .box__content {
      width: 30%;
      margin-right: 20px;
    }
    .box__footer {
      width: 50%;

      // .box__subtitle {
      //   display: block;
      //   overflow: hidden;
      //   letter-spacing: -.6px;
      //   white-space: nowrap;
      //   text-overflow: ellipsis;
      // }
    }
  }
}
.box_subtitle-wrapper {
  width: 100%;
}
/deep/ ._sliced-top {
  .box {
    &__subtitle {
      width: 100%;
    }
  }
}
.onMobile {
  .box {
    &__subtitle {
      width: 97%;
    }
  }
}
</style>
<style src="../../static/styles/spotlight.scss" ></style>
