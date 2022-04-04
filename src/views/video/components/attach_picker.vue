<template>
  <div class="modal-wrapper">
    <div class="my-overlay" @click="dismiss()"></div>
    <div class="modal" :class="{fullscreen}">
      <h4 class="modal__title">
        {{ title }}
        <span
          v-if="fullscreen"
          class="dismisser"
          @click="dismiss()"
        >
          <v-icon>close</v-icon>
        </span>
      </h4>

      <div class="modal__header">
        <v-btn
          :class="{ selected: active_tab == 'Album' }"
          @click.native="onTab('Album')"
          >Album</v-btn
        >
        <v-btn
          :class="{ selected: active_tab == 'ShopProduct' }"
          @click.native="onTab('ShopProduct')"
          >Product</v-btn
        >
        <v-btn
          v-if="showVideo"
          :class="{ selected: active_tab == 'Video' }"
          @click.native="onTab('Video')"
          >
            Video
          </v-btn>
      </div>

      <div class="modal__content" v-if="active_tab == 'Album'">
        <div
          v-for="(album, index) in albums"
          :key="index"
          class="media"
          :class="{ selected: attachId == album.id }"
          @click="selectItem('Album', album)"
        >
          <div class="media__header">
            <div
              class="media__image"
              :style="`background-image: url(${album.cover.thumb.url})`"
            ></div>
          </div>
          <div class="media__content">
            <label class="media__title">{{ album.name }}</label>
            <label class="media__subtitle">{{ album.user.username }}</label>
          </div>
        </div>
      </div>

      <div class="modal__content" v-if="active_tab == 'ShopProduct'">
        <div
          v-for="(product, index) in products"
          :key="index"
          class="media"
          :class="{ selected: attachId == product.id }"
          @click="selectItem('ShopProduct', product)"
        >
          <div class="media__header">
            <div
              class="media__image"
              :style="`background-image: url(${product.covers[0].cover.thumb.url})`"
            ></div>
          </div>
          <div class="media__content">
            <label class="media__title">{{ product.name }}</label>
            <label class="media__subtitle">{{
              product.merchant.username
            }}</label>
          </div>
        </div>
      </div>

      <div class="modal__content" v-if="showVideo && active_tab == 'Video'">
        <div
          v-for="(video, index) in videos"
          :key="index"
          class="media"
          :class="{ selected: attachId == video.id }"
          @click="selectItem('Video', video)"
        >
          <div class="media__header">
            <div
              class="media__image _vid"
              :style="`background-image: url(${video.cover.thumb.url})`"
            ></div>
          </div>
          <div class="media__content">
            <label class="media__title">{{ video.name }}</label>
            <label class="media__subtitle">{{
              video.user.username
            }}</label>
          </div>
        </div>
      </div>

      <!-- <template v-if="active_tab == 'User'">
          <div class="search-box-wrapper">
            <div class="search-box">
              <div class="search-container">
                <span>
                  <svg width="20px" height="20px" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <title>Group 22</title>
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="searchIcon" transform="translate(-732.000000, -61.000000)" stroke="#FFFFFF" stroke-width="1.5999999">
                        <g id="Group-29" transform="translate(710.000000, 50.000000)">
                          <g id="Group-22" transform="translate(23.000000, 12.000000)">
                            <circle id="Oval-2" cx="11.375" cy="11.375" r="11.375"></circle>
                            <path d="M19.5,19.5 L25.59375,25.59375" id="Line" stroke-linecap="round" stroke-linejoin="round"></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <input
                  v-model="userSearchKeyword"
                  type="search"
                  id="search"
                  placeholder="Search"
                  @keyup.enter="loadUsers()"
                />
              </div>
            </div>
          </div>

          <div class="modal__content">
            <div
              v-for="user in users"
              :key="user.id"
              class="media"
              :class="{'selected': attachId == user.id}"
              @click.self="selectItem('User', user)"
            >
              <div
                class="media__image"
                @click="selectItem('User', user)"
                :style="{'background-image': 'url(' + user.avatar.thumb.url + ')'}"
              ></div>
              <div class="media__content">
                <label class="media__title">
                  {{ user.username }}
                  <v-icon v-if="user.user_type == 'artist'"
                    class="user-status"
                    :class="{'online': user.status == 'active'}"
                  >fa-check-circle</v-icon>
                </label>
              </div>
            </div>
          </div>
        </template> -->
    </div>
  </div>
</template>

<script>
import _ from "lodash";
// import AlbumService from '@/services/album'
// import ProductService from '@/services/product'
import MeService from "@/services/me";
import StreamService from '@/services/stream'

export default {
  props: {
    showVideo: {
      type: Boolean,
    },
    fullscreen: {
      type: Boolean,
    },
    dismiss: {
      type: Function,
      required: true,
    },

    title: {
      type: String,
      default: "Attach content to live video"
    },
    value: {
      type: Object,
    },
  },

  data() {
    return {
      active_tab: "Album",
      item: {
        type: "Album",
        value: null,
      },
      albums: [],
      products: [],
      videos: [],
      userSearchKeyword: "",
    };
  },

  computed: {
    attachId() {
      return _.get(this.item.value, "id", 0);
    },
  },

  methods: {
    onTab(tab) {
      this.active_tab = tab;
    },

    selectItem(type, value) {
      this.item = {
        type: type,
        value: value,
      };
      this.$emit("input", this.item);
      this.dismiss();
    },

    loadUsers() {
      console.log("loadUsers");
    },
  },

  created() {
    this.item = {
      type: this._props.value.type,
      value: this._props.value.value,
    };

    this.active_tab = this.item.type;

    this.$store.dispatch("error/showLoadingActivity", true);

    const vid_params = {
      genre_id: 0,
      only_follows: false,
      page: 1,
      per_page: 10,
    }

    Promise.all([
      // AlbumService.getAlbums({
      //   statuses: 'published, collaborated',
      //   user_statuses: 'accepted',
      // }),
      // ProductService.getProducts({
      //   statuses: 'published, collaborated',
      //   stock_statuses: 'active',
      //   user_statuses: 'accepted',
      // }),
      MeService.videoAttachAlbums(),
      MeService.videoAttachProducts(),
      StreamService.getStreams(vid_params) // take further appro. look at data from backend
    ])
      .then((values) => {
        this.albums = values[0].body;
        this.products = values[1].body;
        this.videos = values[2].body.streams;
        this.$store.dispatch("error/showLoadingActivity", false);
      })
      .catch((reason) => {
        console.log(reason);
        this.$store.dispatch("error/showLoadingActivity", false);
        this.$store.dispatch("error/showErrorToast", [reason]);
      });
  },
};
</script>

<style lang="scss" scoped>
.modal-wrapper {
  // z-index: 14;
}

.my-overlay {
  z-index: 15;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.1);
}

.modal {
  z-index: 16;
  position: absolute;
  width: 400px;
  height: 600px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  // border: 0.75px solid #E1E1E1;
  border-left: none;
  border-top-left-radius: 7.5px;
  border-top-right-radius: 7.5px;
  background: #ffffff;
  box-shadow: 3px 3px 10px -4px grey;

  &.fullscreen {
    height: 100%;
  }

  &__title {
    margin: 0;
    padding: 15px;
    font-size: 20px;
    color: #000000;
    letter-spacing: -0.6px;
    position: relative;

    .dismisser {
      position: absolute;
      right: 13px;
      cursor: pointer;
    }
  }

  &__header {
    width: 100%;
    //height: 75px;
    border-top: 0.75px solid #e1e1e1;
    border-bottom: 0.75px solid #e1e1e1;
    border-top-left-radius: 7.5px;
    border-top-right-radius: 7.5px;
    background: #fafafa;
    text-align: center;

    .btn {
      border-radius: 75px;
      text-transform: none;
      box-shadow: none;
      background-color: transparent;
      font-size: 15px;
      color: #000000;
      letter-spacing: -0.6px;
      &.selected {
        background: #3a92ff;
        color: #ffffff;
      }
    }
  }

  .search-box-wrapper {
    // background: #F9FAFB;
    border-bottom: 0.75px solid #e1e1e1;
    padding: 0px 22.5px 15px;
    border-top-left-radius: 7.5px;
    border-top-right-radius: 7.5px;
    .search-box {
      padding: 4px 11.25px;
      width: 100%;
      height: 30px;
      .search-container {
        // width: 375px;
        vertical-align: middle;
        white-space: nowrap;
        position: relative;
        span {
          position: absolute;
          top: 50%;
          margin-left: 8px;
          margin-top: 6px;
          z-index: 1;
        }
        input {
          // width: 375px;
          width: 100%;
          height: 30px;
          background: #f3f3f3;
          float: left;
          padding-left: 30px;
          padding-right: 15px;
          -webkit-border-radius: 75px;
          -moz-border-radius: 75px;
          border-radius: 75px;
          font-size: 15px;
          // color: #ABABAB;
          // text-align: center;
          letter-spacing: -0.6px;
          border: 0.75px solid #c1c1c1;
          // -webkit-transition: background .55s ease;
          // -moz-transition: background .55s ease;
          // -ms-transition: background .55s ease;
          // -o-transition: background .55s ease;
          // transition: background .55s ease;
          &:focus,
          &:hover,
          &:active {
            outline: none;
            // background: rgba(150, 150, 150, 0.2);
          }
          &::-webkit-input-placeholder {
            color: #ababab;
          }
          &:-moz-placeholde {
            color: #ababab;
          }
          &::-moz-placeholder {
            color: #ababab;
          }
          &:-ms-input-placeholder {
            color: #ababab;
          }
        }
      }
    }
  }

  &__content {
    max-height: 485px;
    padding-top: 8px;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .search-box-wrapper + &__content {
    height: 465px;
  }
}

.media {
  padding: 4px 12px;
  display: flex;
  align-items: center;
  // cursor: pointer;

  &.selected {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &__header {
    margin-right: 12px;
  }

  &__image {
    width: 60px;
    height: 60px;
    border-radius: 3.75px;
    background-size: cover;

    &._vid {
      width: 80px;
    }
  }

  &__content {
    width: calc(100% - 80px);
  }

  &__title {
    display: block;
    cursor: pointer;
    font-size: 15px;
    color: #000000;
    letter-spacing: -0.6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__subtitle {
    display: block;
    cursor: pointer;
    opacity: 0.5;
    font-size: 15px;
    color: #000000;
    letter-spacing: -0.6px;
  }
}

.media.user {
  .media__image {
    width: 55px;
    height: 55px;
    border-radius: 27.5px;
    background-size: cover;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    background-position: center;
    background-color: rgba(0, 0, 0, 0.1);
    // border: 0.75px solid rgba(0, 0, 0, 0.3);
  }

  .media__subtitle {
    padding-left: 10px;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    font-weight: 600;
    font-size: 15px;
    color: #000000;
    letter-spacing: 0;
  }
}
</style>
