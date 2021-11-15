<template>
  <div class="page video-page index-page">
    <content-top-header>
      <template slot="topHeader">
        <v-tabs :scrollable="true">
          <v-tabs-bar>
            <v-tabs-item
              v-model="selectedTab"
              v-for="(genre, idx) in available_genres"
              :key="idx"
              :href="'#tab-' + idx"
            >
              <v-chip class="text-capitalize" @click.native="setTab(genre.id)">
                {{ genre.name.toLowerCase() }}
              </v-chip>
            </v-tabs-item>
          </v-tabs-bar>
        </v-tabs>

        <!-- <ul class="pr-3">
          <li class="my-0">
            <v-menu
              content-class="filter-menu__content"
              id="genre_selector"
              class="filter_menu"
              style="display: block;"
              offset-y
            >
              <div slot="activator" class="genre-filter py-3">
                <span>{{ _.get(selected_genre, 'name', '') }}</span>
                <v-icon right>keyboard_arrow_down</v-icon>
              </div>
              <v-list>
                <v-list-tile
                  v-for="genre in available_genres"
                  :key="genre.id"
                  @click.native="setTab(genre.id)"
                >
                  <v-list-tile-title>{{ genre.name }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </li>
        </ul> -->
      </template>
    </content-top-header>

    <div class="d-flex">
      <div class="page-content" v-if="currentUser">
        <v-layout row wrap>
          <!-- <v-flex xs4 v-for="(video, i) in videos" :key="i" class="video-container top-3"> -->
          <v-flex xs4 v-for="(video, i) in videos.slice(0,3)" :key="video.name" class="video-container top-3">
            <video-box :hoverOverlay="false" :item="video" />
          </v-flex>
          <v-flex xs3 v-for="(video, ii) in videos.slice(3,videos.length)" :key="video.name" class="card-container">
            <video-box :hoverOverlay="false" :item="video" />
          </v-flex>
        </v-layout>

        <div class="text-xs-center">
          <v-btn
            v-if="isPageReady"
            v-show="pagination.current_page < pagination.total_pages"
            @click.native="loadMore()"
            class="loadmore-btn"
            >Load More</v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./index.ctrl.js"></script>
<style src="../../../static/styles/video.scss" lang="scss" scoped></style>

<style lang="scss" scoped>
.top-menu {
    margin: 0 !important;
}
.tabs__bar {
    width: calc(100% + 72px);
    position: relative;
    left: -41px;
    .tabs__li {
      margin: 0 !important;
      .tabs__item--active {
        .chip {
          background-color: #030303;
          color: #ffffff;
        }
      }
    }
}
</style>
