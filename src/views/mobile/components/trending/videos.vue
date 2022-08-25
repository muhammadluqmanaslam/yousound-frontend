<template>
  <div class="trending-comp trending-videos">
    <div v-if="title" class="top-bar">
      <h2 class="bar-title">{{ title }}</h2>
      <!-- <div class="bar-action">View All</div> -->
    </div>

    <item-tab mode="grid" minHeight="180" class="mb-3">
      <template slot="itemTabs">
        <span
          v-for="(feed, index) in videoFeed"
          :key="index"
          :class="['tab-holder px-0 flex', classAttr]"
        >
          <video-box
            :hoverOverlay="false"
            :item="feed"
            hideUser
            hideFreeTag
            :showFullOverlay="showFullOverlay"
            :coverOnly="coverOnly"
            :coverRadius="coverRadius"
          />
        </span>
      </template>
    </item-tab>

    <!-- <item-tab minHeight="180">
      <template slot="itemTabs">
        <span
          v-for="(feed, index) in videoFeed2"
          :key="index"
          class="tab-holder"
        >
          <video-box :hoverOverlay="false" :item="feed" hideUser hideFreeTag />
        </span>
      </template>
    </item-tab> -->

    <div v-if="!hideCta" class="cta">
      <v-btn block outline class="cta-btn">
        <strong> View all videos </strong>
      </v-btn>
    </div>
  </div>
</template>

<script>
import itemTab from "@/components/itemTab";
import VideoBox from "@/components/video_box";
import { mapActions, mapState } from "vuex";

export default {
  props: {
    title: {
      type: String,
      default: "Trending Videos",
    },
    classAttr: {
      type: String,
      default: "xs6 md6",
    },
    listLimit: Number,
    hideCta: Boolean,
    showFullOverlay: Boolean,
    coverOnly: Boolean,
    coverRadius: Boolean,
  },
  components: {
    itemTab,
    VideoBox,
  },
  data() {
    return {
      only_follows: false,
    };
  },
  computed: {
    ...mapState({
      videoFeed: (state) => state.trending.videos,
    }),
    items_per_page() {
      return 1 * this.listLimit || 50;
    },
    videoFeed1() {
      const split = this.videoFeed.slice(0, this.videoFeed.length / 2);
      return split;
    },
    videoFeed2() {
      const split = this.videoFeed.slice(
        this.videoFeed.length / 2,
        this.videoFeed.length
      );
      return split;
    },
  },
  methods: {
    ...mapActions({
      getTrendingVideos: "trending/getTrendingVideos",
    }),
    loadTrendingVideos() {
      if (this.videoFeed.length) return;

      const params = {
        genre_id: 0,
        only_follows: this.only_follows,
        page: 1,
        per_page: this.items_per_page,
      };

      this.getTrendingVideos(params);
    },
    loadData(tab, page) {
      const params = {
        genre_id: tab,
        only_follows: this.only_follows,
        page: page,
        per_page: this.items_per_page,
      };
      StreamService.getStreams(params)
        .then((response) => {
          this.videos = this.videos.concat(response.body.streams);

          // this will return a a prop limit if available
          this.videos = this.videos.slice(
            0,
            this.listLimit || this.videos.length
          );

          // this.videos.filter((v) => )
          // this.videos = [ ...this.videos, ...this.videos]
          console.log(this.videos);
          this.pagination = response.body.pagination;
          this.videoGenres = response.body.genres;
          this.$store.dispatch("error/showLoadingActivity", false);
          this.isPageReady = true;
        })
        .catch(() => {
          this.$store.dispatch("error/showLoadingActivity", false);
        });
    },
  },
  created() {
    this.loadTrendingVideos();
  },
};
</script>

<style lang="scss" scoped>
.trending-videos {
  margin-top: 20px;

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /deep/ .box {
    padding: 9px;

    &__subtitle {
      width: 162px;
    }
    &__footer {
      padding-left: 0 !important;

      .box__subtitle {
        width: 177px;
      }
    }
  }
}
</style>