<template>
  <div class="page discover-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">Discover</h2>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 v-if="currentUser">
      <div class="discover-tab relative">
        <v-tabs dark v-model="activeTab">
          <v-tabs-bar class="transparent">
            <v-tabs-item
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              @click.native="onTab(tab.id)"
              ripple
            >{{ tab.title }}</v-tabs-item>
            <v-tabs-slider color="white"></v-tabs-slider>
          </v-tabs-bar>

          <v-tabs-items>
            <v-tabs-content v-for="tab in tabs" :key="tab.id" :id="tab.id">
              <v-layout row wrap class="covers-content">
                <div
                  v-for="(feed, index) in filtered_feeds"
                  v-if="tab.id!='merch'"
                  :key="index"
                  class="card-container"
                >
                  <track-card
                    :objects="filtered_feeds"
                    :objectIndex="index"
                    :hideButtonAction="hideAlbum"
                  />
                  <!-- <track-card :dataObject="feed"/> -->
                </div>
                <div
                  v-for="feed in products"
                  v-if="tab.id=='merch'"
                  :key="feed.id"
                  class="card-container"
                >
                  <product-card :dataObject="feed"/>
                </div>
              </v-layout>

              <div class="text-xs-center">
                <v-btn class="loadmore-btn" @click.native="loadMore()" v-show="page_index < total_pages">Load More</v-btn>
              </div>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>

        <div class="filters-wrapper">
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
                Set your genre Filters<br>
                & control your experience
                <a @click.stop="got_genre_tooltip = true">Got it!</a>
              </div>
            </div>
          </div>

          <v-menu offset-y id="genre_selector" class="filter_menu" v-show="activeTab!='merch'">
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

          <v-menu offset-y id="category_selector" class="filter_menu" v-show="activeTab=='merch'">
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
        </div>
      </div>
    </v-flex>

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

<script type="text/javascript" src="./discover.ctrl.js"></script>
