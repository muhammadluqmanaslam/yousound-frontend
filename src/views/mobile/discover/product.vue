<template>
  <div class="discover-page discover-video">
    <content-top-header
      absolute :height="onMobile ? 35 : ''"
      class="__inner px-0 mb-3"
      :class="[{ onMobile}]"
    >
      <template slot="topHeader">
        <ul>
          <template>
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              :class="{ active: isActiveTab(tab.id) }"
            >
              <label @click="onTab(tab.id)">{{ tab.title }}</label>
            </li>
          </template>
        </ul>    
      </template>
    </content-top-header>

    <div class="discover-layer">
      <item-tab v-show="activeTab === 'recommended'" mode="grid">
        <template slot="itemTabs">
          <span
            v-for="(product, index) in allProducts"
            :key="index"
            class="tab-holder px-0 flex xs6 md6"
          >
            <product-card hideOverlay noMeta altMeta altMetaPrice :dataObject="product" />
          </span>
        </template>
      </item-tab>

      <item-tab minHeight="218" v-show="activeTab === 'new'" mode="grid">
        <template slot="itemTabs">
          <span
            v-for="(product, index) in newFeed"
            :key="index"
            class="tab-holder px-0 flex xs6 md6"
          >
            <product-card hideOverlay noMeta altMeta :dataObject="product" />
          </span>
        </template>
      </item-tab>

      <item-tab minHeight="218" v-show="activeTab === 'popular'" mode="grid">
        <template slot="itemTabs">
          <span
            v-for="(product, index) in popularFeed"
            :key="index"
            class="tab-holder px-0 flex xs6 md6"
          >
            <product-card hideOverlay noMeta altMeta :dataObject="product" />
          </span>
        </template>
      </item-tab>
    </div>
  </div>
</template>

<script>
import SearchService from '@/services/search'
import itemTab from '@/components/itemTab'
import productCard from '@/components/productcard'
import contentTopHeader from '@/components/contentTopHeader'
import { mapActions, mapState } from 'vuex'

export default {
    props: {
      listLimit: Number,
    },
    components: {
      itemTab,
      productCard,
      contentTopHeader
    },
    data() {
        return {
          activeTab: "recommended",
          tabs: [
            { id: 'recommended', title: 'Trending' },
            { id: 'new', title: 'New' },
          ],
          seed: '',
          page_index: 1,
          total_pages: 1,
          items_per_page: 1 * 50,
          categories: [],
          selected_category: null,
          products: [],
        }
    },
    methods: {
      ...mapActions({
        getMobileProductFeed: 'discover/getMobileProductFeed'
      }),
      onTab(tab) {
        this.activeTab = tab;
      },
      isActiveTab(tab) {
        return this.activeTab === tab
      },
      getFeeds() {
        // temp
        if (this.allProducts.length) return
        // temp

        this.getRecommendedFeed()
        this.getNewFeed()
        this.getPopularFeed()

        // this.filtered_feeds('any')
        // this.filtered_feeds('any')
        // this.filtered_feeds('any')
      },
      getRecommendedFeed() {
        if (this.recommendedFeed.length) return

        const params = this.getParams('recommended')
        this.getMobileProductFeed(params)
      },
      getNewFeed() {
        if (this.recommendedFeed.length) return

        const params = this.getParams('new')
        this.getMobileProductFeed({...params, per_page: 20})
      },
      getPopularFeed() {
        if (this.popularFeed.length) return

        const params = this.getParams('popular')
        this.getMobileProductFeed(params)
      },
      getParams(category, page=1) {
        const genre = _.get(this.selected_genre, 'id', 'any')
        const params = {
            genre: genre,
            category: "any", // temp
            // category: category
            page: page,
            per_page: this.items_per_page,
            seed: this.seed,
        }

        return params
      },
      loadFeeds(category, page) {
        const vm = this
        if (page === 1) {
            this.isPageReady = false
        }
        const genre = _.get(this.selected_genre, 'id', 'any')
        const params = {
            genre: genre,
            category: category,
            page: page,
            per_page: this.items_per_page,
            seed: this.seed,
        }

        return SearchService.searchDiscover(params)
        .then((response) => {
            console.log('response: ', response)
            this.products = this.products.concat(response.body.products)

            // this will return a a prop limit if available
            this.products = this.products.slice(0, this.listLimit || this.products.length)
            
            // remove products duplicate
            this.products = _.uniqBy(this.products, 'id')
            // console.log('this.products: ', this.products)

            // const categories = _.chain(this.products).map('category').keyBy('id').map((v, k) => {return v}).sortBy('name').value()
            const categories = response.body.categories.map((c) => ({
                id: c,
                name: c,
            }))
            this.categories = [{ id: 'any', name: 'All' }].concat(categories)

            this.page_index = response.body.pagination.current_page
            this.total_pages = response.body.pagination.total_pages

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
                )

                // this will return a a prop limit if available
                vm.products = this.products.slice(0, this.listLimit || this.products.length)

                // remove products duplicate
                this.products = _.uniqBy(this.products, 'id')

                vm.page_index =
                    values[2].body.pagination.total_pages > 4
                    ? 4
                    : values[2].body.pagination.total_pages

                vm.isPageReady = true
                })
            }

            return this.products
        })
        .catch((e) => {
        console.log('discover error', e)
        })
      },
      async filtered_feeds(filterBy) {
        const filter = await this.loadFeeds(filterBy, 1).then((res) => res)

        // this filtered_feeds() will return a prop limit if available
        let result = filter.slice(0, this.listLimit || filter.length)

        // temporary
        this.recommendedFeed = this.newFeed = this.popularFeed = result

        // update switch later
        // switch (filterBy) {
        //   case 'any':
        //     this.recommendedFeed = result
        //     break;
        //   case 'any':
        //     this.newFeed = result
        //     break;
        //   case 'any':
        //     this.popularFeed = result
        //     break;
        //   default:
        //     break;
        // }
      },
    },
    computed: {
      ...mapState({
        allProducts: state => state.discover.mobileProductFeed.allProducts, // temp
        recommendedFeed: state => state.discover.mobileProductFeed.recommended,
        newFeed: state => state.discover.mobileProductFeed.new,
        popularFeed: state => state.discover.mobileProductFeed.popular,
      }),
      onMobile() {
        return this.$vuetify.breakpoint.smAndDown;
      },
      newFeedSplit1() {
        const split = this.newFeed.slice(0, this.newFeed.length/2)
        return split
      },
      newFeedSplit2() {
        const split = this.newFeed.slice(this.newFeed.length/2, this.newFeed.length)
        return split
      },
      popularFeedSplit1() {
        const split = this.popularFeed.slice(0, this.popularFeed.length/2)
        return split
      },
      popularFeedSplit2() {
        const split = this.popularFeed.slice(this.popularFeed.length/2, this.popularFeed.length)
        return split
      },
    },
    created() {
      this.seed = Math.random()
      this.getFeeds()
    }
}
</script>

<style src="../../../../static/styles/mobile/discover_comp.scss" lang="scss" scoped></style>
