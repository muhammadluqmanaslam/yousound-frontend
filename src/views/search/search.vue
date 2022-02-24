<template>
  <div class="page search-page mx-5">
    <content-top-header>
      <template slot="topHeader">
        <ul>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{ active: isActiveTab(tab.id) }"
          >
            <label @click="onTab(tab.id)">
              {{ tab.title }}
              <span>({{ searchResultCount(tab.id) }})</span>
            </label>
          </li>

          <v-spacer></v-spacer>

          <li class="search-li">
            <search-input />
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="d-flex">
      <v-container grid-list-md fluid page-content px-0>
        <v-layout v-if="active_tab == 'albums'" row wrap class="covers-content">
          <v-flex
            v-for="(feed, index) in result.albums"
            :key="`album-${feed.id}`"
            class="card-container custom-lg5"
            xs12
          >
            <track-card
              :objects="result.albums"
              :objectIndex="index"
            ></track-card>
          </v-flex>
        </v-layout>

        <!-- <div v-if="active_tab == 'playlists'">
          <v-layout row wrap class="covers-content">
            <div
              v-for="(feed, index) in result.playlists"
              :key="`playlist-${feed.id}`"
              class="card-container"
            >
              <track-card
                :objects="result.playlists"
                :objectIndex="index"
              ></track-card>
            </div>
          </v-layout>
        </div> -->

        <v-layout v-if="active_tab == 'products'" row wrap class="covers-content">
          <v-flex
            v-for="(feed, index) in result.products"
            :key="`product-${feed.id}`"
            class="card-container"
          >
            <product-card :dataObject="feed"></product-card>
          </v-flex>
        </v-layout>

        <v-layout v-if="active_tab == 'live_videos'" row wrap class="covers-content">
          <div
            v-for="(feed, index) in result.streams"
            :key="`video-${feed.id}`"
            class="card-container"
            xs3
          >
            <video-box :item="feed" />
          </div>
        </v-layout>

        <v-layout v-if="active_tab == 'users'" row wrap class="covers-content">
          <v-flex
            v-for="user in result.users"
            :key="`user-${user.id}`"
            class="card-container"
            xs2
          >
            <artist-item :artist="user"></artist-item>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script type="text/javascript" src="./search.ctrl.js"></script>
