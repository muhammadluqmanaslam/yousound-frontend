<template>
  <div class="page discover-page mx-5">
    <content-top-header>
      <template slot="topHeader">
        <ul class="width100">
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{ active: isActiveTab(tab.id) }"
          >
            <label @click="isPageReady && onTab(tab.id)">{{ tab.title }}</label>
          </li>

          <v-spacer></v-spacer>

          <li class="my-0 mr-4">
            <v-menu
              content-class="filter-menu__content"
              id="genre_selector"
              class="filter_menu"
              style="display: block"
              offset-y
            >
              <div slot="activator" class="genre-filter py-3">
                <span class="mr-3">{{ selectedGenreName }}</span>
                <v-icon right>keyboard_arrow_down</v-icon>
              </div>
              <v-list>
                <v-list-tile
                  v-for="genre in genres"
                  :key="genre.id"
                  @click.native="filterByGenre(genre)"
                >
                  <div class="cursor-pointer px-3">
                    {{ genre.name }}
                  </div>
                </v-list-tile>
              </v-list>
            </v-menu>
          </li>

          <li class="my-0 ml-5 mr-2">
            <div
              class="genre-dialog-selector py-3"
              @mouseenter="hover_on_genre_button = true"
              @mouseleave="hover_on_genre_button = false"
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
        </ul>
      </template>
    </content-top-header>

    <div class="page-content" v-if="currentUser">
      <v-layout row wrap>
        <v-flex
          v-for="(feed, index) in filtered_feeds"
          :key="index"
          class="card-container custom-lg5"
          xs12
        >
          <track-card
            :objects="filtered_feeds"
            :objectIndex="index"
            :hideButtonAction="hideAlbum"
          />
        </v-flex>
      </v-layout>

      <div class="text-xs-center">
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

<style lang="scss" scoped></style>
