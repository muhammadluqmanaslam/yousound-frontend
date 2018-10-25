<template>
  <div class="page search-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">Search</h2>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <div class="search-tab">

        <v-tabs dark v-model="tab">
          <v-tabs-bar class="transparent">
            <v-tabs-item
              key="albums"
              href="#albums"
              @click.native="onTab('albums')"
              ripple
            >
              Albums &nbsp;<label>({{ result.albums.length }})</label>
            </v-tabs-item>
            <v-tabs-item
              key="playlists"
              href="#playlists"
              @click.native="onTab('playlists')"
              ripple
            >
              Playlists &nbsp;<label>({{ result.playlists.length }})</label>
            </v-tabs-item>
            <v-tabs-item
              key="products"
              href="#products"
              @click.native="onTab('products')"
              ripple
            >
              Merch &nbsp;<label>({{ result.products.length }}) </label>
            </v-tabs-item>
            <v-tabs-item
              key="live_videos"
              href="#live_videos"
              @click.native="onTab('live_videos')"
              ripple
            >
              Live Video &nbsp;<label>({{ result.streams.length }}) </label>
            </v-tabs-item>
            <v-tabs-item
              key="users"
              href="#users"
              @click.native="onTab('users')"
              ripple
            >
              Users &nbsp;<label>({{ result.users.length }})</label>
            </v-tabs-item>
            <v-tabs-slider color="black"></v-tabs-slider>
            <v-spacer></v-spacer>
            <!-- <v-menu offset-y id="genre_selector" class="genre-menu">
              <v-btn dark slot="activator">Any genre<v-icon dark>keyboard_arrow_down</v-icon></v-btn>
              <v-list>
                <v-list-tile v-for="genre in genres" :key="genre.id" @click.native="filterByGenres(genre)">
                <v-list-tile-title>{{ genre.name }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu> -->
          </v-tabs-bar>

          <v-tabs-items>
            <v-tabs-content key="albums" id="albums">
              <v-layout row wrap class="covers-content">
                <div class="card-container" v-for="(feed, index) in result.albums" :key="`album-${feed.id}`">
                  <track-card :objects="result.albums" :objectIndex="index"></track-card>
                </div>
              </v-layout>
            </v-tabs-content>
            <v-tabs-content key="playlists" id="playlists">
              <v-layout row wrap class="covers-content">
                <div class="card-container" v-for="(feed, index) in result.playlists" :key="`playlist-${feed.id}`">
                  <track-card :objects="result.playlists" :objectIndex="index"></track-card>
                </div>
              </v-layout>
            </v-tabs-content>
            <v-tabs-content key="products" id="products">
              <v-layout row wrap class="covers-content">
                <div class="card-container" v-for="(feed, index) in result.products" :key="`product-${feed.id}`">
                  <product-card :dataObject="feed"></product-card>
                </div>
              </v-layout>
            </v-tabs-content>
            <v-tabs-content key="live_videos" id="live_videos">
              <v-layout row wrap class="covers-content">
                <div class="card-container" v-for="(feed, index) in result.streams" :key="`stream-${feed.id}`">
                  <video-card :dataObject="feed"></video-card>
                </div>
              </v-layout>
            </v-tabs-content>
            <v-tabs-content key="users" id="users">
              <v-layout row wrap class="covers-content">
                <div class="card-container" v-for="(user, index) in result.users" :key="`user-${user.id}`">
                  <artist-item :artist="user" :key="index"></artist-item>
                </div>
              </v-layout>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./search.ctrl.js"></script>
