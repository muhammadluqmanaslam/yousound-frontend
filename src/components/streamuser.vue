<template>
  <v-flex class="stream-user">
    <v-flex xs12 class="track-info" pa-0>
      <v-flex xs12 class="track-user" pa-0>
        <profile-item
          :user="user"
          :className="'track-user-avatar'"
        ></profile-item>
        <div class="activity-section">
          <router-link class="user-name" :to="'/' + user.slug">{{
            user.username
          }}</router-link
          >&nbsp;
          <v-icon
            v-if="user.user_type == 'artist'"
            class="user-status"
            :class="{ online: user.status == 'active' }"
            >fa-check-circle</v-icon
          >&nbsp;
          <label class="description-text"
            >{{ actionText }}
            <label class="items-title" @click="doAction()">{{
              user.recent_items[0].assoc.name
            }}</label>
          </label>
        </div>
      </v-flex>
    </v-flex>

    <v-layout row wrap class="covers-content" mt-2>
      <div
        v-for="(feed, index) in user.recent_items"
        v-if="['Album', 'ShopProduct', 'Stream'].indexOf(feed.assoc_type) > -1"
        :key="index"
        class="card-container"
      >
        <track-card
          v-if="feed.assoc_type == 'Album'"
          :objects="user.recent_items"
          :objectIndex="index"
        />
        <product-card
          v-if="feed.assoc_type == 'ShopProduct'"
          :dataObject="feed"
        />
        <video-box v-if="feed.assoc_type == 'Stream'" :item="feed.assoc" />
      </div>
    </v-layout>

    <merch-modal
      v-if="showMerchModal && user.recent_items[0].assoc_type === 'ShopProduct'"
      :item="user.recent_items[0].assoc"
      :dismiss="dimissMerchModal"
    />
  </v-flex>
</template>

<script type="text/javascript">
import merchModal from "@/components/merchmodal";
import productCard from "@/components/productcard";
import profileItem from "@/components/profileitem";
import trackCard from "@/components/trackcard";
import VideoBox from "@/components/video_box";
// import videoCard from '@/components/videocard'

export default {
  components: {
    merchModal,
    productCard,
    profileItem,
    trackCard,
    VideoBox,
    // videoCard
  },

  props: {
    user: {
      type: Object,
    },
  },

  data() {
    return {
      showMerchModal: false,
    };
  },

  computed: {
    recentItem() {
      return this.user.recent_items[0] || {};
    },

    actionText() {
      let _text = "";
      switch (this.recentItem.feed_type) {
        case "release":
          if (this.recentItem.assoc_type === "Stream") {
            _text = "broadcasted";
          } else if (
            this.recentItem.assoc_type === "Album" &&
            this.recentItem.assoc.album_type === "playlist"
          ) {
            _text = "created playlist";
          } else {
            _text = "released";
          }
          break;
        case "repost":
          _text = "reposted";
          break;
        case "unrepost":
          _text = "unreposted";
          break;
        case "follow":
          _text = "followed";
          break;
        case "unfollow":
          _text = "unfollowed";
          break;
        case "download":
          _text = "downloaded";
          break;
        // case 'play':
        //   _text = 'played'
        //   break
        default:
          _text = this.recentItem.feed_type;
          break;
      }
      return _text;
    },
  },

  created() {},

  methods: {
    doAction() {
      switch (this.recentItem.assoc_type) {
        case "ShopProduct":
          this.showMerchModal = true;
          break;
        case "Album":
          this.$router.push({ path: "album/" + this.recentItem.assoc.slug });
          break;
      }
    },

    dimissMerchModal() {
      this.showMerchModal = false;
    },
  },
};
</script>
