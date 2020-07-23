<template>
  <div class="page discover-page mx-5">
    <div class="d-flex">
      <div class="page-left">
        <div class="tab-container">
          <h2 class="page-title">Discover</h2>
          <ul class="pr-3">
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              :class="{ active: isActiveTab(tab.id) }"
            >
              <label @click="onTab(tab.id)">{{ tab.title }}</label>
            </li>

            <li v-if="activeTab != 'merch'" class="border-top my-0">
              <div
                class="genre-dialog-selector py-3"
                @mouseenter="hover_on_genre_button = true"
                @mouseleave="hover_on_genre_button = false"
                @click="openGenreSelectorDialog()"
              >
                <div class="genre-filter">
                  <span>Genre Filter</span>
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

            <li
              v-if="activeTab != 'merch'"
              class="border-top border-bottom my-0"
            >
              <v-menu
                content-class="filter-menu__content"
                id="genre_selector"
                class="filter_menu"
                style="display: block;"
                offset-y
              >
                <!-- <v-btn dark slot="activator">Any genre
                  <v-icon dark right>keyboard_arrow_down</v-icon>
                </v-btn> -->
                <div slot="activator" class="genre-filter py-3">
                  <span>{{ selectedGenreName }}</span>
                  <v-icon right>keyboard_arrow_down</v-icon>
                </div>
                <v-list>
                  <v-list-tile
                    v-for="genre in genres"
                    :key="genre.id"
                    @click.native="filterByGenre(genre)"
                  >
                    <v-list-tile-title>{{ genre.name }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </li>

            <li
              v-if="activeTab == 'merch'"
              class="border-top border-bottom my-0"
            >
              <v-menu
                id="category_selector"
                class="filter_menu"
                style="display: block;"
                offset-y
              >
                <!-- <v-btn dark slot="activator">Any category
                  <v-icon dark right>keyboard_arrow_down</v-icon>
                </v-btn> -->
                <div slot="activator" class="genre-filter py-3">
                  <span>{{ selectedCategoryName }}</span>
                  <v-icon right>keyboard_arrow_down</v-icon>
                </div>
                <v-list>
                  <v-list-tile
                    v-for="category in categories"
                    :key="category.id"
                    @click.native="filterByCategory(category)"
                  >
                    <v-list-tile-title>{{ category.name }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </li>
          </ul>
        </div>
      </div>

      <div class="page-content" v-if="currentUser">
        <v-layout row wrap v-if="activeTab != 'merch'">
          <div
            v-for="(feed, index) in filtered_feeds"
            :key="index"
            class="card-container"
          >
            <track-card
              :objects="filtered_feeds"
              :objectIndex="index"
              :hideButtonAction="hideAlbum"
            />
          </div>
        </v-layout>

        <v-layout row wrap v-else>
          <div v-for="feed in products" :key="feed.id" class="card-container">
            <product-card :dataObject="feed" />
          </div>
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
