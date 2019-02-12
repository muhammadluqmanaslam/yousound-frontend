<template>
  <div class="page main-landing-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <div class="main__header">
        <!-- <img class="logo" src="/static/images/nav_logo_primary.png"> -->
        <div class="flip">
          <div><div><span>YouSound</span> is powered by Verified Artists</div></div>
          <div><div><span>YouSound</span> is powered by Verified Brands</div></div>
          <div><div><span>YouSound</span> is powered by Verified Labels</div></div>
        </div>
      </div>
      <div class="main__content">
        <v-layout row wrap class="panel__header">
          <v-flex xs3 px-3>Albums</v-flex>
          <v-flex xs3 px-3>Live</v-flex>
          <v-flex xs3 px-3>Products</v-flex>
          <v-flex xs3 px-3>Playlists</v-flex>
        </v-layout>
        <v-layout row wrap class="panel__body">
          <v-flex xs3 px-3>
            <div class="items-list">
              <template v-for="item in result.albums">
                <album-card
                  :item="item"
                />
              </template>
            </div>
          </v-flex>
          <v-flex xs3 px-3>
            <div class="items-list">
              <template v-for="item in result.streams">
                <video-card
                  :item="item"
                />
              </template>
            </div>
          </v-flex>
          <v-flex xs3 px-3>
            <div class="items-list">
              <template v-for="item in result.products">
                <product-card
                  :item="item"
                />
              </template>
            </div>
          </v-flex>
          <v-flex xs3 px-3>
            <div class="items-list">
              <template v-for="item in result.playlists">
                <playlist-card
                  :item="item"
                />
              </template>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./main_landing.ctrl.js"></script>
