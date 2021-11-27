<template>
  <div class="page albums-page mx-5" :class="{ isComp: isComp}">
    <content-top-header v-if="!isComp">
      <template slot="topHeader">
        <ul class="width100">
          <li class="my-0 mr-2"

              @mouseenter="hover_on_genre_button = true"
              @mouseleave="hover_on_genre_button = false"
          >
            <div
              class="genre-dialog-selector py-3"
              @click="openGenreSelectorDialog()"
            >
              <div class="genre-filter">
                <img src="/static/images/ic_filter.svg" />
              </div>
              <div v-show="showGenreTooltip" class="tooltip">
                <div class="tooltip-arrow"></div>
                <div class="tooltip-inner">
                  Set your Genre Filters<br />
                  & customize your experience
                  <a @click.stop="got_genre_tooltip = true">Got it!</a>
                </div>
              </div>
            </div>
          </li>

          <li class="width100 my-2">
            <v-tabs :scrollable="true">
              <v-tabs-bar>
                <v-tabs-item
                  v-for="(genre, idx) in genres"
                  :key="idx"
                  :href="'#tab-' + idx"
                >
                  <v-chip class="text-capitalize" @click.native="filterByGenre(genre)">
                    {{ genre.name.toLowerCase() }}
                  </v-chip>
                </v-tabs-item>
              </v-tabs-bar>
            </v-tabs>
          </li>
        </ul>
      </template>
    </content-top-header>

    <content-top-header class="__inner">
      <template slot="topHeader">
        <ul>
          <li v-if="isComp">
            <h1>Music</h1>
          </li>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{ active: isActiveTab(tab.id) }"
          >
            <label @click="isPageReady && onTab(tab.id)">{{ tab.title }}</label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="page-content" v-if="currentUser">
      <v-layout row wrap>
        <v-flex
          v-for="(feed, index) in filtered_feeds"
          :key="index"
          class="card-container feed-card custom-lg5"
          xs12
        >
          <track-card
            :objects="filtered_feeds"
            :objectIndex="index"
            :hideButtonAction="hideAlbum"
          />
        </v-flex>
      </v-layout>

      <div v-if="!isComp" class="text-xs-center">
        <v-btn
          v-if="isPageReady"
          v-show="page_index < total_pages"
          @click.native="loadMore()"
          class="loadmore-btn"
          >Load More</v-btn
        >
      </div>
    </div>

    <v-dialog
      v-if="currentUser"
      v-model="show_genre_selector_dialog"
      content-class="my-genre-dialog ma-0 pa-2"
    >
      <genre-dialog :dismiss="closeGenreSelectorDialog" />
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>

<style lang="scss" scoped>
.feed-card {
  margin-left: -16px;
  margin-right: 13px;
}
.top-menu {
    margin: 0 !important;
.tabs__bar {
    .tabs__li {
      .tabs__item--active {
        .chip {
          background-color: #030303;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
