<template>
  <div class="repost-comp repost-videos">
    <div class="_top mb-3">{{ videos.length }} {{ "video" | pluralize(videos.length) }}</div>

    <div class="list-track-view list-track-view-trackCard list-track-view-video listings">
      <div
        v-for="(video, index) in videos"
        :key="index"
        class="list-track-view-item listing cursor-none"
      >
        <video-box
            hoverOverlay
            :item="tempVideo"
            sideTabView
            hideUser
            noMeta
            showUsername
          />

        <div class="d-none list-track-view-action listing-action">
          <span class="share" @click="shareVideo(tempVideo)">
            <img :src="require('@/assets/ic_share.svg')" alt="share icon" />
          </span>
          <span class="add">
            <v-icon>add</v-icon>
          </span>
          <span class="more">
            <v-icon>more_horiz</v-icon>
          </span>
        </div>
      </div>
    </div>

    <share-modal
      v-if="share_dialog"
      :item="sharedVideo"
      type="Stream"
      :dismiss="closeShareVideo"
    />
  </div>
</template>

<script>
import shareModal from "@/components/sharemodal";
import VideoBox from "@/components/video_box";

export default {
  components: {
    shareModal,
    VideoBox,
  },
  data() {
    return {
      videos: [1,2,3,4],
      share_dialog: false,
      sharedVideo: {},
    };
  },
  methods: {
    shareVideo(video) {
      this.sharedVideo = video;
      this.share_dialog = true;
    },
    closeShareVideo(tab) {
      this.share_dialog = false;
      this.sharedVideo = {};
    },
  },
  computed: {
    tempVideo() {
      return {
        id: 106,
        name: "Artists pay for fake plays so they can make real money",
        slug: "artists-pay-for-fake-plays-so-they-can-make-real-money",
        description:
          "You can't even do that on YouSound.  Your money goes to the real artists you support.",
        cover: {
          url: "https://d19mruzykfu6hg.cloudfront.net/uploads/stream/cover/106/46b51f02-7d85-47c2-8f6d-e64f94600063.png",
          large: {
            url: "https://d19mruzykfu6hg.cloudfront.net/uploads/stream/cover/106/large_46b51f02-7d85-47c2-8f6d-e64f94600063.png",
          },
          thumb: {
            url: "https://d19mruzykfu6hg.cloudfront.net/uploads/stream/cover/106/thumb_46b51f02-7d85-47c2-8f6d-e64f94600063.png",
          },
        },
        video_type: "uploaded",
        status: "archived",
        started_at: null,
        stopped_at: null,
        mp_channel_1_ep_1_url:
          "https://stream.mux.com/GXGDdqaRcICjhbl00sUPkI1EUgZ5B301uE02vNyW8lrXgk.m3u8",
        mp_channel_2_url:
          "https://storage.googleapis.com/video-storage-us-east1-uploads/Tr6EE01VUl7fuFoq00TOaeFqzTy664E9v3KTUpbDdZsDI?Expires=1646182096&GoogleAccessId=direct-uploads-writer-prod%40mux-cloud.iam.gserviceaccount.com&Signature=e8vnOAeAnbw1PaUdlfKfILPva7m1ClLiQV1BMypjOKmrf38Gw%2B7eGPPq1gQcRHXxRBlI4y8LX%2BEOOUTRhYk12CFHdT7pVTxYq1DL%2BG1%2BhGEKNbTu9WP3rS4o1Muwnp3HSgPcQ0KLGkiBvuMS3ZqHPnEfHcXNvzU134mZYTOsQt8HSuSFsJ3GSFKA331fbEuQ45KVG5dIYP2Q%2BnwVCsutZmsvUor1dJQc1OLIY0nJh2BHGVpb5HGO3R6RKqjkwNeOfL0kQj3DRSxk3BSN17CTXtPmvtfyNex8MMj1b60f4htM6WE9esUOAUlCdAY2fGoltoDI8WGtEoJz6WpFUDlpsQ%3D%3D&upload_id=ADPycdvIc-J9YpNuIdymwXqTOn-LCXr7CW9rA-fNiZz0gMIpq6xsQZzk3OVz7tvBrzwA9WLhyK97iXXg4U5j0KpGc9fDAtzh6A",
        duration: 100,
        valid_period: 0,
        remaining_seconds: 0,
        assoc_type: null,
        account_ids: [],
        digital_content_name: null,
        view_price: 0,
        viewers_limit: 0,
        notified: true,
        assoc: null,
        guests: [],
        is_reposted: false,
        broadcast_seconds: 0,
        digital_content_url: null,
        accounts: [],
        user: {
          id: 59,
          slug: "yousoundapp",
          username: "yousoundapp",
          display_name: "",
          first_name: null,
          last_name: null,
          contact_url: null,
          user_type: "artist",
          avatar: {
            url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/59/ef8c3ab0-46e3-4534-a962-341aedb90521.png",
            thumb: {
              url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/59/thumb_ef8c3ab0-46e3-4534-a962-341aedb90521.png",
            },
          },
          repost_price: 100,
          repost_price_end_at: null,
          max_repost_price: 100,
          status: "active",
          size_chart: "",
          shipping_policy: "",
          return_policy: "",
          privacy_policy: "",
          followers: 1,
          followings: 2,
          stripe_connected: true,
          stripe_customer_id: null,
          stripe_subscription_id: null,
          phone_number: null,
          masked_phone_number: null,
          age_group: "",
          social_provider: null,
          is_following: true,
          invited_at: null,
          social_user_name: "",
          request_role: "artist",
          request_status: "accepted",
          country: "",
          city: "",
        },
        genre: {
          id: 385,
          slug: "verbal",
          name: "VERBAL",
          region: "",
          color: "#6867D3",
          sequence: 21,
          users_size: 0,
        },
      };
    },
  },
};
</script>

<style>
</style>