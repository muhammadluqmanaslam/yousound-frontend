<template>
  <v-container full-authTabs-container fluid>
    <v-layout align-center full-authTabs-wrapper justify-center row>
      <v-flex
        flex-column
        xs6
        allChildrenCenter
        full-authTabs-twin
        full-authTabs-left
        text-center
      >
        <div class="_logo">
          <img
            :src="require('@/assets/nav_logo_primary.png')"
            width="130"
            alt="Yousound Logo"
          />
        </div>

        <v-spacer></v-spacer>

        <div class="_banner">
          <img
            :src="require('@/assets/banner.gif')"
            width="90%"
            alt="artist with sound machine"
          />
        </div>

        <h2 class="intro-title mt-5">The best place for music lovers.</h2>

        <div class="dflex auth-btns mt-3">
          <v-btn :ripple="false" depressed dark round>Signup</v-btn>
          <v-btn :ripple="false" depressed round outline>Login</v-btn>
        </div>

        <h2 class="learn-more">Learn More</h2>

        <v-spacer></v-spacer>

        <app-footer
          v-if="
            $store.getters['navigator/hasNoFooter'].indexOf($route.name) == -1
          "
        ></app-footer>
      </v-flex>

      <v-flex xs6 full-authTabs-twin full-authTabs-right>
        <div class="trending-top dflex align-center justify-space-between">
          <h2 class="trending-title">Trending</h2>

          <content-top-header absolute>
            <template slot="topHeader">
              <ul class="pr-3">
                <li
                  v-for="tab in tabs"
                  :key="tab.id"
                  :href="`#${tab.id}`"
                  class="nav-li"
                  :class="[
                    { 'active tab-active': isActiveTab(tab.id) },
                    `nav-${tab.id}`,
                  ]"
                >
                  <label class="nav-label" @click="onTab(tab.id)">
                    <img
                      v-if="tab.icon"
                      :src="tab.icon"
                      width="18"
                      class="li-icon"
                    />
                    {{ tab.title }}
                  </label>
                </li>

                <v-spacer></v-spacer>

                <!-- <li class="search-li">
                      <search-input :senderRoute="$route.name" />
                    </li> -->
              </ul>
            </template>
          </content-top-header>
        </div>

        <transition name="slide-left">
          <trending-music
            v-if="activeTab === 'music'"
            :listLimit="20"
            classAttr="xs3 px-1 mb-1"
            hideTrackLength
            noMeta
            hideCta
            showHoverTrackInfo
            title=""
            playButton2
            playButton2IconHasWhiteBG
          />
        </transition>

        <transition name="slide-left">
          <trending-video
            v-if="activeTab === 'videos'"
            :listLimit="20"
            classAttr="xs4 px-1"
            title=""
            coverOnly
            showFullOverlay
            hoverOverlay
            hideCta
            coverRadius
          />
        </transition>

        <transition name="slide-left">
          <trending-product
            v-if="activeTab === 'merch'"
            :listLimit="20"
            classAttr="xs3 px-1 mb-1"
            :altMeta="false"
            hideCta
            title=""
            showFullOverlay
          />
        </transition>
      </v-flex>
    </v-layout>
    <!-- <Header></Header>
    <Banner :title="'Listen, watch & shop!'" :imgSrc="bannerImg"></Banner>
    <CRow
      :title="'Free Music'"
      :title2="'Streaming'"
      :imgSrc="img"
      :order1="1"
      :order2="2"
    ></CRow>
    <CRow
      :title="'Watch Videos'"
      :title2="'& Chat'"
      :imgSrc="img3"
      :order1="2"
      :order2="1"
      :bigImage="true"
    ></CRow>
    <CRow
      :title="'Shop Artists'"
      :title2="'& Brands'"
      :imgSrc="img2"
      :order1="1"
      :order2="2"
    ></CRow>

    <CRow
      :title="'Make Money'"
      :title2="'Sharing'"
      :imgSrc="img1"
      :order1="2"
      :order2="1"
      :moneyImage="true"
    ></CRow>
    <join></join>
    <Footer></Footer> -->
  </v-container>
</template>

<script>
import Join from "../../components/landingPages/Join.vue";
import Footer from "../../components/landingPages/Footer.vue";
import Header from "@/components/landingPages/Header.vue";
import Banner from "@/components/landingPages/Banner.vue";
import CRow from "@/components/landing1/CRow.vue";
import appFooter from "@/components/footer";
import { mapActions, mapState } from "vuex";
import trendingMusic from "@/views/mobile/components/trending/music";
import trendingVideo from "@/views/mobile/components/trending/videos";
import trendingProduct from "@/views/mobile/components/trending/products";
import contentTopHeader from "@/components/contentTopHeader";

export default {
  name: "Landing1",
  components: {
    Header,
    Banner,
    CRow,
    Join,
    Footer,
    appFooter,
    trendingMusic,
    trendingVideo,
    trendingProduct,
    contentTopHeader,
  },
  data() {
    return {
      activeTab: "music",
      tabs: [
        { id: "music", title: "Music" },
        { id: "videos", title: "Video" },
        { id: "merch", title: "Shop" },
      ],
      items_per_page: 20,
    };
  },
  computed: {
    ...mapState({
      musicFeed: (state) => state.trending.albums,
    }),
  },
  methods: {
    ...mapActions({
      getTrendingMusic: "trending/getTrendingMusic",
    }),
    isActiveTab(tab) {
      return this.activeTab === tab;
    },
    onTab(tab) {
      this.activeTab = tab;
    },
    loadTrendingMusic() {
      if (this.musicFeed.length) return;

      const params = {
        filter: "new",
        genre: "any",
        category: "any",
        page: 1,
        per_page: this.items_per_page,
      };

      this.getTrendingMusic(params);
    },
  },
};
</script>

<style lang="scss" scoped>
.full-authTabs {
  &-container {
    // padding: 20px;
    position: fixed;
    width: 100%;
    top: 0;
    // min-height: 70vh;
  }

  &-twin {
    height: 100vh;
  }

  &-left {
    .intro-title {
      font-size: 28px;
    }

    .learn-more {
      text-decoration: underline;
      cursor: pointer;
      margin-top: 20px;
      font-size: 20px;
    }
  }

  &-right {
    overflow-y: scroll;
    position: relative;

    &::-webkit-scrollbar {
      width: 2px;
      display: none;
    }

    &::-webkit-scrollbar-track {
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      display: none;
    }

    .trending {
      &-top {
        position: sticky;
        top: 0;
        z-index: 9;
        background-color: #ffffff;

        .trending-title {
          font-weight: 700;
          font-size: 24px;
          line-height: 40px;
          letter-spacing: -1px;
        }

        .top-menu {
          width: fit-content;
        }
      }

      &-music {
        padding-right: 10px;
        padding-left: 10px;
      }
    }

  }
}
</style>
