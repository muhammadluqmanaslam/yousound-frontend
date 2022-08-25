<template>
  <div class="trending-comp trending-products">
    <div v-if="title" class="top-bar">
      <h2 class="bar-title">{{ title }}</h2>
      <!-- <div class="bar-action">View All</div> -->
    </div>

    <item-tab mode="grid" class="mb-4">
      <template slot="itemTabs">
        <span
          v-for="(feed, index) in productFeed"
          :key="index"
          :class="['tab-holder px-0 flex', classAttr]"
        >
          <product-card
            hideOverlay
            noMeta
            :altMeta="altMeta"
            altMetaPrice
            :dataObject="feed"
            :showFullOverlay="showFullOverlay"
          />
        </span>
      </template>
    </item-tab>

    <!-- <item-tab>
      <template slot="itemTabs">
        <span
          v-for="(feed, index) in productFeed2"
          :key="index"
          class="tab-holder"
        >
          <product-card
            hideOverlay
            noMeta
            altMeta
            altMetaPrice
            :dataObject="feed"
          />
        </span>
      </template>
    </item-tab> -->

    <div v-if="!hideCta" class="cta">
      <v-btn block outline class="cta-btn">
        <strong>
          View all products
        </strong>
      </v-btn>
    </div>
  </div>
</template>

<script>
import itemTab from "@/components/itemTab";
import productCard from "@/components/productcard";
import { mapActions, mapState } from "vuex";

export default {
  props: {
    title: {
      type: String,
      default: "Exclusive Drops",
    },
    listLimit: Number,
    classAttr: {
      type: String,
      default: "xs6 md6",
    },
    hideCta: Boolean,
    altMeta: Boolean,
    showFullOverlay: Boolean,
  },
  components: {
    itemTab,
    productCard,
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
      productFeed: (state) => state.trending.products,
    }),
    items_per_page() {
      return 1 * this.listLimit || 50;
    },
    productFeed1() {
      const split = this.productFeed.slice(0, this.productFeed.length / 2);
      return split;
    },
    productFeed2() {
      const split = this.productFeed.slice(
        this.productFeed.length / 2,
        this.productFeed.length
      );
      return split;
    },
  },
  methods: {
    ...mapActions({
      getTrendingProducts: "trending/getTrendingProducts",
    }),
    loadTrendingProducts() {
      if (this.productFeed.length) return;

      const params = {
        genre: "any",
        category: "any",
        page: 1,
        per_page: this.items_per_page,
        seed: this.seed,
      };

      this.getTrendingProducts(params);
    },
    loadFeeds(page) {
      const vm = this;
      if (page === 1) {
        this.isPageReady = false;
      }
      this.$store.dispatch("error/showLoadingActivity", true);
      const genre = _.get(this.selected_genre, "id", "any");
      const category = _.get(this.selected_category, "id", "any");
      const params = {
        genre: genre,
        category: category,
        page: page,
        per_page: this.items_per_page,
        seed: this.seed,
      };

      SearchService.searchDiscover(params)
        .then((response) => {
          this.$store.dispatch("error/showLoadingActivity", false);
          this.products = this.products.concat(response.body.products);

          // this will return a a prop limit if available
          this.products = this.products.slice(
            0,
            this.listLimit || this.products.length
          );

          // remove products duplicate
          this.products = _.uniqBy(this.products, "id");

          // const categories = _.chain(this.products).map('category').keyBy('id').map((v, k) => {return v}).sortBy('name').value()
          const categories = response.body.categories.map((c) => ({
            id: c,
            name: c,
          }));
          this.categories = [{ id: "any", name: "All" }].concat(categories);

          this.page_index = response.body.pagination.current_page;
          this.total_pages = response.body.pagination.total_pages;

          if (page === 1) {
            Promise.all([
              SearchService.searchDiscover(_.extend(params, { page: 2 })),
              SearchService.searchDiscover(_.extend(params, { page: 3 })),
              SearchService.searchDiscover(_.extend(params, { page: 4 })),
            ]).then((values) => {
              vm.products = vm.products.concat(
                values[0].body.products,
                values[1].body.products,
                values[2].body.products
              );

              // this will return a a prop limit if available
              vm.products = this.products.slice(
                0,
                this.listLimit || this.products.length
              );

              // remove products duplicate
              this.products = _.uniqBy(this.products, "id");

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
    this.seed = Math.random();

    this.loadTrendingProducts();
  },
};
</script>

<style lang="scss" scoped>
.trending-products {
    margin-top: 40px;

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>