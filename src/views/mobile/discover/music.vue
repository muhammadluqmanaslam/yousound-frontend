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
              :hideButtonAction="hideAlbum"
            />
          </span>
        </template>
      </item-tab>
    </div>

    <div class="discover-layer">
      <div class="dflex justify-space-between align-center mb-1">
        <h2 class="discover-title">New</h2>
        <div class="discover-action"@click="$router.push({name: 'AlbumIndex', hash: '#new'})">View All</div>
      </div>

      <item-tab>
        <template slot="itemTabs">
          <span
            v-for="(feed, index) in newFeed"
            :key="index"
            class="tab-holder"
          >
            <track-card
              :objects="newFeed"
              :objectIndex="index"
              :hideButtonAction="hideAlbum"
            />
          </span>
        </template>
      </item-tab>
    </div>

    <div class="discover-layer">
      <div class="dflex justify-space-between align-center mb-1">
        <h2 class="discover-title">Popular</h2>
        <div class="discover-action"@click="$router.push({name: 'AlbumIndex', hash: '#popular'})">View All</div>
      </div>

      <item-tab>
        <template slot="itemTabs">
          <span
            v-for="(feed, index) in popularFeed"
            :key="index"
            class="tab-holder"
          >
            <track-card
              :objects="popularFeed"
              :objectIndex="index"
              :hideButtonAction="hideAlbum"
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
          selected_genre: null,
          feeds: [],
          total_pages: 1,
          seed: '',
          items_per_page: 1 * 50,
          recommendedFeed: [],
          newFeed: [],
          popularFeed: [],
        }
    },
    methods: {
      getFeeds() {
        this.filtered_feeds('recommended')
        this.filtered_feeds('new')
        this.filtered_feeds('popular')
      },
      async filtered_feeds(filterBy) {
        const filter = await this.loadFeeds(filterBy, 1).then((res) => res)

        // this filtered_feeds() will return a prop limit if available
        let result = filter.slice(0, this.listLimit || filter.length)

        switch (filterBy) {
          case 'recommended':
            this.recommendedFeed = result
            break;
          case 'new':
            this.newFeed = result
            break;
          case 'popular':
            this.popularFeed = result
            break;
          default:
            break;
        }
        return result
      },
      loadFeeds(tab, page) {
        const genre = _.get(this.selected_genre, 'id', 'any')
        const category = _.get(this.selected_category, 'id', 'any')
        const params = {
          filter: tab,
          genre: genre,
          category: category,
          page: page,
          per_page: this.items_per_page,
        }
        if (tab !== 'recommended') {
          params['seed'] = this.seed
        }
       return SearchService.searchDiscover(params)
          .then((response) => {
            return response.body.albums
          })
          .catch((e) => {
            this.$store.dispatch('error/showLoadingActivity', false)
            // this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
            console.log('discover error', e)
          })
      },
      hideAlbum(album) {
        _.remove(this.feeds, (item) => {
          return item.id === album.id
        })
        const arr = this.feeds.slice()
        this.feeds = arr
      },
    },
    created() {
      this.seed = Math.random()
      this.getFeeds()
    }
}
</script>

<style src="../../../../static/styles/mobile/discover_comp.scss" lang="scss" scoped></style>
