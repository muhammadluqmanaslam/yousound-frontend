<template>
  <div class="page discover-page mx-5">
    <div class="d-flex">
      <div class="tab-container">
        <h2 class="page-title">Display</h2>
        <ul>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{active: isActiveTab(tab.id)}"
          ><label @click="onTab(tab.id)">{{ tab.title }}</label></li>

          <li>
            <div class="genre-dialog-selector">
              <v-btn
                flat
                class="ma-0 mr-2"
                @mouseenter="hover_on_genre_button = true"
                @mouseleave="hover_on_genre_button = false"
                @click.native="openGenreSelectorDialog()"
              >
                <img src="/static/images/ic_filter.svg" width="20">
              </v-btn>
              <div
                v-show="showGenreTooltip"
                class="tooltip"
                @mouseenter="hover_on_genre_tooltip = true"
                @mouseleave="hover_on_genre_tooltip = false"
              >
                <div class="tooltip-arrow"></div>
                <div class="tooltip-inner">
                  Set your Genre Filters<br>
                  & control your experience
                  <a @click.stop="got_genre_tooltip = true">Got it!</a>
                </div>
              </div>
            </div>

            <v-menu
              v-show="activeTab!='merch'"
              content-class="filter-menu__content"
              id="genre_selector"
              class="filter_menu"
              offset-y
            >
              <v-btn dark slot="activator">Any genre
                <v-icon dark right>keyboard_arrow_down</v-icon>
              </v-btn>
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

          <li>
            <v-menu
              v-show="activeTab=='merch'"
              id="category_selector"
              class="filter_menu"
              offset-y
            >
              <v-btn dark slot="activator">Any category
                <v-icon dark right>keyboard_arrow_down</v-icon>
              </v-btn>
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

      <div class="tab-content" v-if="currentUser">
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
          <div
            v-for="feed in products"
            :key="feed.id"
            class="card-container"
          >
            <product-card :dataObject="feed"/>
          </div>
        </v-layout>

        <div class="text-xs-center">
          <v-btn
            v-if="isPageReady"
            v-show="page_index < total_pages"
            @click.native="loadMore()"
            class="loadmore-btn"
          >Load More</v-btn>
        </div>
      </div>
    </div>

    <v-dialog
      v-if="currentUser"
      v-model="show_genre_selector_dialog"
      content-class="my-genre-dialog ma-0 pa-2"
    >
      <genre-dialog
        :dismiss="closeGenreSelectorDialog"
      />
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./index.ctrl.js"></script>

<style lang="scss" scoped>
</style>
