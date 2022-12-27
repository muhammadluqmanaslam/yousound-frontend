<template>
  <div class="discover-page discover-video">
    <content-top-header
      absolute :height="onMobile ? 35 : ''"
      class="__inner px-0"
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
            v-for="(video, index) in recommendedFeed"
            :key="index"
            class="tab-holder px-0 flex xs12 md12"
          >
            <video-box :hoverOverlay="false" coverOnly altMeta :item="video" />
          </span>
        </template>
      </item-tab>

      <item-tab minHeight="215" v-show="activeTab === 'new'" mode="grid">
        <template slot="itemTabs">
          <span
            v-for="(video, index) in newFeedSplit1"
            :key="index"
            class="tab-holder"
          >
            <video-box :hoverOverlay="false" coverOnly altMeta :item="video" />
          </span>
        </template>
      </item-tab>

      <item-tab minHeight="215" v-show="activeTab === 'popular'" mode="grid">
        <template slot="itemTabs">
          <span
            v-for="(video, index) in popularFeedSplit1"
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
import contentTopHeader from '@/components/contentTopHeader'
import { mapActions, mapState } from 'vuex'

export default {
    props: {
      listLimit: Number,
    },
    components: {
      itemTab,
      VideoBox,
      contentTopHeader
    },
    data() {
        return {
          activeTab: "recommended",
          tabs: [
            { id: 'recommended', title: 'Trending' },
            { id: 'new', title: 'New' },
            { id: 'popular', title: 'Popular' },
          ],
          only_follows: false,
          selected_genre: null,
          videos: [],
          videoGenres: [],
          items_per_page: 1 * 50,
          pagination: {
            current_page: 1,
            total_pages: 0,
          },
        }
    },
    methods: {
      ...mapActions({
        getMobileVideoFeed: 'discover/getMobileVideoFeed'
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

        // this.$nextTick(() => {
        //   this.loadFeeds(this.activeTab, 1)
        // })
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

        // this.filtered_feeds('recommended')
        // this.filtered_feeds('new')
        // this.filtered_feeds('popular')
      },
      getRecommendedFeed() {
        if (this.recommendedFeed.length) return

        const params = this.getParams('recommended')
        this.getMobileVideoFeed(params)
      },
      getNewFeed() {
        if (this.recommendedFeed.length) return

        const params = this.getParams('new')
        this.getMobileVideoFeed({...params, per_page: 20})
      },
      getPopularFeed() {
        if (this.popularFeed.length) return

        const params = this.getParams('popular')
        this.getMobileVideoFeed(params)
      },
      getParams(filter, page=1) {
        const params = {
          filter,
          genre_id: 0,
          only_follows: this.only_follows,
          page: page,
          per_page: this.items_per_page,
        }

        return params
      },
      // loadFeeds(tab, page) {
      //   const params = {
      //     genre_id: tab,
      //     only_follows: this.only_follows,
      //     page: page,
      //     per_page: this.items_per_page,
      //   }
      //   return StreamService.getStreams(params)
      //     .then((response) => {
      //       this.videos = this.videos.concat(response.body.streams)

      //       // console.log(this.videos)
      //       this.pagination = response.body.pagination
      //       this.videoGenres = response.body.genres

      //       return this.videos
      //     })
      //     .catch(() => {
      //       this.$store.dispatch('error/showLoadingActivity', false)
      //     })
      // },
      async filtered_feeds(filterBy) {
        const filter = await this.loadFeeds(filterBy, 1).then((res) => res)
        // const filter = this.videos

        // console.log(filter);

        // this filtered_feeds() will return a prop limit if available
        let result = filter.slice(0, this.listLimit || filter.length)
        console.log(result)

        switch (filterBy) {
          case 'recommended':
            // this.recommendedFeed = result
            break;
          case 'new':
            // this.newFeed = result
            break;
          case 'popular':
            // this.popularFeed = result
            break;
          default:
            break;
        }
        return result
      },
    },
    computed: {
      ...mapState({
        recommendedFeed: state => state.discover.mobileVideoFeed.recommended,
        newFeed: state => state.discover.mobileVideoFeed.new,
        popularFeed: state => state.discover.mobileVideoFeed.popular,
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
      this.getFeeds()
    }
}
</script>
<style src="../../../../static/styles/mobile/discover_comp.scss" lang="scss" scoped></style>
