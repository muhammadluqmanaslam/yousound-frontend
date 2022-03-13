<template>
  <div class="discover-page discover-video">
    <div class="discover-layer">
      <div class="dflex justify-space-between align-center mb-1">
        <h2 class="discover-title">Trending</h2>
        <div class="discover-action">View All</div>
      </div>

      <item-tab>
        <template slot="itemTabs">
          <span
            v-for="(video, index) in recommendedFeed"
            :key="index"
            class="tab-holder"
            style="width: 300px"
          >
            <video-box :hoverOverlay="false" coverOnly altMeta :item="video" />
          </span>
        </template>
      </item-tab>
    </div>

    <div class="discover-layer">
      <div class="dflex justify-space-between align-center mb-1">
        <h2 class="discover-title">New</h2>
        <div class="discover-action">View All</div>
      </div>

      <item-tab>
        <template slot="itemTabs">
          <span
            v-for="(video, index) in newFeed"
            :key="index"
            class="tab-holder"
          >
            <video-box :hoverOverlay="false" coverOnly altMeta :item="video" />
          </span>
        </template>
      </item-tab>
    </div>

    <div class="discover-layer">
      <div class="dflex justify-space-between align-center mb-1">
        <h2 class="discover-title">Popular</h2>
        <div class="discover-action">View All</div>
      </div>

      <item-tab>
        <template slot="itemTabs">
          <span
            v-for="(video, index) in popularFeed"
            :key="index"
            class="tab-holder"
          >
            <video-box :hoverOverlay="false" coverOnly altMeta :item="video" />
          </span>
        </template>
      </item-tab>
    </div>
  </div>
</template>

<script>
import StreamService from '@/services/stream'
import itemTab from '@/components/itemTab'
import VideoBox from '@/components/video_box'

export default {
    props: {
      listLimit: Number,
    },
    components: {
      itemTab,
      VideoBox
    },
    data() {
        return {
          selected_genre: null,
          videos: [],
          videoGenres: [],
          items_per_page: 1 * 50,
          pagination: {
            current_page: 1,
            total_pages: 0,
          },
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
      loadFeeds(tab, page) {
        const params = {
          genre_id: tab,
          only_follows: this.only_follows,
          page: page,
          per_page: this.items_per_page,
        }
        return StreamService.getStreams(params)
          .then((response) => {
            this.videos = this.videos.concat(response.body.streams)

            console.log(this.videos)
            this.pagination = response.body.pagination
            this.videoGenres = response.body.genres

            return this.videos
          })
          .catch(() => {
            this.$store.dispatch('error/showLoadingActivity', false)
          })
      },
      async filtered_feeds(filterBy) {
        const filter = await this.loadFeeds(filterBy, 1).then((res) => res)
        // const filter = this.videos

        console.log(filter);

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
    },
    computed: {
      available_genres() {
        let genres = [{ id: 0, name: 'All' }]
        this.videoGenres.forEach((vg) => {
          const g = this._.find(this.$store.state.app.genres, { name: vg })
          genres.push({ id: g.id, name: g.name })
        })
        // const genres = this._.filter(this.$store.state.app.genres, (g) => (VideoGenres.indexOf(g.name) > -1))
        // console.log('available_genres', genres)
        return genres
      },
    },
    created() {
      this.seed = Math.random()
      this.getFeeds()
    }
}
</script>

<style src="../../../../static/styles/mobile/discover_comp.scss" lang="scss" scoped></style>
