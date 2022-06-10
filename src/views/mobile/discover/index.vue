<template>
  <div class="page-onMobile discover-onMobile">
    <pane-tabs :paneTabs="tabs" ref="paneTabs" :initSelected="initSelected" @tabClicked="tabClicked" recChip />

    <div v-if="activeDiscover == 'trending'" class="page-content">
      <trending-music isComp :listLimit="10" />
      <trending-video isComp :listLimit="10" />
      <trending-product isComp :listLimit="10" />
    </div>

    <div v-else class="page-content">
      <discover-music v-if="activeDiscover == 'album'" />
      <discover-video v-if="activeDiscover == 'video'" />
      <discover-product v-if="activeDiscover == 'merch'" />
    </div>
  </div>
</template>

<script>
import PaneTabs from "../components/paneTabs.vue";

import trendingMusic from "../components/trending/music";
import trendingVideo from "../components/trending/videos";
import trendingProduct from "../components/trending/products";

import discoverMusic from "./music";
import discoverVideo from "./video";
import discoverProduct from "./product";

export default {
  components: {
    PaneTabs,
    trendingMusic,
    trendingVideo,
    trendingProduct,
    discoverMusic,
    discoverVideo,
    discoverProduct,
    // ItemTab,
  },
  data() {
    return {
      activeDiscover: "trending",
      initSelected: "trending",
      isComp: true,
      tabs: [
        { id: "trending", title: "Hot", icon: require("@/assets/hot.svg") },
        { id: "album", title: "Music", icon: require("@/assets/music_note.svg") },
        { id: "video", title: "Video", icon: require("@/assets/video_camera.svg") },
        { id: "merch", title: "Shop", icon: require("@/assets/shop_bag.svg") },
      ],
      showTrending: false,
      searchPlaceholder: "Search",
    };
  },
  watch: {
    activeDiscover(val) {
      console.log("change placeholder", val);
      switch (val) {
        case "album":
          this.searchPlaceholder = "Search Music";
          break;
        case "video":
          this.searchPlaceholder = "Search Video";
          break;
        case "merch":
          this.searchPlaceholder = "Search Shop";
          break;
        default:
          this.searchPlaceholder = "Search";
          break;
      }
    },
  },
  methods: {
    tabClicked(data) {
      console.log("clickr 2");
      this.showTrending = false;
      this.activeDiscover = data.id;
    },
  },
  created() {
    // set activeDiscover if instructed passed via route
    const { activeDiscover } = this.$route.params;

    if (activeDiscover) {
      // BUG to fix
      this.activeDiscover = activeDiscover
      this.initSelected = activeDiscover
    }
  },
};
</script>

<style src="../../../../static/styles/mobile/search_input.scss" lang="scss"></style>
