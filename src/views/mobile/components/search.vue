<template>
  <div
    class="mobile-search"
    :class="{ searchDone, searchSuccessful, searchFailed }"
  >
    <span v-if="!searchDone">
      <div class="top-section">
        <h1 class="_title">Search</h1>
        <v-icon @click="closeSearchModal">keyboard_arrow_down</v-icon>
      </div>
      <div class="subsection">
        <div class="_subtitle">Music, videos, products & people</div>
      </div>
    </span>

    <span v-if="searchDone">
      <div class="_top dflex top-section">
        <img
          class="_left-icon"
          :src="require('@/assets/search.svg')"
          width="24"
          @click="resetSearch"
        />
        <div class="logo-wrapper">
          <img
            class="_logo"
            :src="require('@/assets/ys_logo_primary-black.svg')"
            width="130"
          />
        </div>
        <v-icon class="min-icon" @click="closeSearchModal()">
          keyboard_arrow_down
        </v-icon>
      </div>

      <div class="subsection">
        <div v-if="searchSuccessful" class="result-for">Search result for:</div>
        <div v-if="searchFailed" class="result-for">No search result for:</div>
        <div class="keyword">{{ searchQuery }}</div>
      </div>
    </span>

    <div v-if="searchSuccessful" class="results">
      <div class="_label">
        <div class="label-title">People</div>
        <div class="label-count">{{ usersResults.length }} results</div>
      </div>
      <div class="each_result user-results">
        <div
          v-for="(result, index) in usersResults"
          :key="index"
          class="search-result user-result"
        >
          <user-tag
            :user="result"
            width="40"
            height="40"
            showAvatar
            showUserType
          />
          <user-follow-btn :user="result" theme="dark" />
        </div>
      </div>

      <div class="each_result album-results">
        <div class="_label">
          <div class="label-title">Music</div>
          <div class="label-count">{{ albumResults.length }} results</div>
        </div>
        <div
          v-for="(result, index) in albumResults"
          :key="index"
          class="search-result album-result"
        >
          <trackcardsimple
            :item="result"
            :cover="result.cover.thumb.url"
            :title="result.name"
            :subtitle="result.user.username"
          />
        </div>
      </div>

      <div class="each_result video-results">
        <div class="_label">
          <div class="label-title">Videos</div>
          <div class="label-count">{{ videoResults.length }} results</div>
        </div>
        <div
          v-for="(result, index) in videoResults"
          :key="index"
          class="search-result video-result"
        >
          <video-box
            hoverOverlay
            :item="result"
            sideTabView
            hideUser
            noMeta
            showUsername
          />
        </div>
      </div>

      <div class="each_result product-results">
        <div class="_label">
          <div class="label-title">Products</div>
          <div class="label-count">{{ productResults.length }} results</div>
        </div>
        <div
          v-for="(result, index) in productResults"
          :key="index"
          class="search-result product-result"
        >
          <product-card :dataObject="result" sideTabView noMeta altMeta />
        </div>
      </div>
    </div>

    <div v-if="!searchDone" class="body-section">
      <input
        v-model="searchQuery"
        type="search"
        id="searchModalInput"
        placeholder="Start typing.."
        @keyup.enter="initSearch()"
        :disabled="isSearchLoading"
      />
      <v-btn
        :ripple="false"
        depressed
        disabled
        :loading="isSearchLoading"
        class="search-loader transparent"
      ></v-btn>
    </div>
  </div>
</template>

<script>
import SearchService from "@/services/search";
import UserTag from "@/components/user_tag";
import UserFollowBtn from "@/components/userFollowbtn.vue";
import trackcardsimple from "@/components/trackcardsimple";
import VideoBox from "@/components/video_box";
import productCard from "@/components/productcard";

export default {
  components: {
    UserTag,
    UserFollowBtn,
    trackcardsimple,
    VideoBox,
    productCard,
  },
  data() {
    return {
      searchQuery: "",
      searchDone: false,
      searchSuccessful: false,
      searchFailed: false,
      isSearchLoading: false,
      results: {
        users: [],
        albums: [],
        streams: [],
        products: [],
      },
    };
  },
  methods: {
    initSearch() {
      if (!this.searchQuery) return;

      this.isSearchLoading = true;

      SearchService.searchGlobal({ q: this.searchQuery })
        .then((response) => {
          this.searchSuccessful = true;
          this.results = response.body;
        })
        .catch((e) => {
          this.searchFailed = true;
          this.$store.dispatch('error/showErrorToast', [
            "There was a problem completing search",
            ])
        })
        .finally(() => {
          this.searchDone = true;
          this.isSearchLoading = false;
        });
    },
    resetSearch() {
      this.searchDone = false;
      this.searchSuccessful = false;
      this.searchFailed = false;
      this.searchQuery = "";
      this.results = [];
    },
    closeSearchModal() {
      this.$emit("closeSearchModal");
      this.resetSearch();
    },
  },
  computed: {
    usersResults() {
      return this.results.users;
    },
    albumResults() {
      return this.results.albums;
    },
    videoResults() {
      return this.results.streams;
    },
    productResults() {
      return this.results.products;
    },
  },
  created() {
    this.$store.dispatch("error/showLoadingActivity", true);
  },
};
</script>

<style lang="scss" scoped>
.mobile-search {
  background-color: #1d1d1d;
  color: #ffffff;
  padding: 30px;
  height: 100%;
  width: 100%;
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  transition: 0.1s cubic-bezier(0.25, 0.8, 0.5, 1);
  transition-property: all;
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.5, 1);
  transition-delay: 0s;

  &.searchDone {
    background-color: #ffffff;
    color: #000000;

    .top-section {
      position: relative;
      z-index: 3;
      .icon {
        color: #000000;
      }
    }

    .subsection {
      margin-top: 14px;
      background-color: #ffffff;
      position: sticky;
      top: 0;
      z-index: 2;

      &::before {
        content: "";
        background: #ffffff;
        width: 100%;
        height: 100%;
        position: absolute;
        top: -33px;
        z-index: -1;
      }
      &::after {
        content: "";
        background-color: #0000001a;
        width: 133%;
        height: 1px;
        position: absolute;
        bottom: 0;
        left: -38px;
      }
      .keyword {
        font-size: 22px;
        font-weight: 700;
        text-transform: capitalize;
        margin-bottom: 14px;
      }
      .divider {
        position: absolute;
        left: 0;
        background-color: #0000001a;
      }
    }
  }
  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: center;

    ._title {
      margin: 0;
    }

    .icon {
      color: #ffffff;
      font-size: 40px;
    }
  }
  .body-section {
    position: absolute;
    top: 50%;
    width: 85%;
    margin: 0 auto;
    border-bottom: 1px solid #ffffff;
    display: flex;

    .search-loader {
        background-color: transparent;
      /deep/ .progress-circular {
        color: #ffffff;
      }
    }

    input#searchModalInput {
      width: 100%;
      font-weight: 700;
      font-size: 20px;
      color: #ffffff;
      background-color: transparent !important;

      &::placeholder {
        font-weight: 700;
        font-size: 20px;
        color: #ffffff;
      }
      &:focus {
        outline: none;
      }
    }
  }

  .results {
    margin-top: 30px;
    ._label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      .label-title,
      .label-count {
        font-size: 21px;
        font-weight: 700;
      }
    }

    .each_result {
      border-bottom: 1px solid #0000001a;
      margin-bottom: 23px;
      padding-bottom: 0;
      &:last-child {
        border-bottom: none;
      }
    }
    .search-result {
      margin-bottom: 15px;
      &.user-result {
        display: flex;
        justify-content: space-between;

        /deep/ .user_tag {
          .tag__usertype {
            color: #00000080;
          }
          .user-status {
            margin-top: -15px;
          }
        }
      }
      &.album-result {
        /deep/ .track-card-simple {
          ._title {
            font-weight: 400;
            font-size: 16px;
          }
          ._subtitle {
            color: #414141;
            font-weight: 700;
            font-size: 16px;
          }
        }
      }

      &.video-result {
        /deep/ .box__subtitle {
          margin-left: -11px;
          font-size: 16px;
          width: 100%;
          .user_name {
            color: #414141;
          }
        }
      }

      &.product-result {
        /deep/ .product-card {
          .product-info {
            font-size: 16px;

            .alt-meta-user {
              color: #414141;
            }
          }
        }
      }
    }
  }
}
</style>
