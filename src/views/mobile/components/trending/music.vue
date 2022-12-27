<template>
  <div class="trending-comp trending-music">
    <div v-if="title" class="top-bar">
      <h2 class="bar-title">{{ title }}</h2>
      <!-- <div class="bar-action">View All</div> -->
    </div>

    <item-tab mode="grid">
      <template slot="itemTabs">
        <span
          v-for="(feed, index) in musicFeed"
          :key="index"
          :class="['tab-holder px-0 flex', classAttr]"
        >
          <track-card
            :objects="musicFeed"
            :objectIndex="index"
            hideMoreMenu
            class="pa-0"
            :hideTrackLength="hideTrackLength"
            :noAction="noAction"
            :noMeta="noMeta"
            :playButton2="playButton2"
            :playButton2IconHasWhiteBG="playButton2IconHasWhiteBG"
          />
        </span>
      </template>
    </item-tab>

    <!-- <item-tab>
      <template slot="itemTabs">
        <span
          v-for="(feed, index) in musicFeed2"
          :key="index"
          class="tab-holder"
        >
          <track-card :objects="musicFeed2" :objectIndex="index" hideMoreMenu />
        </span>
      </template>
    </item-tab> -->

    <div v-if="!hideCta" class="cta">
      <v-btn block outline class="cta-btn">
        <strong> View all music </strong>
      </v-btn>
    </div>
  </div>
</template>

<script>
import itemTab from "@/components/itemTab";
import trackCard from "@/components/trackcard";
import SearchService from "@/services/search";
import { vModelCheckbox } from "@vue/runtime-dom";
import { mapActions, mapState } from "vuex";

export default {
  props: {
    title: {
      type: String,
      default: "Curated Music",
    },
    listLimit: Number,
    classAttr: {
      type: String,
      default: "xs6 md6",
    },
    hideTrackLength: Boolean,
    noAction: Boolean,
    noMeta: Boolean,
    hideCta: Boolean,
    showHoverTrackInfo: Boolean,
    playButton2: Boolean,
    playButton2IconHasWhiteBG: Boolean,
  },
  components: {
    itemTab,
    trackCard,
  },
  data() {
    return {
      selected_genre: null,
      page_index: 1,
      total_pages: 1,
      genres: [],
    };
  },
  computed: {
    ...mapState({
      musicFeed: (state) => state.trending.albums,
    }),
    items_per_page() {
      return 1 * this.listLimit || 50;
    },
    musicFeed1() {
      // console.log('albums: ', this.musicFeed);
      const split = this.musicFeed.slice(0, this.musicFeed.length / 2);
      return split;
    },
    musicFeed2() {
      const split = this.musicFeed.slice(
        this.musicFeed.length / 2,
        this.musicFeed.length
      );
      return split;
    },
  },
  methods: {
    ...mapActions({
      getTrendingMusic: "trending/getTrendingMusic",
    }),
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
    loadFeeds(tab, page) {
      const vm = this;
      if (page === 1) {
        this.isPageReady = false;
      }
      this.$store.dispatch("error/showLoadingActivity", true);
      const genre = _.get(this.selected_genre, "id", "any");
      const category = _.get(this.selected_category, "id", "any");
      const params = {
        filter: tab,
        genre: genre,
        category: category,
        page: page,
        per_page: this.items_per_page,
      };
      if (tab !== "recommended") {
        params["seed"] = this.seed;
      }
      SearchService.searchDiscoverPublicUser(params)
        .then((response) => {
          vm.$store.dispatch("error/showLoadingActivity", false);
          let musicFeed = vm.musicFeed.concat(response.body.albums);
          const genres = _.chain(musicFeed)
            .map("genres")
            .flatMap()
            .keyBy("id")
            .map((v, k) => {
              return v;
            })
            .sortBy("name")
            .value();
          vModelCheckbox.genres = [
            // { id: 'go_to_filters', name: 'Set Genre Filters' },
            { id: "any", name: "All" },
          ].concat(genres);
          vm.page_index = response.body.pagination.current_page;
          vm.total_pages = response.body.pagination.total_pages;

          if (page === 0) {
            Promise.all([
              SearchService.searchDiscoverPublicUser(_.extend(params, { page: 2 })),
              SearchService.searchDiscoverPublicUser(_.extend(params, { page: 3 })),
              SearchService.searchDiscoverPublicUser(_.extend(params, { page: 4 })),
            ]).then((values) => {
              let musicFeed = vm.musicFeed.concat(
                values[0].body.albums,
                values[1].body.albums,
                values[2].body.albums
              );
              const genres = _.chain(musicFeed)
                .map("genres")
                .flatMap()
                .keyBy("id")
                .map((v, k) => {
                  return v;
                })
                .sortBy("name")
                .value();
              vm.genres = [{ id: "any", name: "All" }].concat(genres);
              vm.page_index =
                values[2].body.pagination.total_pages > 4
                  ? 4
                  : values[2].body.pagination.total_pages;
              vm.isPageReady = true;
            });
          }
        })
        .catch((e) => {
          this.$store.dispatch("error/showLoadingActivity", false);
          // this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          console.log("discover error", e);
        });
    },
  },
  created() {
    // needs to be updated to trending
    this.loadFeeds("trending", 0);

    this.loadTrendingMusic();
  },
};
</script>

<style lang="scss" scoped>
.trending-music {
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 0;
  }
}
</style>