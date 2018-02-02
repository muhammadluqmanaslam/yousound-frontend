<template>
  <div class="page discover-page">
    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">Discover</h2>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1  md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <div class="discover-tab">

        <v-tabs dark v-model="activeTab">
          <v-tabs-bar class="transparent">
            <v-tabs-item v-for="tab in tabs"
              :key="tab.id"
              :href="'#' + tab.id"
              @click.native="onTab(tab.id)"
              ripple>{{ tab.title }}</v-tabs-item>
            <v-tabs-slider color="white"></v-tabs-slider>
          </v-tabs-bar>

          <v-tabs-items>
            <v-tabs-content v-for="tab in tabs" :key="tab.id" :id="tab.id">
              <v-layout row wrap class="covers-content">
                <div v-for="(feed, index) in filtered_feeds"
                  v-if="tab.id!='merch'"
                  :key="index"
                  class="card-container">
                  <track-card :objects="filtered_feeds" :objectIndex="index"></track-card>
                  <!-- <track-card :dataObject="feed"></track-card> -->
                </div>
                <div v-for="(feed, index) in products"
                  v-if="tab.id=='merch'"
                  :key="index"
                  class="card-container">
                  <product-card :dataObject="feed"></product-card>
                </div>
              </v-layout>

              <div class="text-xs-center">
                <v-btn class="loadmore-btn" @click.native="loadMore()" v-show="page_index < total_pages">Load More</v-btn>
              </div>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>

        <v-menu offset-y id="genre_selector" class="genre_menu">
          <v-btn dark slot="activator">Any genre
            <v-icon dark right>keyboard_arrow_down</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-for="genre in genres" :key="genre.id" @click.native="filterByGenres(genre)">
              <v-list-tile-title>{{ genre.name }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

      </div>
    </v-flex>
  </div>
</template>
<script type="text/javascript" src="./discover.ctrl.js"></script>
