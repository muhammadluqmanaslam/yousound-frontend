<template>
  <div class="attach-wrapper">
    <div
      v-if="Object.keys(assoc).length"
      class="attach-layer attach-layer-selected"
    >
      <div class="attach-info ii">
        <div
          class="__cover"
          :style="{ 'background-image': 'url(' + attachCover + ')' }"
        ></div>
        <div class="__details">
          <div class="_title"></div>
          <div class="_info"></div>
        </div>
      </div>
      <v-icon class="attach-cancel cursor-pointer" @click="removeAttach()">
        add
      </v-icon>
    </div>

    <div class="thought-attachment">
      <div class="thought-attachment-previews">
        <div
          class="_preview add-attachment dflex align-center justify-center"
          @click="show_attach_picker = true"
        >
          <v-icon>add</v-icon>
        </div>

        <div
          v-for="(attachment, index) in truncAttachment"
          :key="index"
          class="_preview mb-1"
          :class="[getCustomClass(attachment)]"
          :style="{ 'background-image': 'url(' + getBGUrl(attachment) + ')' }"
          @click="
            selectAttachment({
              type: getAssocType(attachment),
              value: attachment,
            })
          "
        ></div>
      </div>
    </div>

    <attach-picker
      v-if="show_attach_picker"
      @getSelected="selectAttachment"
      :dismiss="closeAttachPicker"
      title="Add Attachment"
      :customAlbums="albums"
      :customProducts="products"
      fullscreen
    />
  </div>
</template>

<script>
import MeService from "@/services/me";
import StreamService from "@/services/stream";
import AttachPicker from "@/views/video/components/attach_picker";

export default {
  props: {
    // assoc: {
    //   type: Object,
    //   required: true,
    // },
    customAlbums: {
      type: Array,
    },
    customProducts: {
      type: Array,
    },
    attachPickerTitle: String,
    ctaTitle: String,
  },
  data() {
    return {
      assoc: {},
      truncAttachment: [],
      show_attach_picker: false,
      albums: [],
      products: [],
      videos: [],
    };
  },
  components: {
    AttachPicker,
  },
  watch: {
    customAlbums() {
      this.getAttachments();
    },
    customProducts() {
      this.getAttachments();
    },
  },
  methods: {
    removeAttach() {
      this.assoc = {};
      this.$emit("getAttachment", this.assoc);
    },
    closeAttachPicker() {
      this.show_attach_picker = false;
    },
    selectAttachment(data) {
      this.assoc = data;

      this.$emit("getAttachment", data);
    },
    getBGUrl(attachment) {
      if (attachment.merchant && Object.keys(attachment.merchant).length) {
        return attachment.covers[0].cover.thumb.url;
      } else {
        return attachment.cover.thumb.url;
      }
    },
    getCustomClass(attachment) {
      if (attachment.album_type && attachment.album_type === "album") {
        return "attach_album";
      } else if (attachment.video_type) {
        return "attach_video";
      } else if (
        attachment.merchant &&
        Object.keys(attachment.merchant).length
      ) {
        return "attach_product";
      }
    },
    getAssocType(attachment) {
      if (attachment.album_type && attachment.album_type === "album") {
        return "Album";
      } else if (attachment.video_type) {
        return "Video";
      } else if (
        attachment.merchant &&
        Object.keys(attachment.merchant).length
      ) {
        return "ShopProduct";
      }
    },
    shuffleData(arr) {
      // let arr = [1,2,3]
      let newArr = [];
      let allIdx = arr.length - 1;
      let currentIdx;

      while (allIdx > -1) {
        currentIdx = Math.floor(Math.random() * arr.length);
        newArr[allIdx] = arr[currentIdx];
        allIdx--;
      }

      return newArr;
    },
    getAttachments() {
      const vid_params = {
        genre_id: 0,
        only_follows: false,
        page: 1,
        per_page: 10,
      };

      Promise.all([
        MeService.videoAttachAlbums(),
        MeService.videoAttachProducts(),
        StreamService.getStreams(vid_params), // take further appro. look at data from backend
      ])
        .then((values) => {
          this.albums = this.customAlbums || values[0].body;
          this.products = this.customProducts || values[1].body;
          this.videos = values[2].body.streams;

          let all = [...this.albums, ...this.products, ...this.videos];
          this.truncAttachment = this.shuffleData(all).slice(0, 12);
          console.log(this.truncAttachment);
        })
        .catch((reason) => {
          console.log(reason);
          this.$store.dispatch("error/showErrorToast", [reason]);
        });
    },
  },
  computed: {
    attachCover() {
      switch (this.assoc.type) {
        case "ShopProduct":
          return this.assoc.value.covers[0].cover.thumb.url;
        case "Album":
          return this.assoc.value.cover.thumb.url;
        default:
          break;
      }
    },
  },
  created() {
    this.getAttachments();
  },
};
</script>

<style lang="scss" scoped>
.attach-wrapper {
  background-color: #ffffff;
  margin-bottom: 34px;

  .attach-layer {
    &-selected {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;

      .attach-info {
        display: flex;
        justify-content: space-between;

        .__cover {
          width: 70px;
          height: 70px;
          border-radius: 3px;
          background-color: grey;
          margin-right: 20px;
          background-position: center;
          background-size: cover;
        }
      }

      .attach-cancel {
        transform: rotate(45deg);
        color: #000000;
      }
    }
    &-select {
      display: flex;
      align-items: center;
      color: #0386ff;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .thought-attachment {
    padding: 0 10px;
    overflow: hidden;
    overflow-x: scroll;

    &-previews {
      display: inline-flex;
      border-top: 0.75px solid #e4e4e4;
      border-bottom: 0.75px solid #e4e4e4;
      padding: 5px 0;
      position: relative;
      // padding-left: 58px;

      ._preview {
        width: 50px;
        height: 50px;
        border-radius: 7px;
        margin-right: 8px;
        background-size: contain;
        box-shadow: 0 0 1px 0px #ced5dc;

        // &:nth-child(2) {
        //   &::before {
        //     content: "";
        //   }
        // }

        &.attach_video {
          width: 85px;
        }
        &.add-attachment {
          background-color: #ced5dc;
          // position: fixed;
          // left: 9px;

          &::after {
            // content: "";
            position: absolute;
            background-color: #ffffff;
            left: -10px;
            top: -5px;
            width: calc(100% + 40px);
            height: calc(100% + 13px);
            z-index: -999999;
          }
        }
      }
    }
  }
}
</style>
