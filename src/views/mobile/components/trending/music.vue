<template>
  <div class="trending-comp trending-music">
    <div class="top-bar">
      <h2 class="bar-title">Hot Albums</h2>
      <div class="bar-action">View All</div>
    </div>

    <item-tab>
      <template slot="itemTabs">
        <span
          v-for="(feed, index) in musicFeed1"
          :key="index"
          class="tab-holder"
        >
          <track-card :objects="musicFeed1" :objectIndex="index" hideMoreMenu />
        </span>
      </template>
    </item-tab>

    <item-tab>
      <template slot="itemTabs">
        <span
          v-for="(feed, index) in musicFeed2"
          :key="index"
          class="tab-holder"
        >
          <track-card :objects="musicFeed2" :objectIndex="index" hideMoreMenu />
        </span>
      </template>
    </item-tab>
  </div>
</template>

<script>
import itemTab from "@/components/itemTab";
import trackCard from "@/components/trackcard";
import SearchService from "@/services/search";
import { mapActions, mapState } from "vuex";

export default {
  props: {
    listLimit: Number,
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
      musicFeed: (state) => state.trending.albums
    }),
    items_per_page() {
        return 1 * this.listLimit || 50
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
        if (this.musicFeed.length) return

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
      SearchService.searchDiscover(params)
        .then((response) => {
          this.$store.dispatch("error/showLoadingActivity", false);
          this.musicFeed = this.musicFeed.concat(response.body.albums);
          const genres = _.chain(this.musicFeed)
            .map("genres")
            .flatMap()
            .keyBy("id")
            .map((v, k) => {
              return v;
            })
            .sortBy("name")
            .value();
          this.genres = [
            // { id: 'go_to_filters', name: 'Set Genre Filters' },
            { id: "any", name: "All" },
          ].concat(genres);

          this.page_index = response.body.pagination.current_page;
          this.total_pages = response.body.pagination.total_pages;

          if (page === 1) {
            Promise.all([
              SearchService.searchDiscover(_.extend(params, { page: 2 })),
              SearchService.searchDiscover(_.extend(params, { page: 3 })),
              SearchService.searchDiscover(_.extend(params, { page: 4 })),
            ]).then((values) => {
              vm.musicFeed = vm.musicFeed.concat(
                values[0].body.albums,
                values[1].body.albums,
                values[2].body.albums
              );
              const genres = _.chain(vm.musicFeed)
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
    // this.loadFeeds("new", 1);

    this.loadTrendingMusic()
  },
};
</script>

<style lang="scss" scoped>
.trending-music {
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
}
</style>