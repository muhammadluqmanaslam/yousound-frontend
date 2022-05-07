<template>
  <div class="discover-page discover-music">
    <div class="discover-layer">
      <div class="dflex justify-space-between align-center mb-1">
        <h2 class="discover-title">Trending</h2>
        <div class="discover-action" @click="$router.push({name: 'AlbumIndex', hash: '#recommended'})">View All</div>
      </div>

      <item-tab>
        <template slot="itemTabs">
          <span
            v-for="(feed, index) in recommendedFeed"
            :key="index"
            class="tab-holder"
          >
            <track-card
              :objects="recommendedFeed"
              :objectIndex="index"
              hideMoreMenu
            />
          </span>
        </template>
      </item-tab>
    </div>

    <div class="discover-layer">
      <div class="dflex justify-space-between align-center mb-1">
        <h2 class="discover-title">New</h2>
        <div class="discover-action" @click="$router.push({name: 'AlbumIndex', hash: '#new'})">View All</div>
      </div>

      <item-tab>
        <template slot="itemTabs">
          <span
            v-for="(feed, index) in newFeedSplit1"
            :key="index"
            class="tab-holder"
          >
            <track-card
              :objects="newFeedSplit1"
              :objectIndex="index"
              hideMoreMenu
            />
          </span>
        </template>
      </item-tab>

      <item-tab>
        <template slot="itemTabs">
          <span
            v-for="(feed, index) in newFeedSplit2"
            :key="index"
            class="tab-holder"
          >
            <track-card
              :objects="newFeedSplit2"
              :objectIndex="index"
              hideMoreMenu
            />
          </span>
        </template>
      </item-tab>
    </div>

    <div class="discover-layer">
      <div class="dflex justify-space-between align-center mb-1">
        <h2 class="discover-title">Popular</h2>
        <div class="discover-action" @click="$router.push({name: 'AlbumIndex', hash: '#popular'})">View All</div>
      </div>

      <item-tab>
        <template slot="itemTabs">
          <span
            v-for="(feed, index) in popularFeedSplit1"
            :key="index"
            class="tab-holder"
          >
            <track-card
              :objects="popularFeedSplit1"
              :objectIndex="index"
              hideMoreMenu
            />
          </span>
        </template>
      </item-tab>

      <item-tab>
        <template slot="itemTabs">
          <span
            v-for="(feed, index) in popularFeedSplit2"
            :key="index"
            class="tab-holder"
          >
            <track-card
              :objects="popularFeedSplit2"
              :objectIndex="index"
              hideMoreMenu
            />
          </span>
        </template>
      </item-tab>
    </div>
  </div>
</template>

<script>
import SearchService from '@/services/search'
import itemTab from '@/components/itemTab'
import trackCard from '@/components/trackcard'
import { mapActions, mapState } from 'vuex'

export default {
    props: {
      listLimit: Number,
    },
    components: {
      itemTab,
      trackCard
    },
    data() {
        return {
          selected_genre: {},
          selected_category: {},
          feeds: [],
          total_pages: 1,
          seed: '',
          items_per_page: 1 * 10,
        }
    },
    computed: {
      ...mapState({
        recommendedFeed: state => state.discover.mobileMusicFeed.recommended,
        newFeed: state => state.discover.mobileMusicFeed.new,
        popularFeed: state => state.discover.mobileMusicFeed.popular,
      }),
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
    methods: {
      ...mapActions({
        getMobileMusicFeed: 'discover/getMobileMusicFeed'
      }),
      getFeeds() {
        this.getRecommendedFeed()
        this.getNewFeed()
        this.getPopularFeed()
      },
      getParams(filter) {
        const genre = this.selected_genre.id || 'any'
        const category = this.selected_category.id || 'any'
        const params = {
          filter,
          genre: genre,
          category: category,
          page: 1,
          per_page: this.listLimit || this.items_per_page,
        }
        if (filter !== 'recommended') {
          params['seed'] = this.seed
        }

        return params
      },
      getRecommendedFeed() {
        if (this.recommendedFeed.length) return

        const params = this.getParams('recommended')
        this.getMobileMusicFeed(params)
      },
      getNewFeed() {
        if (this.newFeed.length) return

        const params = this.getParams('new')
        this.getMobileMusicFeed({...params, per_page: 20})
      },
      getPopularFeed() {
        if (this.popularFeed.length) return

        const params = this.getParams('popular')
        this.getMobileMusicFeed(params)
      },
    },
    created() {
      this.seed = Math.random()
      this.getFeeds()
    }
}
</script>

<style src="../../../../static/styles/mobile/discover_comp.scss" lang="scss" scoped></style>
