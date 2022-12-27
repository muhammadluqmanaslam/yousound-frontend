<template>
  <v-flex xs12 sm12 class="share-section" :class="{ onMobile }">
    <v-flex xs12 sm12 class="dismiss-section" @click="dismiss()"></v-flex>
    <div row wrap class="popup-section">
      <v-flex xs12 class="dflex profile-section">
        <router-link :to="'/' + user.slug"
          ><div
            class="avatar-image"
            :style="{
              'background-image': 'url(' + user.avatar.thumb.url + ')',
            }"
          ></div
        ></router-link>
        <router-link :to="'/' + user.slug">
          <label class="user-name"
            >{{ user.username }}
            <v-icon
              class="user-status"
              v-bind:class="{ online: user.status == 'active' }"
              v-if="user.user_type == 'artist'"
              >fa-check-circle</v-icon
            ></label
          ></router-link>

        <v-spacer></v-spacer>

        <user-follow-btn
          v-if="user.id != $store.state.auth.user.id"
          :user="user"
          theme="dark"
          type="default"
          @afterFollow="afterFollow"
        />
      </v-flex>

      <v-flex xs12 class="item-section">
        <div
          class="item-image"
          :style="{ 'background-image': 'url(' + itemCover + ')' }"
        ></div>
        <p class="item-name">{{ item.name }}</p>
      </v-flex>

      <v-flex xs12 class="share-social-section">
        <!-- <v-btn class="social-share-btn"><v-icon>fa-envelope</v-icon></v-btn> -->
        <social-sharing v-bind:url="shareUrl" inline-template>
          <div class="social-section">
            <network network="facebook">
              <!-- <i class="fa fa-fw fa-facebook"></i> Facebook -->
              <v-btn class="social-share-btn"
                ><v-icon>fa-facebook</v-icon></v-btn
              >
            </network>
            <network network="twitter">
              <!-- <i class="fa fa-fw fa-twitter"></i> Twitter -->
              <v-btn class="social-share-btn"
                ><v-icon>fa-twitter</v-icon></v-btn
              >
            </network>
          </div>
        </social-sharing>
      </v-flex>

      <v-flex xs12 class="input-section">
        <input
          type="text"
          class="form-control clipboard-url"
          v-model="shareUrl"
          readonly
        />
        <v-btn
          class="clipboard-btn"
          v-clipboard:copy="shareUrl"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >
          <v-icon>fa-clipboard</v-icon>
        </v-btn>
      </v-flex>
    </div>
  </v-flex>
</template>

<script type="text/javascript">
import AlbumService from "@/services/album";
import UserFollowBtn from "@/components/userFollowBtn";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
    },
    dismiss: {
      type: Function,
      required: true,
    },
  },
  components: {
    UserFollowBtn,
  },

  data() {
    return {
      donate_amount: null,
      buttonHover: false,
      shareUrl: "",
    };
  },

  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    followButtonText() {
      if (this.user.is_following) {
        return this.buttonHover ? "Unfollow" : "Following";
      }
      return "Follow";
    },

    itemType() {
      switch (this.type) {
        case "Stream":
          return "Stream";
        default:
          if (this.item.slug) {
            return "Album";
          } else {
            return "ShopProduct";
          }
      }
    },

    user() {
      if (this.item.slug) {
        return this.item.user;
      } else {
        return this.item.merchant;
      }
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
    switch (this.itemType) {
      case "Stream":
        this.shareUrl = window.location.origin + "/video/" + this.item.slug;
        break;
      case "Album":
        this.shareUrl = window.location.origin + "/album/" + this.item.slug;
        break;
      case "ShopProduct":
        this.shareUrl = window.location.origin + "/product/" + this.item.id;
        break;
    }
  },

  methods: {
    donateAmount(amount) {
      this.donate_amount = amount;
    },

    dismissModal() {
      console.log("touched");
    },
    afterFollow(isfollowing) {
      if (isfollowing === "unfollow") {
        this.item.user.is_following = false;
      } else if (isfollowing === "follow") {
        this.item.user.is_following = true;
      }
    },

    downloadItem() {
      this.dismiss();
      AlbumService.downloadAlbum(this.item.id)
        .then((response) => {
          this.$store.dispatch("error/showSuccessToast", [
            "You just download " + this.item.name,
          ]);
        })
        .catch((e) => {
          this.$store.dispatch(
            "error/showErrorToast",
            e.body.errors || [e.body]
          );
        });
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
