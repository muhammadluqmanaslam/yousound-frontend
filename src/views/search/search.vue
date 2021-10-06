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
        </ul>
      </template>
    </content-top-header>

    <div class="d-flex">
      <div class="page-content">
        <div v-if="active_tab == 'albums'">
          <v-layout row wrap class="covers-content">
            <div
              v-for="(feed, index) in result.albums"
              :key="`album-${feed.id}`"
              class="card-container"
            >
              <track-card
                :objects="result.albums"
                :objectIndex="index"
              ></track-card>
            </div>
          </v-layout>
        </div>

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

        <div v-if="active_tab == 'products'">
          <v-layout row wrap class="covers-content">
            <div
              v-for="(feed, index) in result.products"
              :key="`product-${feed.id}`"
              class="card-container"
            >
              <product-card :dataObject="feed"></product-card>
            </div>
          </v-layout>
        </div>

        <div v-if="active_tab == 'live_videos'">
          <v-layout row wrap class="covers-content">
            <div
              v-for="(feed, index) in result.streams"
              :key="`video-${feed.id}`"
              class="card-container"
            >
              <video-box :item="feed" />
            </div>
          </v-layout>
        </div>

        <div v-if="active_tab == 'users'">
          <v-layout row wrap class="covers-content">
            <div
              v-for="(user, index) in result.users"
              :key="`user-${user.id}`"
              class="card-container"
            >
              <artist-item :artist="user"></artist-item>
            </div>
          </v-layout>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./search.ctrl.js"></script>
