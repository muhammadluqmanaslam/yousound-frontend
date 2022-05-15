<template>
  <div class="page-onMobile discover-onMobile">
    <search-input class="mb-2" isOnMobile />
    <tab-nav :tabData="tabs" ref="tabData" @tabClicked="tabClicked" recChip />

    <div v-if="showTrending" class="page-content">
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
import SearchInput from "@/components/searchInput";
import TabNav from "../components/tab_nav.vue";

import trendingMusic from "../components/trending/music";
import trendingVideo from "../components/trending/videos";
import trendingProduct from "../components/trending/products";

import discoverMusic from "./music";
import discoverVideo from "./video";
import discoverProduct from "./product";

export default {
  components: {
    SearchInput,
    TabNav,
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
      activeDiscover: "album",
      isComp: true,
      tabs: [
        { id: "album", title: "Music" },
        { id: "video", title: "Video" },
        { id: "merch", title: "Shop" },
      ],
      showTrending: !false,
    };
  },
  methods: {
    tabClicked(data) {
      this.showTrending = false;
      this.activeDiscover = data.id;
    },
  },
  created() {
    this.showTrending = true;

    // set activeDiscover if instructed passed via route
    const { activeDiscover } = this.$route.params;
    console.log("activeDiscover:", activeDiscover);

    if (activeDiscover) {
      // BUG to fix
      this.$nextTick(() => {
        this.tabClicked(this.tabs.find((tab) => tab.id === activeDiscover));
      });
      this.$forceUpdate();
    }
    console.log("this.activeDiscover::", this.activeDiscover);
  },
  mounted() {},
};
</script>

<style src="../../../../static/styles/mobile/search_input.scss" lang="scss"></style>
