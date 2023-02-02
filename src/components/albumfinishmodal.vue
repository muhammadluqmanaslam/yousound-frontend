<template>
  <v-flex class="collaborators-success-dialog">
    <v-card>
      <v-card-title class="headline">
        <div class="dflex gap-15" style="padding-top: 10px">
          <div>
            <img src="../assets/black-check.svg" width="25">
          </div>
          <div class="headline-text" v-if="this.type === 'album'">
            Your album was released! <a href="/upload/album" style="text-decoration: underline !important">Upload another</a> or go to <router-link to="/upload" style="text-decoration: underline !important">upload page</router-link> 
          </div>
          <div class="headline-text" v-else-if="this.type === 'stream'">
            Your video was released! <a href="/upload/video" style="text-decoration: underline !important">Upload another</a> or go to <router-link to="/upload" style="text-decoration: underline !important">upload page</router-link> 
          </div>
          <div class="headline-text" v-else-if="this.type === 'product'">
            Your product was released! <a href="/upload/product/add" style="text-decoration: underline !important">Upload another</a> or go to <router-link to="/upload" style="text-decoration: underline !important">upload page</router-link> 
          </div>
        </div>
      </v-card-title>

      <div class="modal-body">
        <div class="dflex gap-20">
          <div class="w-30 border-round">
            <img :src="item.cover.url" width="100%" v-if="type == 'stream' || type == 'album'">
            <img :src="item.covers[0].cover.url" width="100%" v-else>
          </div>
          <div class="w-70">
            <div>
              <h3 class="main-head">{{ item.name }}</h3>
              <p class="mb-0 second-head mx-0 my-0">{{ type == 'product' ? item.merchant.username : item.user.username }}</p>
              <p class="light-text mx-0 my-0" v-if="type === 'album'">{{ item.tracks.length }} tracks</p>
              <p class="light-text mx-0 my-0" v-if="type !== 'product'">{{ type === 'album' ? item.genres[0] && item.genres[0].name : item.genre.name }}</p>
              <p class="light-text mx-0 my-0" v-if="type == 'product'">{{ item.category.name }}</p>
            </div>
            <hr class="my-4">

            <div class="dflex align-center gap-20">
              <div class="dflex align-center gap-15">
                <a href="#"><img src="../assets/email-xcon.svg" width="16"></a>
                <a href="#"><img src="../assets/facebook-xcon.svg" width="10"></a>
                <a href="#"><img src="../assets/twitter-xcon.svg" width="17"></a>
              </div>
              <div class="url-bar">
                <p class="mx-0 my-0">{{ albumURL }}</p>
                <div
                  class="clipboard-btn"
                  v-clipboard:copy="albumURL"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >
                  <img src="../assets/clone.svg" width="16">
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <div class="dflex align-center justify-space-between gap-max">
          <div class="w-100">
            <h2 class="foot-head">
              Promote your profile
            </h2>
            <p class="mx-0 my-0 mt-2">
              Upload a spotlight video to promote your content to new subscribers!
            </p>

            <router-link to="#">
              <v-btn class="mt-4 fx-btn ml-0">
                Add spotlight
              </v-btn>
            </router-link>
          </div>
          <div class="w-100">
            <img src="../assets/spotlight-demo.png" width="100%">
          </div>
        </div>

      </div>
    </v-card>

  </v-flex>
</template>

<script type="text/javascript">
import _ from "lodash";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    promote: {
      type: Function,
      required: true,
    },
    dismiss: {
      type: Function,
      required: true,
    },
    type: String,
  },

  components: {},

  data() {
    return {
      showPromoteMessage: false,
      albumURL: "",
    };
  },

  computed: {
    itemProduct() {
      return _.get(this.item, "products[0]");
    },

    itemCover() {
      if (this.item.slug) {
        return this.item.cover.url;
      } else {
        var coverURL = "";
        for (let index in this.item.covers) {
          const cover = this.item.covers[index].cover;
          if (cover.url) {
            coverURL = cover.url;
            break;
          }
        }
        return coverURL;
      }
    },
  },

  created() {
    if (this.type === 'album') {
      this.albumURL = window.location.origin + "/album/" + this.item.slug;
    } else if (this.type === 'stream') {
      this.albumURL = window.location.origin + "/video/" + this.item.id + "/show";
    } else {
      this.albumURL = window.location.origin + "/product/" + this.item.id;
    }
  },

  methods: {
    showPromoteModal() {
      this.promote();
    },

    onCopy: function (e) {
      this.$store.dispatch("error/showSuccessToast", [
        "You just copied: " + e.text,
      ]);
      // alert('You just copied: ' + e.text)
    },

    onError: function (e) {
      this.$store.dispatch("error/showErrorToast", ["Failed to copy link"]);
      // alert('Failed to copy link')
    },
  },
};
</script>
<style scoped src="../../static/styles/album.scss" lang="scss"></style>
