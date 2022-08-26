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
            class="cursor-pointer"
            @click="activeView = 'landingView'"
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
          <v-btn
            :ripple="false"
            depressed
            dark
            round
            @click="activeView = 'signUpView'"
          >
            Signup
          </v-btn>
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

      <v-flex
        xs6
        full-authTabs-twin
        full-authTabs-right
        :class="{ signup__view: activeView == 'signUpView' }"
      >
        <div v-if="activeView === 'landingView'" class="landing-view">
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
        </div>

        <div v-if="activeView === 'signUpView'" class="signup-view">
          <Onboarding />
        </div>
      </v-flex>
    </v-layout>
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
import Onboarding from "@/views/mobile/auth/onboarding";

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
    Onboarding,
  },
  data() {
    return {
      activeView: "landingView",
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
    border-right: 1px solid rgba(0, 0, 0, 0.08);

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
    padding-left: 20px;

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

    &.signup__view {
      display: grid;
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

    .signup-view {
      width: 60%;
      margin: 0 auto;
      height: 55%;
      align-self: center;

      .onboarding {
        min-height: 100%;
        justify-content: space-around;

        /deep/ .stager {
          position: relative;
        }

        /deep/ &_comp {
          &.profile-image {
            .profile-image-holder {
              margin-top: 40px;
              width: 200px;
              height: 200px;
            }
          }
        }
      }
    }
  }
}
</style>
