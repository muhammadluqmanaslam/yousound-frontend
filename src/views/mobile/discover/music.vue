<template>
  <div class="discover-page discover-music">
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

          <v-spacer></v-spacer>

          <li class="my-0">
            <div
              class="genre-dialog-selector py-3"
              @click="openGenreSelectorDialog()"
            >
              <div class="genre-filter">
                <img :src="require('@/assets/genre_filter.svg')" />
              </div>
            </div>
          </li>
        </ul>    
      </template>
    </content-top-header>

    <item-tab v-show="activeTab === 'recommended'" mode="grid">
      <template slot="itemTabs">
        <span
          v-for="(feed, index) in recommendedFeed"
          :key="index"
          class="tab-holder px-0 flex xs6 md6"
        >
          <track-card
            :objects="recommendedFeed"
            :objectIndex="index"
            hideMoreMenu
            class="pa-0" 
          />
        </span>
      </template>
    </item-tab>

    <item-tab v-show="activeTab === 'new'"  mode="grid">
      <template slot="itemTabs">
        <span
          v-for="(feed, index) in newFeed"
          :key="index"
          class="tab-holder px-0 flex xs6 md6"
        >
          <track-card
            :objects="newFeed"
            :objectIndex="index"
            hideMoreMenu
          />
        </span>
      </template>
    </item-tab>

    <item-tab v-show="activeTab === 'popular'" mode="grid">
      <template slot="itemTabs">
        <span
          v-for="(feed, index) in popularFeed"
          :key="index"
          class="tab-holder px-0 flex xs6 md6"
        >
          <track-card
            :objects="popularFeed"
            :objectIndex="index"
            hideMoreMenu
          />
        </span>
      </template>
    </item-tab>

    <v-dialog
      v-model="show_genre_selector_dialog"
      fullscreen
      :content-class="[`my-genre-dialog ma-0 pa-2 ${onMobile ? 'onMobile' : ''}`]"
    >
      <genre-dialog :dismiss="closeGenreSelectorDialog" />
    </v-dialog>
  </div>
</template>

<script>
import SearchService from '@/services/search'
import itemTab from '@/components/itemTab'
import trackCard from '@/components/trackcard'
import contentTopHeader from '@/components/contentTopHeader'
import genreDialog from '@/components/genre_dialog'
import { mapActions, mapState } from 'vuex'

export default {
    props: {
      listLimit: Number,
    },
    components: {
      itemTab,
      trackCard,
      contentTopHeader,
      genreDialog,
    },
    data() {
      return {
        activeTab: "recommended",
        tabs: [
          { id: 'recommended', title: 'Trending' },
          { id: 'new', title: 'New' },
          { id: 'popular', title: 'Popular' },
        ],
        show_genre_selector_dialog: false,
        selected_genre: {},
        selected_category: {},
        feeds: [],
        total_pages: 1,
        seed: '',
        genres: [],
        page_index: 1,
        items_per_page: 1 * 50,
        categories: [],
      }
    },
    computed: {
      ...mapState({
        recommendedFeed: state => state.discover.mobileMusicFeed.recommended,
        newFeed: state => state.discover.mobileMusicFeed.new,
        popularFeed: state => state.discover.mobileMusicFeed.popular,
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
      selectedGenreName() {
        return _.get(this.selected_genre, 'name', 'All')
      },
    },
    methods: {
      ...mapActions({
        getMobileMusicFeed: 'discover/getMobileMusicFeed'
      }),
      setTab(tab) {
        if (!tab) {
          tab = 'recommended'
        }

        const paramFilter = this.$route.params.filter || ''

        if (paramFilter) {
          this.activeTab = paramFilter
        }

        this.page_index = 1
        this.total_pages = 1
        this.feeds = []
        this.selected_genre = null
        this.selected_category = null

        this.$nextTick(() => {
          this.loadFeeds(this.activeTab, 1)
        })
      },
      onTab(tab) {
        this.activeTab = tab;

        this.setTab(tab)
      },
      isActiveTab(tab) {
        return this.activeTab === tab
      },
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
      openGenreSelectorDialog() {
        this.show_genre_selector_dialog = true
      },
      closeGenreSelectorDialog() {
        this.show_genre_selector_dialog = false
      },
    },
    created() {
      this.seed = Math.random()
      this.getFeeds()

      const tab = this.$route.hash.substr(1)
    }
}
</script>

<style src="../../../../static/styles/mobile/discover_comp.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
.genre-dialog-selector {
  position: relative;
  display: flex;

  .genre-filter img {
    width: 20px;
    margin-top: 8px;
  }
}
/deep/ .item-tab-wrapper {
  &.isGrid {
    .item-tabs {
      // margin-left: -15px;
      // margin-right: -20px;
    }
  }
}
</style>